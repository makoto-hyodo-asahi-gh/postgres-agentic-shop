"""create-apache-age-graph

Revision ID: f41ba96cab17
Revises: ef85393336cb
Create Date: 2025-05-08 10:50:43.323063

"""

import logging
from typing import Sequence, Union

from alembic import op
from sqlalchemy import text
from src.config.config import settings

logger = logging.getLogger()

# revision identifiers, used by Alembic.
revision: str = "f41ba96cab17"  # pragma: allowlist secret
down_revision: Union[str, None] = "f3e916f4940d"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

GRAPH_NAME = "product_review_graph"
BATCH_SIZE = 100


def create_product_vertex(op, product: dict):
    """Execute cypher query to create a product vertex."""
    cypher_query = f"""
        SELECT * FROM cypher('{GRAPH_NAME}', $$
            CREATE (p:Product {{
                id: {product[0]},
                name: '{str(product[1]).replace("''", '"')}',
                category: '{str(product[2]).replace("''", '"')}'
            }})
            RETURN count(p)
        $$) AS (count agtype);
    """
    op.execute(cypher_query)


def create_review_vertex(op, review: dict):
    """Execute cypher query to create a review vertex."""
    cypher_query = f"""
        SELECT * FROM cypher('{GRAPH_NAME}', $$
            CREATE (r:Review {{
                id: {review[0]},
                product_id: {review[1]},
                feature_id: {review[2] if review[2] else "NULL"},
                sentiment: "{str(review[3])}",
                text: "{str(review[4])}"
            }})
            RETURN count(r)
        $$) AS (count agtype);
    """
    op.execute(cypher_query)


def create_feature_vertex(op, feature: dict):
    """Execute cypher query to create a review vertex."""
    cypher_query = f"""
        SELECT * FROM cypher('{GRAPH_NAME}', $$
            CREATE (r:Feature {{
                id: {feature[0]},
                name: '{str(feature[1])}',
                categories: {feature[2]}
            }})
            RETURN count(r)
        $$) AS (count agtype);
    """
    op.execute(cypher_query)


def create_product_feature_edge(op, product_feature: dict):
    """Create edge between product and feature nodes."""
    op.execute(
        f"""
       SELECT * FROM ag_catalog.cypher('{GRAPH_NAME}', $$
            MATCH (p:Product), (f:Feature)
            WHERE p.id = {product_feature[0]} AND f.id = {product_feature[1]}
            CREATE (p)-[rel:HAS_FEATURE]->(f)
            RETURN count(rel) as rel_count
        $$) as (rel_count agtype);
    """,
    )


def get_table_data(op, table_name: str, col_names: list[str], offset: int) -> list:
    """Fetch a batch of products from the database."""
    query = text(
        f"""
        SELECT {', '.join(col_names)} FROM {table_name} ORDER BY id LIMIT {BATCH_SIZE} OFFSET {offset}
    """,
    )

    conn = op.get_bind()
    result = conn.execute(query)
    return result.fetchall()


def generate_product_vertexes():
    logger.info("Creating product vertexes...")
    offset = 0
    while True:
        products = get_table_data(
            op,
            table_name="product",
            col_names=["id", "name", "category"],
            offset=offset,
        )
        if not products:
            break

        for product in products:
            create_product_vertex(op, product)

        offset += BATCH_SIZE
    logger.info("Product vertexes Created.")


def generate_review_vertexes():
    logger.info("Creating review vertexes...")
    offset = 0
    while True:
        reviews = get_table_data(
            op,
            table_name="review",
            col_names=["id", "product_id", "feature_id", "sentiment", "review_text"],
            offset=offset,
        )
        if not reviews:
            break

        for review in reviews:
            create_review_vertex(op, review)

        offset += BATCH_SIZE
    logger.info("Review vertexes created.")


def generate_feature_vertexes():
    logger.info("Creating feature vertexes...")
    offset = 0
    while True:
        features = get_table_data(
            op,
            table_name="features",
            col_names=["id", "feature_name", "categories"],
            offset=offset,
        )
        if not features:
            break

        for feature in features:
            create_feature_vertex(op, feature)

        offset += BATCH_SIZE
    logger.info("Feature vertexes created.")


def generate_product_feature_edges():
    logger.info("Creating product-feature edges...")
    offset = 0
    while True:
        product_features = get_table_data(
            op,
            table_name="product_features",
            col_names=["product_id", "feature_id"],
            offset=offset,
        )
        if not product_features:
            break

        for product_feature in product_features:
            create_product_feature_edge(op, product_feature)
        offset += BATCH_SIZE
    logger.info("Product-feature edges created.")


def upgrade() -> None:
    # Enable Apache AGE extension
    op.execute("CREATE EXTENSION IF NOT EXISTS age;")
    op.execute('SET search_path = ag_catalog, "$user", public;')

    op.execute(f"SELECT create_graph('{GRAPH_NAME}');")
    logger.info(f"Graph {GRAPH_NAME} created.")

    # CREATING VERTEXES (NODES)
    generate_product_vertexes()
    generate_review_vertexes()
    generate_feature_vertexes()

    # CREATING EDGES
    generate_product_feature_edges()

    logger.info("Creating edges between product-review edges...")
    op.execute(
        """
       SELECT * FROM cypher('product_review_graph', $$
            MATCH (p:Product), (r:Review)
            WHERE p.id = r.product_id
            CREATE (p)-[rel:REVIEWS]->(r)
            RETURN count(rel) as relationship_count
        $$) as (relationship_count agtype);
    """,
    )
    logger.info("Product-review edges created.")

    logger.info("Creating edges between review-feature positive_sentiment edges...")
    op.execute(
        """
        SELECT * FROM ag_catalog.cypher('product_review_graph', $$
            MATCH (r:Review), (f:Feature)
            WHERE r.feature_id = f.id AND r.sentiment = 'positive'
            CREATE (r)-[rel:positive_sentiment {sentiment: r.sentiment, product_id: r.product_id, feature_id: r.feature_id}]->(f)
            RETURN count(rel) as relationship_count
        $$) as (relationship_count agtype);
    """,
    )
    logger.info("Review-feature positive_sentiment edges created.")

    logger.info("Creating edges between review-feature negative_sentiment edges...")
    op.execute(
        """
        SELECT * FROM ag_catalog.cypher('product_review_graph', $$
            MATCH (r:Review), (f:Feature)
            WHERE r.feature_id = f.id AND r.sentiment = 'negative'
            CREATE (r)-[rel:negative_sentiment {sentiment: r.sentiment, product_id: r.product_id, feature_id: r.feature_id}]->(f)
            RETURN count(rel) as relationship_count
        $$) as (relationship_count agtype);
    """,
    )
    logger.info("Review-feature negative_sentiment edges created.")

    logger.info("Creating edges between review-feature neutral_sentiment edges...")
    op.execute(
        """
        SELECT * FROM ag_catalog.cypher('product_review_graph', $$
            MATCH (r:Review), (f:Feature)
            WHERE r.feature_id = f.id AND r.sentiment = 'neutral'
            CREATE (r)-[rel:neutral_sentiment {sentiment: r.sentiment, product_id: r.product_id, feature_id: r.feature_id}]->(f)
            RETURN count(rel) as relationship_count
        $$) as (relationship_count agtype);
    """,
    )
    logger.info("Review-feature neutral_sentiment edges created.")

    op.execute(
        f'ALTER DATABASE {settings.DB_NAME} SET search_path = ag_catalog, "$user", public;',
    )


def downgrade() -> None:
    op.execute('SET search_path = ag_catalog, "$user", public;')

    # Drop the graph
    op.execute(f"SELECT drop_graph('{GRAPH_NAME}', true);")
