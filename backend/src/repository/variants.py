from typing import List

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from src.models.variants import Variant
from src.repository.base import BaseRepository


class VariantRepository(BaseRepository[Variant, int]):
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, id: int) -> Variant:
        """
        Retrieve a variant by its ID.
        """
        result = await self.db.execute(
            select(Variant)
            .options(selectinload(Variant.attributes))
            .filter(Variant.id == id),
        )
        return result.scalars().first()

    async def get_all(self) -> List[Variant]:
        """
        Retrieve all variants.
        """
        result = await self.db.execute(
            select(Variant).options(selectinload(Variant.attributes)),
        )
        return result.scalars().all()

    async def get_variants_by_product_id(self, product_id: int) -> List[Variant]:
        """
        Retrieve all variants for a specific product by product_id.
        """
        result = await self.db.execute(
            select(Variant)
            .options(selectinload(Variant.attributes))
            .filter(Variant.product_id == product_id),
        )
        return result.scalars().all()

    async def add(self, entity: Variant) -> Variant:
        """
        Add a new variant.
        """
        self.db.add(entity)
        await self.db.commit()
        await self.db.refresh(entity)
        return entity

    async def update(self, id: int, entity: Variant) -> Variant:
        """
        Update an existing variant by its ID.
        """
        existing_variant = await self.get_by_id(id)
        if not existing_variant:
            return None
        for key, value in entity.__dict__.items():
            setattr(existing_variant, key, value)
        await self.db.commit()
        await self.db.refresh(existing_variant)
        return existing_variant

    async def delete(self, id: int) -> bool:
        """
        Delete a variant by its ID.
        """
        existing_variant = await self.get_by_id(id)
        if not existing_variant:
            return False
        await self.db.delete(existing_variant)
        await self.db.commit()
        return True

    async def exists(self, id: int) -> bool:
        """
        Check if a variant exists by its ID.
        """
        result = await self.db.execute(select(Variant).filter(Variant.id == id))
        return result.scalars().first() is not None
