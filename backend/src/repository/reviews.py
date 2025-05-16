from typing import List, Optional

from sqlalchemy import exists, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from src.models import Review
from src.repository.base import BaseRepository


class ReviewRepository(BaseRepository[Review, int]):
    """Repository for managing Review entities."""

    def __init__(self, db: AsyncSession):
        self.db: AsyncSession = db

    async def get_by_id(self, id: int) -> Optional[Review]:
        """Retrieve a review by its ID."""
        query = select(Review).filter(Review.id == id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_all(self) -> List[Review]:
        """Retrieve all reviews."""
        query = select(Review)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def add(self, entity: Review) -> Review:
        """Add a new review."""
        self.db.add(entity)
        await self.db.commit()
        await self.db.refresh(entity)
        return entity

    async def update(self, id: int, entity: Review) -> Optional[Review]:
        """Update a review by its ID."""
        review = await self.get_by_id(id)
        if not review:
            return None

        try:
            for key, value in entity.dict(exclude_unset=True).items():
                setattr(review, key, value)

            await self.db.commit()
            await self.db.refresh(review)
            return review
        except Exception:
            await self.db.rollback()
            return None

    async def delete(self, id: int) -> bool:
        """Delete a review by its ID."""
        review = await self.get_by_id(id)
        if not review:
            return False

        await self.db.delete(review)
        await self.db.commit()
        return True

    async def exists(self, review_id: int) -> bool:
        """Check if a review exists by its ID."""
        query = select(exists().where(Review.id == review_id))
        result = await self.db.execute(query)
        return result.scalar()

    async def get_all_reviews_for_product(self, product_id: int) -> List[Review]:
        """Get all reviews for a specific product."""
        query = select(Review).filter(Review.product_id == product_id)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_paginated_by_product(
        self,
        product_id: int,
        page: int,
        page_size: int,
    ):
        """Get paginated reviews for a specific product."""
        query = select(Review).filter(Review.product_id == product_id)
        total = await self.db.scalar(
            select(func.count())
            .select_from(Review)
            .filter(Review.product_id == product_id),
        )
        result = await self.db.execute(
            query.offset((page - 1) * page_size).limit(page_size),
        )
        return total, list(result.scalars().all())

    async def get_paginated(
        self,
        page: int,
        page_size: int,
    ):
        """Get paginated reviews."""
        total = await self.db.scalar(select(func.count()).select_from(Review))
        query = select(Review).offset((page - 1) * page_size).limit(page_size)
        result = await self.db.execute(query)
        return total, list(result.scalars().all())
