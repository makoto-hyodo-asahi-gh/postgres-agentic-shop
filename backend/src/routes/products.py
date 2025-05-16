import asyncio
from typing import Optional

import phoenix as px
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from llama_index.core.vector_stores.types import MetadataFilter, MetadataFilters
from phoenix.trace.dsl import SpanQuery
from sqlalchemy.ext.asyncio import AsyncSession
from src.config.config import settings
from src.config.memory import get_mem0_memory
from src.database import get_async_db
from src.models.products import StatusEnum
from src.repository import (
    PersonalizedProductRepository,
    ProductRepository,
    ReviewRepository,
)
from src.schemas.personalization import (
    PersonalizationRequest,
    PersonalizationResponseSchema,
)
from src.schemas.products import (
    PaginatedProductsResponseSchema,
    ProductDetailsResponseSchema,
    ProductResponseSchema,
)
from src.schemas.reviews import PaginatedReviewResponseSchema, ReviewResponseSchema
from src.services.agent_workflow import MultiAgentWorkflowService
from src.utils import parse_trace_to_flow
from src.utils.utils import parse_search_trace_to_flow, set_personalization_status

# TODO: THIS FILE NEEDS FIXING AFTER ASYNC CHANGES
router = APIRouter(
    prefix="/products",
    tags=["products"],
    responses={404: {"description": "Not found"}},
)


@router.get("/{product_id}", response_model=ProductDetailsResponseSchema)
async def get_product_details(
    product_id: int,
    db: AsyncSession = Depends(get_async_db),
):
    product = await ProductRepository(db).get_by_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return ProductDetailsResponseSchema.model_validate(product)


@router.get("/", response_model=PaginatedProductsResponseSchema)
async def get_products(
    page: int = Query(1, ge=1),
    page_size: int = Query(settings.PAGE_SIZE, ge=1),
    db: AsyncSession = Depends(get_async_db),
):
    total, products = await ProductRepository(db).get_paginated(page, page_size)
    return PaginatedProductsResponseSchema(
        page=page,
        page_size=page_size,
        total=total,
        products=[
            ProductResponseSchema.model_validate(product) for product in products
        ],
    )


@router.get("/{product_id}/reviews")
async def get_product_reviews(
    product_id: int,
    page: int = Query(1, ge=1),
    page_size: int = Query(settings.PAGE_SIZE, ge=1),
    db: AsyncSession = Depends(get_async_db),
):
    page_size = 500  # Set to 500 for demo purpose.
    total, reviews = await ReviewRepository(db).get_paginated_by_product(
        product_id,
        page,
        page_size,
    )
    return PaginatedReviewResponseSchema(
        page=page,
        page_size=page_size,
        total=total,
        reviews=[ReviewResponseSchema.model_validate(review) for review in reviews],
    )


@router.get(
    "/search/debug",
)
async def get_search_debug_logs(
    trace_id: Optional[str] = Query(None),
):
    """
    Get observability data for personalized section for this user and product.
    """
    client = px.Client(endpoint=settings.PHOENIX_CLIENT_ENDPOINT)
    query = SpanQuery().where(f"trace_id == '{trace_id}'")

    df = client.query_spans(query)

    if df.empty or df is None:
        raise HTTPException(status_code=404, detail="Trace not found")

    df = df[
        [
            "name",
            "span_kind",
            "parent_id",
            "start_time",
            "end_time",
            "context.trace_id",
            "context.span_id",
            "attributes.output.value",
            "attributes.input.value",
            "attributes.llm.tools",
            "attributes.tool.name",
        ]
    ]
    df = df.sort_values(by="start_time", ascending=True)

    trace_data = df.to_dict()

    return parse_search_trace_to_flow(trace_data)


@router.post(
    "/{product_id}/personalizations",
    response_model=PersonalizationResponseSchema,
)
async def generate_personalized_content(
    request: Request,
    product_id: int,
    personalization_request: PersonalizationRequest,
    db: AsyncSession = Depends(get_async_db),
):
    """
    Generate personalized content for the user.
    """
    personalized_section = None
    fault_correction = personalization_request.fault_correction

    # Check if personalized section already exists, use it.
    try:
        personalized_section = await PersonalizedProductRepository(db).get_by_id(
            id=(product_id, request.state.user_id),
        )

        if (
            personalized_section.status is StatusEnum.failed
            and personalized_section.status is not StatusEnum.running
        ):
            personalized_section = None
    except HTTPException:
        pass

    if fault_correction:
        personalized_section = None

    timeout = 60
    start_time = asyncio.get_running_loop().time()
    while personalized_section and personalized_section.status is StatusEnum.running:
        if asyncio.get_running_loop().time() - start_time > timeout:
            personalized_section = None
            break
        await db.refresh(personalized_section)  # Explicitly refresh the object
        await asyncio.sleep(2)

    if not personalized_section:
        # TODO move filter creation to helper fn
        filters = MetadataFilters(
            filters=[
                MetadataFilter(key="product_id", value=product_id),
            ],
        )

        # TODO handle workflow failures
        workflow_service = MultiAgentWorkflowService(
            user_id=request.state.user_id,
            product_id=product_id,
            db=db,
            llm=request.app.state.llm,
            embed_model=request.app.state.embed_model,
            vector_store_products_embeddings=(
                request.app.state.vector_store_products_embeddings
            ),
            vector_store_reviews_embeddings=(
                request.app.state.vector_store_reviews_embeddings
            ),
            filters=filters,
            memory=get_mem0_memory(),
            fault_correction=fault_correction,
        )

        await set_personalization_status(
            db,
            request.state.user_id,
            product_id,
            StatusEnum.running,
        )
        response, trace_id = await workflow_service.run_workflow()
        personalized_section = await workflow_service.save_workflow_response(
            response,
            trace_id,
        )
    return personalized_section


@router.get(
    "/{product_id}/personalizations",
    response_model=PersonalizationResponseSchema,
)
async def get_personalized_content(
    product_id: int,
    request: Request,
    db: AsyncSession = Depends(get_async_db),
):
    """
    Get personalized content for the user.
    """
    personalization = await PersonalizedProductRepository(db).get_by_id(
        id=(product_id, request.state.user_id),
    )
    return personalization


@router.get("/{product_id}/debug")
async def get_debug_logs(
    request: Request,
    product_id: int,
    db: AsyncSession = Depends(get_async_db),
):
    """
    Get observability data for personalized section for this user and product.
    """
    personalization = await PersonalizedProductRepository(db).get_by_id(
        id=(product_id, request.state.user_id),
    )

    client = px.Client(endpoint=settings.PHOENIX_CLIENT_ENDPOINT)
    query = SpanQuery().where(f"trace_id == '{personalization.phoenix_trace_id}'")
    df = client.query_spans(query)

    if df.empty or df is None:
        raise HTTPException(status_code=404, detail="Trace not found")

    df = df[
        [
            "name",
            "span_kind",
            "start_time",
            "end_time",
            "context.trace_id",
            "attributes.output.value",
            "attributes.input.value",
            "parent_id",
            "status_code",
            "status_message",
            "events",
        ]
    ]

    df = df.sort_values(by="start_time", ascending=True)
    trace_data = df.to_dict()

    return parse_trace_to_flow(trace_data)
