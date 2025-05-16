import traceback
from typing import Dict, List, Union

from llama_index.core import Settings, VectorStoreIndex
from llama_index.core.vector_stores.types import (
    BasePydanticVectorStore,
    MetadataFilter,
    MetadataFilters,
)
from llama_index.embeddings.azure_openai import AzureOpenAIEmbedding
from llama_index.llms.azure_openai import AzureOpenAI
from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from src.config.config import settings as app_settings
from src.logger import logger
from src.models.products import Product
from src.models.reviews import Review
from src.models.users import User
from src.schemas.products import ProductSearchResponseSchema


async def save_user_search(db: AsyncSession, user_id: int, user_search: str) -> None:
    """
    Save the user's search query to the PostgreSQL database.
    Args:
        db (AsyncSession): The database session.
        user_id (int): The user ID.
        user_search (str): The search query string.
    Returns:
        None
    Raises:
        Exception: If there is an error during the database operation.
    """

    try:
        logger.info(
            f"Saving user search query '{user_search}' to database for user ID: {user_id}",
        )

        user = await db.execute(select(User).filter(User.id == user_id))
        user = user.scalars().one_or_none()

        if not user:
            return

        if user.search_history is None:
            user.search_history = []

        # insert
        user.search_history = [user_search] + user.search_history

        # keep only the last 5 searches
        user.search_history = user.search_history[:5]

        await db.commit()

    except Exception as e:
        logger.error(
            f"Error saving user search query to database: {e}\n{traceback.format_exc()}",
        )
        raise


async def get_products_by_ids(
    db: AsyncSession,
    product_ids: List[str],
    query: str,
) -> Union[List[Dict], List]:
    """
    Fetch product details from the PostgreSQL database.
    Args:
        db (AsyncSession): The database session.
        product_ids (List[str]): A list of product IDs to fetch from the database.
    Returns:
        List[Dict]: A list of dictionaries containing the product details.
    """

    try:
        logger.info(f"Fetching products from database: {product_ids}")

        # Fetch products with images and rating
        result = await db.execute(
            select(
                Product,
                func.coalesce(func.avg(Review.rating), 0).label("average_rating"),
            )
            .outerjoin(Review, Product.id == Review.product_id)
            .options(
                selectinload(Product.images),
                selectinload(Product.reviews),
            )
            .filter(Product.id.in_(product_ids))
            .group_by(Product.id),
        )
        products_with_ratings = result.all()

        # Extract products and their average ratings
        products = [row[0] for row in products_with_ratings]
        product_ratings = {
            str(row[0].id): round(row[1], 2) for row in products_with_ratings
        }

        # creating dictionary for faster lookup
        product_dict = {product.id: product for product in products}

        # Make the order of the retrieved products from the database the same as retrieved from the vector store
        sorted_products = [
            product_dict[prod_id] for prod_id in product_ids if prod_id in product_dict
        ]

        # Pydantic model validation
        products_validated = [
            ProductSearchResponseSchema.model_validate(
                {
                    **product.__dict__,
                    "average_rating": product_ratings[str(product.id)],
                },
                from_attributes=True,
            )
            for product in sorted_products
        ]

        return products_validated

    except Exception as e:
        logger.error(
            f"Error fetching products from database: {e}\n{traceback.format_exc()}",
        )
        raise


async def product_search(
    db: AsyncSession,
    vector_store: BasePydanticVectorStore,
    llm: AzureOpenAI,
    embed_model: AzureOpenAIEmbedding,
    query: str,
    user_id: int,
    product_category: str = None,
) -> Union[List[Dict], List]:
    """
    Perform a vector search using llama_index to find the most similar products.
    Args:
        db (AsyncSession): The database session.
        query (str): The search query string to find similar products.
    Returns:
        Union[List[Dict], None]: A list of dictionaries containing the text and metadata of the most similar products,
        or None if no products are found.
    Raises:
        Exception: If there is an error during the vector search process.
    """

    try:
        logger.info(f"Performing vector search for query: {query}")

        # use our own llm and embed_model
        Settings.llm = llm
        Settings.embed_model = embed_model

        # Create a VectorStoreIndex from the vector store
        index = VectorStoreIndex.from_vector_store(
            vector_store=vector_store,
            Settings=Settings,
        )

        # retrieving product categories the current query can possibly belong to for filtration
        filters = MetadataFilters(
            filters=[MetadataFilter(key="category", value=product_category)],
        )

        # Perform a similarity search using the query string
        query_engine = index.as_retriever(
            similarity_top_k=app_settings.TOP_K,
            filters=filters,
        )
        results = query_engine.retrieve(query)

        # fetch products from database
        if results:
            logger.info(
                f"Retrieved {len(results)} products from vector store for query: {query}",
            )

            product_ids = [product.metadata["product_id"] for product in results]

            products = await get_products_by_ids(db, product_ids, query)

            # save the user search query to the database
            await save_user_search(db, user_id=user_id, user_search=query)

            return products
        else:
            logger.info(
                f"Similarity search performed after vector embeddings did not return any products: {query}",
            )
            return []

    except Exception as e:
        logger.error(f"Error performing product search: {e}\n{traceback.format_exc()}")
        raise
