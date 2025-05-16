"""Generate sentiments for reviews

Revision ID: f3e916f4940d
Revises: 9b49601586d0
Create Date: 2025-05-08 22:28:01.270278

"""

import logging
from typing import Sequence, Union

from alembic import op
from src.config.config import settings

# revision identifiers, used by Alembic.
revision: str = "f3e916f4940d"  # pragma: allowlist secret
down_revision: Union[str, None] = "cc30da9b96c1"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

logger = logging.getLogger()


def _configure_azure_ai():
    """
    Configures Azure AI settings in the database.
    """
    try:
        logger.info("Configuring Azure AI extension and settings.")
        op.execute("CREATE EXTENSION IF NOT EXISTS azure_ai;")

        settings_queries = [
            f"SELECT azure_ai.set_setting('azure_openai.subscription_key',\
            '{settings.AZURE_OPENAI_API_KEY}');",
            f"SELECT azure_ai.set_setting('azure_openai.endpoint', '{settings.AZURE_OPENAI_ENDPOINT}');",
        ]

        for query in settings_queries:
            op.execute(query)

        logger.info("Azure AI configuration completed successfully.")
    except Exception as e:
        logger.info(f"Failed to configure Azure AI: {e}")
        raise


def upgrade() -> None:
    _configure_azure_ai()

    # This data is already set in CSV, but here it is showing how to call it dynamically
    op.execute(
        """
        UPDATE review
        SET sentiment = NULL;
        """,
    )

    logger.info("Generating sentiments...")
    op.execute(
        f"""
        WITH sentiment_extraction AS (
            SELECT
                r.id AS review_id,
                azure_ai.extract(
                    'Review: ' || r.review_text || ' Feature: ' || f.feature_name,
                    ARRAY['sentiment - sentiment about the feature as in positive, negative, or neutral'],
                    model => '{settings.LLM_MODEL}'
                ) ->> 'sentiment' AS extracted_sentiment
            FROM review r
            JOIN features f ON f.id = r.feature_id
        )
        UPDATE review
        SET sentiment = se.extracted_sentiment
        FROM sentiment_extraction se
        WHERE review.id = se.review_id;
        """,
    )

    # Following query extracts the feature being talked about in the review
    # Extract function only returns one value. The data is already present in the CSV, since it
    # takes a bit of time. Following query is for reference

    '''
    logger.info("Extracting features from reviews...")
    op.execute(f"""
        WITH features_per_review AS (
            SELECT
                r.id AS review_id,
                r.review_text,
                'productFeature: string - A feature of a product. Features should be from: ' ||
                STRING_AGG(fx.feature_name, ', ' ORDER BY fx.feature_name) || ' or NULL' AS feature_schema,
                ARRAY_AGG(fx.id) AS feature_ids,
                ARRAY_AGG(fx.feature_name) AS feature_names
            FROM review r
            JOIN product_features pf ON pf.product_id = r.product_id
            JOIN features fx ON fx.id = pf.feature_id
            GROUP BY r.id, r.review_text
        ),
        extracted_features AS (
            SELECT
                f.review_id,
                LOWER((azure_ai.extract(f.review_text, ARRAY[f.feature_schema],
                '{settings.LLM_MODEL}'))::JSONB->>'productFeature') AS extracted_feature
            FROM features_per_review f
        )
        UPDATE review
        SET feature_id = (
            SELECT fx.id
            FROM features fx
            WHERE LOWER(fx.feature_name) = ef.extracted_feature
            LIMIT 1
        )
        FROM extracted_features ef
        WHERE review.id = ef.review_id
        AND ef.extracted_feature IS NOT NULL
        AND ef.extracted_feature != 'null';
    """)
    '''


def downgrade() -> None:
    pass
