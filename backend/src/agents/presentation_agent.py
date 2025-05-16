from llama_index.core.agent.workflow import FunctionAgent
from llama_index.core.base.llms.base import BaseLLM
from src.agents.prompts import PRESENTATION_AGENT_PROMPT
from src.config.config import settings
from src.schemas.enums import AgentNames


def get_presentation_agent(llm: BaseLLM):
    return FunctionAgent(
        name=AgentNames.PRESENTATION_AGENT.value,
        llm=llm,
        system_prompt=PRESENTATION_AGENT_PROMPT,
        tools=[],
        verbose=settings.VERBOSE,
        allow_parallel_tool_calls=False,
    )
