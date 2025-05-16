import logging

from bs4 import BeautifulSoup
from llama_index.core import Settings, StorageContext, VectorStoreIndex
from llama_index.core.schema import TextNode
from src.config.config import settings
from src.config.embed_model import EmbedModelManager
from src.config.vector_store import VectorStoreManager
from src.logger import logger
from src.utils import load_csv_data


async def create_and_push_embeddings_for_products() -> None:
    """
    Reads product data from a CSV file, generates vector embeddings for product technical specifications
    and features, and stores them in a vector store.

    The function performs the following steps:
        1. Reads product data from the 'data/product.csv' file.
        2. Formats the data for embeddings by extracting and combining product specifications, brand, category, and colors.
        3. Creates text nodes for each product's technical specifications and features.
        4. Retrieves singleton instances of the vector store and embedding model.
        5. Generates vector embeddings using the llama_index library.
        6. Stores the generated embeddings in the vector store.

    Raises:
        Exception: If an error occurs during the embedding generation process, it is caught and logged.
    """

    try:
        # fetch data from CSV file
        products = load_csv_data("data/product.csv")
        variants = load_csv_data("data/variants.csv")
        variant_attributes = load_csv_data("data/variant_attributes.csv")

        # format data for embeddings
        data_for_embeddings = []
        product_ids = []
        product_categories = []

        for product in products:

            product_ids.append(product["id"])
            product_categories.append(product["category"])

            # Extract product specifications
            product_specifications = {}
            product_specifications["specifications"] = product["specifications"]
            product_specifications["description"] = BeautifulSoup(
                product["description"],
                "html.parser",
            ).get_text()
            product_specifications["category"] = product["category"]
            product_specifications["variants"] = [
                {
                    "attributes": ", ".join(
                        f"{attr['attribute_name']}: {attr['attribute_value']}"
                        for attr in variant_attributes
                        if attr["variant_id"] == variant["id"]
                    ),
                }
                for variant in variants
                if variant["product_id"] == product["id"]
            ]

            data_for_embeddings.append(
                ",".join(
                    f"{key} : {value}" for key, value in product_specifications.items()
                ),
            )

        nodes = [
            TextNode(text=t, metadata={"product_id": id, "category": category})
            for t, id, category in zip(
                data_for_embeddings,
                product_ids,
                product_categories,
            )
        ]

        # retrieve and set vector store and embed model instances
        Settings.embed_model = await EmbedModelManager.get_embed_model()
        storage_context = StorageContext.from_defaults(
            vector_store=await VectorStoreManager.get_vector_store(
                db_embedding_table_name=settings.DB_EMBEDDING_TABLE_FOR_PRODUCTS,
            ),
        )

        # create and push embeddings to vector store
        VectorStoreIndex(nodes, storage_context=storage_context, show_progress=True)

    except Exception as e:
        logger.error(f"Error: {e}", exc_info=True)


async def create_and_push_embeddings_for_reviews(batch_size: int = 200) -> None:
    """
    Reads review data from a CSV file in batches, generates vector embeddings for review text, and stores them in a vector store.

    The function performs the following steps:
        1. Reads review data from the 'data/reviews.csv' file.
        2. Formats the data for embeddings by extracting review text and product ID.
        3. Creates text nodes for each review text.
        4. Retrieves singleton instances of the vector store and embedding model.
        5. Generates vector embeddings using the llama_index library for each batch.
        6. Stores the generated embeddings in the vector store in batches.

    Args:
        batch_size (int): The number of reviews to process in each batch.

    Raises:
        Exception: If an error occurs during the embedding generation process, it is caught and logged.
    """

    try:
        # Fetch data from CSV file
        reviews = load_csv_data("data/review.csv")

        # Retrieve and set vector store and embed model instances
        Settings.embed_model = await EmbedModelManager.get_embed_model()
        storage_context = StorageContext.from_defaults(
            vector_store=await VectorStoreManager.get_vector_store(
                db_embedding_table_name=settings.DB_EMBEDDING_TABLE_FOR_REVIEWS,
            ),
        )

        data_for_embeddings = []
        review_ids = []
        product_ids = []

        for review in reviews:
            review_ids.append(review["id"])
            product_ids.append(review["product_id"])
            data_for_embeddings.append(review["review_text"])

        # Create nodes for the current batch
        nodes = [
            TextNode(
                text=text,
                metadata={"review_id": review_id, "product_id": product_id},
            )
            for text, review_id, product_id in zip(
                data_for_embeddings,
                review_ids,
                product_ids,
            )
        ]

        # Push embeddings for the current batch
        VectorStoreIndex(
            nodes,
            insert_batch_size=batch_size,
            storage_context=storage_context,
            show_progress=True,
        )

    except Exception as e:
        logger.error(
            f"Error in create_and_push_embeddings_for_reviews: {e}",
            exc_info=True,
        )
