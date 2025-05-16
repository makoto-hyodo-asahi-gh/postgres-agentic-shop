from src.config.config import settings
from src.llama_index.vector_stores.pgdiskann import PGDiskAnnVectorStore


class VectorStoreManager:

    @classmethod
    async def get_vector_store(cls, db_embedding_table_name) -> PGDiskAnnVectorStore:
        return PGDiskAnnVectorStore.from_params(
            database=settings.DB_NAME,
            host=settings.DB_HOST,
            password=settings.DB_PASSWORD,
            port=settings.DB_PORT,
            user=settings.DB_USER,
            table_name=db_embedding_table_name,
            embed_dim=1536,
            use_reranking=True,
            pgdiskann_kwargs={
                "diskann_max_neighbors": 32,
                "diskann_l_value_ib": 128,
                "pq_param_num_chunks": 128,
                "product_quantized": True,
                "diskann_dist_method": "vector_cosine_ops",
                "diskann_l_value_is": 64.0,
                "quantized_fetch_limit": 50,
            },
        )
