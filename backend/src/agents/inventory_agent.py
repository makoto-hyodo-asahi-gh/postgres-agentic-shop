from llama_index.core import SQLDatabase
from llama_index.core.agent.workflow import FunctionAgent
from llama_index.core.base.embeddings.base import BaseEmbedding
from llama_index.core.base.llms.base import BaseLLM
from llama_index.core.query_engine import NLSQLTableQueryEngine
from llama_index.core.tools import QueryEngineTool, ToolMetadata
from src.agents.prompts import INVENTORY_AGENT_PROMPT
from src.config.config import settings
from src.database import sync_engine as engine
from src.schemas.enums import AgentNames


def get_inventory_agent(
    llm: BaseLLM,
    embed_model: BaseEmbedding,
):
    """
    Creates FunctionAgent configured to interact with a product inventory database.
    Args:
        llm: The language model to be used for natural language processing and query generation.
    Returns:
        FunctionAgent: An agent configured to query product inventory information from the database.
    """

    tables = ["variants", "variant_attributes"]

    sql_database = SQLDatabase(engine=engine, include_tables=tables)
    query_engine_database = NLSQLTableQueryEngine(
        sql_database=sql_database,
        tables=tables,
        llm=llm,
        embed_model=embed_model,
        verbose=settings.VERBOSE,
    )

    database_tool = QueryEngineTool(
        query_engine=query_engine_database,
        metadata=ToolMetadata(
            name="product_inventory",
            description="""This is a tool to query information related to products inventory from the database.

            ***NOTE :
            - while you are generating SQL queries be sure to cater the fact that some information might
            be present in a different case in the table. So try to create case insensitive queries.
            - also write a single query containing all the attributes when you are searching for a variant in the database. ***

        """,
        ),
    )

    agent = FunctionAgent(
        name=AgentNames.INVENTORY_AGENT.value,
        llm=llm,
        tools=[database_tool],
        verbose=settings.VERBOSE,
        system_prompt=INVENTORY_AGENT_PROMPT,
    )

    return agent
