from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ReviewResponseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_name: str
    review_text: str
    rating: float
    created_at: datetime


class PaginatedReviewResponseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    page: int
    page_size: int
    total: int
    reviews: list[ReviewResponseSchema]
