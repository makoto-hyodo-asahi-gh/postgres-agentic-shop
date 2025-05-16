import asyncio
from typing import Optional

from fastapi.exceptions import HTTPException
from llama_index.core.base.embeddings.base import BaseEmbedding
from llama_index.core.base.llms.base import BaseLLM
from llama_index.core.memory import BaseMemory
from llama_index.core.vector_stores.types import (
    BasePydanticVectorStore,
    MetadataFilters,
)
from llama_index.core.workflow.errors import WorkflowTimeoutError
from src.agents import (
    get_evaluation_agent,
    get_inventory_agent,
    get_planning_agent,
    get_presentation_agent,
    get_product_personalization_agent,
    get_reviews_agent,
)
from src.config.config import settings
from src.logger import logger
from src.models.products import PersonalizedProductSection, StatusEnum
from src.repository import PersonalizedProductRepository
from src.schemas.enums import EventType
from src.workflows.multi_agent_workflow import MultiAgentFlow
from src.workflows.utils import send_stream_event


class MultiAgentWorkflowService:
    def __init__(
        self,
        user_id: int,
        db,
        llm: BaseLLM,
        embed_model: BaseEmbedding,
        vector_store_reviews_embeddings: BasePydanticVectorStore,
        vector_store_products_embeddings: BasePydanticVectorStore,
        filters: Optional[MetadataFilters],
        memory: BaseMemory,
        product_id: Optional[int] = None,
        message_queue: asyncio.Queue = None,
        timeout: int = 60,
        verbose: bool = settings.VERBOSE,
        fault_correction: bool = False,
    ):
        self.user_id = user_id
        self.product_id = product_id
        self.db = db
        self.llm = llm
        self.embed_model = embed_model
        self.filters = filters
        self.memory = memory
        self.timeout = timeout
        self.verbose = verbose
        self.message_queue = message_queue
        self.vector_store_reviews_embeddings = vector_store_reviews_embeddings
        self.vector_store_products_embeddings = vector_store_products_embeddings
        self.fault_correction = fault_correction
        self.workflow: MultiAgentFlow = self.create_workflow()

    def create_workflow(self) -> MultiAgentFlow:
        workflow = MultiAgentFlow(
            self.db,
            product_personalization_agent=get_product_personalization_agent(self.llm),
            presentation_agent=get_presentation_agent(self.llm),
            inventory_agent=get_inventory_agent(
                self.llm,
                self.embed_model,
            ),
            reviews_agent=get_reviews_agent(
                self.llm,
                self.embed_model,
                self.vector_store_reviews_embeddings,
                self.filters,
            ),
            planning_agent=get_planning_agent(self.llm),
            evaluation_agent=get_evaluation_agent(self.llm),
            memory=self.memory,
            message_queue=self.message_queue,
            timeout=self.timeout,
            verbose=self.verbose,
            fault_correction=self.fault_correction,
        )
        return workflow

    async def run_workflow(
        self,
        user_query: Optional[str] = None,
    ) -> tuple[dict, int]:
        response = None
        trace_id = None

        try:
            workflow_handler = self.workflow.run(
                user_id=self.user_id,
                product_id=self.product_id,
                user_msg=user_query,
            )
            response = await workflow_handler
            trace_id = response.pop("trace_id")

            if self.message_queue:
                await send_stream_event(
                    {
                        "message": "Your personalized section has been updated",
                    },
                    EventType.PERSONALIZATION_WORKFLOW.value,
                    self.product_id,
                    self.message_queue,
                )
            logger.info("Workflow Completed!")
        except (WorkflowTimeoutError, Exception):
            personalized_section = PersonalizedProductSection(
                product_id=self.product_id,
                user_id=self.user_id,
                status=StatusEnum.failed,
            )
            await PersonalizedProductRepository(self.db).add_or_update(
                personalized_section,
            )
            raise HTTPException(
                status_code=500,
                detail="Workflow timed out or failed",
            )

        return response, trace_id

    async def save_workflow_response(
        self,
        response: dict,
        trace_id: str,
    ) -> None:
        personalized_section = PersonalizedProductSection(
            product_id=self.product_id,
            user_id=self.user_id,
            personalization=response.get("personalization"),
            phoenix_trace_id=trace_id,
            status=StatusEnum.done,
        )
        await PersonalizedProductRepository(self.db).add_or_update(personalized_section)
        logger.info(
            "Personalized product section saved for user_id=%s, product_id=%s",
            self.user_id,
            self.product_id,
        )

        return personalized_section
