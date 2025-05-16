import traceback
from typing import AsyncGenerator

from sqlalchemy import create_engine, event
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from src.config.config import settings
from src.logger import logger

sync_engine = create_engine(
    settings.get_database_url(is_async=False),
    pool_size=settings.SQLALCHEMY_CONNECTION_POOL_SIZE,
    echo=False,
)

# Create asynchronous engine and session
engine = create_async_engine(
    settings.get_database_url(is_async=True),
    pool_size=settings.SQLALCHEMY_CONNECTION_POOL_SIZE,
    echo=False,
)
Session = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


@event.listens_for(engine.sync_engine, "connect")
def set_search_path(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()

    try:
        # Start a new transaction
        cursor.execute('SET search_path = ag_catalog, "$user", public;')
        dbapi_connection.commit()

        # Another query for the Cypher query
        # This is expected to fail but it will load the graph for this connection
        cursor.execute(
            "SELECT * FROM ag_catalog.cypher('product_review_graph', $$ RETURN 1 $$) AS (n agtype);",
        )
        dbapi_connection.commit()

    except Exception:
        dbapi_connection.rollback()

    finally:
        cursor.close()


async def get_async_db() -> AsyncGenerator[AsyncSession, None]:
    async with Session() as session:
        try:
            yield session
        except Exception as exc:
            logger.error(exc)
            logger.error(traceback.format_exc())
            await session.rollback()
            raise
        finally:
            await session.close()
