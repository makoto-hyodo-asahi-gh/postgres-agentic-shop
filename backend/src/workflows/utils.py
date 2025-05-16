import asyncio
from typing import Optional

from fastapi import BackgroundTasks
from llama_index.core.base.embeddings.base import BaseEmbedding
from llama_index.core.base.llms.base import BaseLLM
from llama_index.core.memory import BaseMemory
from llama_index.core.vector_stores.types import (
    BasePydanticVectorStore,
    MetadataFilter,
    MetadataFilters,
)
from sqlalchemy.ext.asyncio import AsyncSession
from src.database import get_async_db
from src.logger import logger
from src.models.products import StatusEnum
from src.repository import (
    PersonalizedProductRepository,
    ProductRepository,
    UserRepository,
)
from src.utils.utils import set_personalization_status
from src.workflows.schemas import EventData


async def run_workflows_in_background(
    db: AsyncSession,
    user_id: int,
    product_ids: list[int],
    llm: BaseLLM,
    embed_model: BaseEmbedding,
    memory: BaseMemory,
    vector_store_products_embeddings: BasePydanticVectorStore,
    vector_store_reviews_embeddings: BasePydanticVectorStore,
    background_tasks: BackgroundTasks,
    retrigger: bool = False,
):
    """
    Run the multi-agent workflow in the background tasks for each product ID.
    """

    for product_id in product_ids:
        if not await _is_valid_product(db, product_id):
            continue
        if not await _is_valid_user(db, user_id):
            continue
        if await _should_skip_workflow(db, user_id, product_id, retrigger):
            continue

        await set_personalization_status(
            db,
            user_id,
            product_id,
            StatusEnum.running,
        )
        await _add_workflow_task(
            user_id,
            product_id,
            llm,
            embed_model,
            memory,
            vector_store_products_embeddings,
            vector_store_reviews_embeddings,
            background_tasks,
        )


async def _add_workflow_task(
    user_id: int,
    product_id: int,
    llm: BaseLLM,
    embed_model: BaseEmbedding,
    memory: BaseMemory,
    vector_store_products_embeddings: BasePydanticVectorStore,
    vector_store_reviews_embeddings: BasePydanticVectorStore,
    background_tasks: BackgroundTasks,
):
    filters = MetadataFilters(
        filters=[
            MetadataFilter(key="product_id", value=product_id),
        ],
    )
    background_tasks.add_task(
        _run_workflow_for_product,
        user_id,
        product_id,
        llm,
        embed_model,
        memory,
        filters,
        vector_store_products_embeddings,
        vector_store_reviews_embeddings,
    )
    logger.info(
        f"Workflow started in background for user ID {user_id} and product ID {product_id}.",
    )


async def _run_workflow_for_product(
    user_id: int,
    product_id: int,
    llm: BaseLLM,
    embed_model: BaseEmbedding,
    memory: BaseMemory,
    filters: Optional[MetadataFilters],
    vector_store_products_embeddings: BasePydanticVectorStore,
    vector_store_reviews_embeddings: BasePydanticVectorStore,
):
    from src.services.agent_workflow import MultiAgentWorkflowService

    async for db in get_async_db():
        try:
            workflow_service = MultiAgentWorkflowService(
                user_id=user_id,
                product_id=product_id,
                db=db,
                llm=llm,
                embed_model=embed_model,
                vector_store_products_embeddings=vector_store_products_embeddings,
                vector_store_reviews_embeddings=vector_store_reviews_embeddings,
                filters=filters,
                memory=memory,
            )
            response, trace_id = await workflow_service.run_workflow()
            await workflow_service.save_workflow_response(
                response,
                trace_id,
            )
        except Exception as e:
            logger.error(
                f"Error running workflow for user ID {user_id} and product ID {product_id}: {str(e)}",
            )
            await db.rollback()
        finally:
            await db.close()


async def _is_valid_product(db, product_id: int) -> bool:
    if not await ProductRepository(db).exists(product_id):
        logger.info(f"Product with ID {product_id} does not exist.")
        return False
    return True


async def _is_valid_user(db, user_id: int) -> bool:
    if not await UserRepository(db).exists(user_id):
        logger.info(f"User with ID {user_id} does not exist.")
        return False
    return True


async def _should_skip_workflow(
    db,
    user_id: int,
    product_id: int,
    retrigger: bool,
) -> bool:
    pp_repository = PersonalizedProductRepository(db)
    if await pp_repository.exists(id=(product_id, user_id)):
        personalized_section = await pp_repository.get_by_id(id=(product_id, user_id))
        if not retrigger and (
            personalized_section.status == StatusEnum.done
            or personalized_section.status == StatusEnum.running
        ):
            logger.info(
                f"Personalized section already exists for user ID {user_id} "
                f"and product ID {product_id}, "
                f"status {personalized_section.status.value}.",
            )
            return True
    return False


async def send_stream_event(
    data: dict,
    event_type: str,
    product_id: int,
    message_queue: asyncio.Queue,
) -> dict:
    event_data = EventData.create_event_data(
        data=data,
        event_type=event_type,
        product_id=product_id,
    )
    await message_queue.put(event_data.model_dump())
