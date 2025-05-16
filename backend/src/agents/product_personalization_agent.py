from llama_index.core.agent.workflow import FunctionAgent
from llama_index.core.base.llms.base import BaseLLM
from src.agents.prompts import PRODUCT_PERSONALIZATION_AGENT_PROMPT
from src.config.config import settings
from src.schemas.enums import AgentNames


def get_product_personalization_agent(llm: BaseLLM):
    return FunctionAgent(
        name=AgentNames.PRODUCT_PERSONALIZATION_AGENT.value,
        llm=llm,
        system_prompt=PRODUCT_PERSONALIZATION_AGENT_PROMPT,
        tools=[],
        allow_parallel_tool_calls=False,
        verbose=settings.VERBOSE,
    )
