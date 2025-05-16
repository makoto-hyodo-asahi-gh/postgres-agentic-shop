from llama_index.llms.azure_openai import AzureOpenAI
from src.config.config import settings


class LLMManager:

    @classmethod
    async def get_llm(cls) -> AzureOpenAI:

        return AzureOpenAI(
            model=settings.LLM_MODEL,
            deployment_name=settings.LLM_MODEL,
            api_key=settings.AZURE_OPENAI_API_KEY,
            azure_endpoint=settings.AZURE_OPENAI_ENDPOINT,
            api_version=settings.AZURE_API_VERSION_LLM,
        )
