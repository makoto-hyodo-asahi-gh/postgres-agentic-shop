from llama_index.embeddings.azure_openai import AzureOpenAIEmbedding
from src.config.config import settings


class EmbedModelManager:

    @classmethod
    async def get_embed_model(cls) -> AzureOpenAIEmbedding:

        return AzureOpenAIEmbedding(
            model=settings.EMBEDDING_MODEL,
            deployment_name=settings.EMBEDDING_MODEL,
            api_key=settings.AZURE_OPENAI_API_KEY,
            azure_endpoint=settings.AZURE_OPENAI_ENDPOINT,
            api_version=settings.AZURE_API_VERSION_EMBEDDING_MODEL,
        )
