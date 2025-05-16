from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="allow",
    )

    DB_USER: str
    DB_NAME: str
    DB_HOST: str
    DB_PORT: str = "5432"
    DB_PASSWORD: str
    LLM_MODEL: str
    EMBEDDING_MODEL: str
    AZURE_OPENAI_API_KEY: str
    AZURE_OPENAI_ENDPOINT: str
    AZURE_API_VERSION_LLM: str
    AZURE_API_VERSION_EMBEDDING_MODEL: str
    DB_EMBEDDING_TABLE_FOR_PRODUCTS: str
    DB_EMBEDDING_TABLE_FOR_REVIEWS: str
    # AZURE_COGNITIVE_KEY: str
    # AZURE_COGNITIVE_ENDPOINT: str
    # AZURE_COGNITIVE_REGION: str

    MEM0_LLM_PROVIDER: str
    MEM0_MEMORY_PROVIDER: str
    MEM0_MEMORY_TABLE_NAME: str
    MEM0_SEARCH_MSG_LIMIT: int = 1500
    MEM0_EMBEDDING_MODEL_DIMS: int = 1536
    MEM0_AZURE_OPENAI_MAX_TOKENS: int = 2000
    MEM0_AZURE_OPENAI_TEMPERATURE: float = 0.1

    PAGE_SIZE: int = 10
    TOP_K: int = 20
    PRODUCT_SEARCH_RESPONSE_SIZE: int = 8
    INVENTORY_AGENT_TIMEOUT: int = 60
    REVIEW_AGENT_TIMEOUT: int = 60
    PRODUCT_PERSONALIZATION_AGENT_TIMEOUT: int = 60
    PRESENTATION_AGENT_TIMEOUT: int = 60
    SQLALCHEMY_CONNECTION_POOL_SIZE: int = 20

    APP_VERSION: str = "0.1.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "dev"

    FE_PRODUCTS_PAGE_PATH: str = "/products"
    PHOENIX_COLLECTOR_ENDPOINT: str
    PHOENIX_CLIENT_ENDPOINT: str
    PHOENIX_PROJECT_NAME: str

    VERBOSE: bool = False

    def get_database_url(self, is_async: bool = False) -> str:
        pg_client = "postgresql+asyncpg" if is_async else "postgresql"
        return f"{pg_client}://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

    def get_mem0_memory_config(self) -> dict:
        return {
            "llm": self._get_mem0_llm_config(),
            "embedder": self._get_mem0_embedder_config(),
            "vector_store": self._get_mem0_vector_store_config(),
        }

    def _get_mem0_llm_config(self) -> dict:
        return {
            "provider": self.MEM0_LLM_PROVIDER,
            "config": {
                "model": self.LLM_MODEL,
                "temperature": self.MEM0_AZURE_OPENAI_TEMPERATURE,
                "max_tokens": self.MEM0_AZURE_OPENAI_MAX_TOKENS,
                "azure_kwargs": {
                    "azure_deployment": self.LLM_MODEL,
                    "api_version": self.AZURE_API_VERSION_LLM,
                    "azure_endpoint": self.AZURE_OPENAI_ENDPOINT,
                    "api_key": self.AZURE_OPENAI_API_KEY,
                },
            },
        }

    def _get_mem0_embedder_config(self) -> dict:
        return {
            "provider": self.MEM0_LLM_PROVIDER,
            "config": {
                "model": self.EMBEDDING_MODEL,
                "azure_kwargs": {
                    "azure_deployment": self.EMBEDDING_MODEL,
                    "api_version": self.AZURE_API_VERSION_EMBEDDING_MODEL,
                    "azure_endpoint": self.AZURE_OPENAI_ENDPOINT,
                    "api_key": self.AZURE_OPENAI_API_KEY,
                },
            },
        }

    def _get_mem0_vector_store_config(self) -> dict:
        return {
            "provider": self.MEM0_MEMORY_PROVIDER,
            "config": {
                "dbname": self.DB_NAME,
                "user": self.DB_USER,
                "password": self.DB_PASSWORD,
                "host": self.DB_HOST,
                "port": self.DB_PORT,
                "collection_name": self.MEM0_MEMORY_TABLE_NAME,
                "embedding_model_dims": self.MEM0_EMBEDDING_MODEL_DIMS,
            },
        }


settings = Settings()
