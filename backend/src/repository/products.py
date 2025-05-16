from typing import List, Optional

from fastapi import HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from src.models import Product, Review, Variant
from src.repository.base import BaseRepository


class ProductRepository(BaseRepository[Product, int]):
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, id: int) -> Optional[Product]:
        query = (
            select(
                Product,
                func.coalesce(func.avg(Review.rating), 0).label("average_rating"),
            )
            .options(
                selectinload(Product.variants).selectinload(
                    Variant.attributes,
                ),
                selectinload(Product.images),
                selectinload(Product.reviews),
            )
            .outerjoin(Review, Product.id == Review.product_id)
            .filter(Product.id == id)
            .group_by(Product.id)
        )
        result = await self.db.execute(query)
        row = result.first()

        if not row:
            raise HTTPException(status_code=404, detail="Product not found")

        product, average_rating = row
        product.average_rating = round(average_rating, 2)
        return product

    async def get_all(self, page: int, page_size: int) -> tuple[int, List[Product]]:
        query = (
            select(
                Product,
                func.coalesce(func.avg(Review.rating), 0).label("average_rating"),
            )
            .options(
                selectinload(Product.variants).selectinload(
                    Variant.attributes,
                ),  # Eagerly load attributes
                selectinload(Product.images),
                selectinload(Product.reviews),
            )
            .outerjoin(Review, Product.id == Review.product_id)
            .group_by(Product.id)
            .offset((page - 1) * page_size)
            .limit(page_size)
        )
        total = await self.db.scalar(select(func.count(Product.id)))
        result = await self.db.execute(query)
        rows = total, result.scalars().all()

        # Attach average rating to each product
        products = []
        for row in rows:
            product, average_rating = row
            product.average_rating = round(average_rating, 2)
            products.append(product)

        return total, products

    async def add(self, entity: Product) -> Product:
        self.db.add(entity)
        await self.db.commit()
        await self.db.refresh(entity)
        return entity

    async def update(self, id: int, entity: Product) -> Optional[Product]:
        product = await self.get_by_id(id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        for key, value in entity.dict().items():
            setattr(product, key, value)

        await self.db.commit()
        await self.db.refresh(product)
        return product

    async def delete(self, id: int) -> bool:
        product = await self.get_by_id(id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        await self.db.delete(product)
        await self.db.commit()
        return True

    # Additional method specific to products
    async def exists(self, product_id: int) -> bool:
        query = select(Product).filter(Product.id == product_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none() is not None

    async def get_paginated(self, page: int, page_size: int):
        query = (
            select(
                Product,
                func.coalesce(func.avg(Review.rating), 0).label(
                    "average_rating",
                ),  # Calculate average rating
            )
            .options(
                selectinload(Product.variants),
                selectinload(Product.images),
                selectinload(Product.reviews),
            )
            .outerjoin(Review, Product.id == Review.product_id)  # Join with reviews
            .group_by(Product.id)  # Group by product ID
            .offset((page - 1) * page_size)
            .limit(page_size)
        )
        total = await self.db.scalar(
            select(func.count(Product.id)),
        )  # Total count of products
        result = await self.db.execute(query)
        rows = result.all()

        # Attach average rating to each product
        products = []
        for row in rows:
            product, average_rating = row
            product.average_rating = round(
                average_rating,
                2,
            )  # Add average rating to the product
            products.append(product)

        return total, products
