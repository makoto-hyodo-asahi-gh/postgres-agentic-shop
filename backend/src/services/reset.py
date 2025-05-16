from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from src.config.memory import get_mem0_memory
from src.logger import logger
from src.utils import load_csv_data
from src.utils.utils import add_user_preference_to_memory_during_migration


def clean_row_data(row):
    """
    Convert empty strings to None for all fields in a row.
    """
    return {key: (None if value == "" else value) for key, value in row.items()}


async def reset_user_preferences(db: AsyncSession) -> bool:

    try:
        async with db.begin():
            logger.info("Deleting from personalized_product_section table")
            await db.execute(text("DELETE FROM personalized_product_section;"))

            logger.info("Deleting from mem0_chatstore table")
            await db.execute(text("DELETE FROM mem0_chatstore;"))

            logger.info("Deleting from mem0migrations table")
            await db.execute(text("DELETE FROM mem0migrations;"))

        logger.info("Adding default data to mem0_chatstore table")
        memory = get_mem0_memory()

        data = load_csv_data("data/users.csv")
        cleaned_data = [clean_row_data(row) for row in data]
        add_user_preference_to_memory_during_migration(cleaned_data, memory)

        return True

    except Exception as e:
        logger.error(f"Error: {e}", exc_info=True)
        return False
