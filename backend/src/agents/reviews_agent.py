from llama_index.core import VectorStoreIndex
from llama_index.core.agent.workflow import FunctionAgent
from llama_index.core.base.embeddings.base import BaseEmbedding
from llama_index.core.base.llms.base import BaseLLM
from llama_index.core.tools import QueryEngineTool, ToolMetadata
from llama_index.core.vector_stores.types import (
    BasePydanticVectorStore,
    MetadataFilters,
)
from src.agents.prompts import REVIEWS_AGENT_PROMPT
from src.config.config import settings
from src.schemas.enums import AgentNames


def get_reviews_agent(
    llm: BaseLLM,
    embed_model: BaseEmbedding,
    vector_store: BasePydanticVectorStore,
    filters: MetadataFilters,
):

    index = VectorStoreIndex.from_vector_store(
        vector_store=vector_store,
        embed_model=embed_model,
    )

    query_engine = index.as_query_engine(
        similarity_top_k=settings.TOP_K,
        verbose=settings.VERBOSE,
        use_async=True,
        llm=llm,
        filters=filters,
    )

    query_engine_tools = [
        QueryEngineTool(
            query_engine=query_engine,
            metadata=ToolMetadata(
                name="product_reviews_summarization",
                description=(
                    "Retrieves, summarizes and answers questions about customer reviews for a specified product."
                ),
            ),
        ),
    ]

    return FunctionAgent(
        name=AgentNames.REVIEWS_AGENT.value,
        llm=llm,
        tools=query_engine_tools,
        verbose=settings.VERBOSE,
        allow_parallel_tool_calls=False,
        system_prompt=REVIEWS_AGENT_PROMPT,
    )
