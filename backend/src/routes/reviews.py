from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from src.config.config import settings
from src.database import get_async_db
from src.repository import ReviewRepository
from src.schemas.reviews import PaginatedReviewResponseSchema, ReviewResponseSchema

router = APIRouter(
    prefix="/reviews",
    tags=["reviews"],
    responses={404: {"description": "Not found"}},
)


@router.get("/{review_id}", response_model=ReviewResponseSchema)
async def get_review(review_id: int, db: AsyncSession = Depends(get_async_db)):
    review = await ReviewRepository(db).get_by_id(review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return ReviewResponseSchema.model_validate(review)


@router.get("/", response_model=PaginatedReviewResponseSchema)
async def get_reviews(
    page: int = Query(1, ge=1),
    page_size: int = Query(settings.PAGE_SIZE, ge=1),
    db: AsyncSession = Depends(get_async_db),
):
    page_size = 500  # Set to 500 for demo purpose.
    total, reviews = await ReviewRepository(db).get_paginated(page, page_size)
    return PaginatedReviewResponseSchema(
        page=page,
        page_size=page_size,
        total=total,
        reviews=[ReviewResponseSchema.model_validate(review) for review in reviews],
    )
