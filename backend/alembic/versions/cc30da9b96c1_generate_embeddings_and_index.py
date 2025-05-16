"""Generate embeddings and index

Revision ID: cc30da9b96c1
Revises: ef85393336cb
Create Date: 2025-05-14 17:35:21.935413

"""

import asyncio
import logging
from typing import Sequence, Union

from alembic import op
from src.config.config import settings
from src.utils.embeddings import (
    create_and_push_embeddings_for_products,
    create_and_push_embeddings_for_reviews,
)

# revision identifiers, used by Alembic.
revision: str = "cc30da9b96c1"  # pragma: allowlist secret
down_revision: Union[str, None] = "ef85393336cb"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

logger = logging.getLogger()


def upgrade() -> None:
    # create embeddings table
    asyncio.run(create_and_push_embeddings_for_products())
    asyncio.run(create_and_push_embeddings_for_reviews())

    # PGDiskAnn doesn't create index on an empty, so reinializing the vector store.
    asyncio.run(_create_vector_indexes())
    logger.info("Vector index created successfully")


def downgrade() -> None:
    # Drop the embedding table if it exists
    op.execute(f"DROP TABLE IF EXISTS data_{settings.DB_EMBEDDING_TABLE_FOR_PRODUCTS};")
    op.execute(f"DROP TABLE IF EXISTS data_{settings.DB_EMBEDDING_TABLE_FOR_REVIEWS};")


async def _create_vector_indexes():
    """Create the vector index for the embedding table."""
    from src.config.vector_store import VectorStoreManager

    # Create the vector index for the reviews embedding table
    await VectorStoreManager.get_vector_store(
        db_embedding_table_name=settings.DB_EMBEDDING_TABLE_FOR_REVIEWS,
    )

    # Create the vector index for the products embedding table
    await VectorStoreManager.get_vector_store(
        db_embedding_table_name=settings.DB_EMBEDDING_TABLE_FOR_PRODUCTS,
    )

    logger.info("Vector index created successfully")
