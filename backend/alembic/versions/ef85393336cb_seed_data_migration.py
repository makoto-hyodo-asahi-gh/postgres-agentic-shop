"""seed data migration

Revision ID: ef85393336cb
Revises: 1ccd66af1e30
Create Date: 2025-02-21 14:44:17.246912

"""

import logging
from typing import Sequence, Union

from alembic import op
from src.config.config import settings
from src.config.memory import get_mem0_memory
from src.models.base import Base
from src.utils import load_csv_data
from src.utils.utils import add_user_preference_to_memory_during_migration

# revision identifiers, used by Alembic.
revision: str = "ef85393336cb"
down_revision: Union[str, None] = "1b33292593a9"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

table_names = [
    "users",
    "product",
    "features",
    "product_features",
    "review",
    "product_image",
    "variants",
    "variant_attributes",
]

logger = logging.getLogger()


def upgrade() -> None:

    memory = get_mem0_memory()

    for table_name in table_names:
        logger.info(f"Processing table: {table_name}")

        table = Base.metadata.tables.get(table_name)
        data = load_csv_data(f"data/{table_name}.csv")

        cleaned_data = [clean_row_data(row) for row in data]
        # add user preferences from csv to memory using Mem0
        if table_name == "users":
            add_user_preference_to_memory_during_migration(cleaned_data, memory)
            logger.info(f"Added users preferences to memory: {cleaned_data}")

            # # remove the preferences as it is not needed while inserting user data into the database
            for row in cleaned_data:
                del row["preferences"]

        op.bulk_insert(table, cleaned_data)
        logger.info(f"Inserted {len(cleaned_data)} rows into {table_name}")


def downgrade() -> None:

    op.execute(f"DROP TABLE IF EXISTS {settings.MEM0_MEMORY_TABLE_NAME};")

    for table_name in table_names:
        table = Base.metadata.tables.get(table_name)
        op.execute(table.delete())
        logger.info(f"Deleted all rows from {table_name}")


def clean_row_data(row):
    """
    Convert empty strings to None for all fields in a row.
    """
    return {key: (None if value == "" else value) for key, value in row.items()}
