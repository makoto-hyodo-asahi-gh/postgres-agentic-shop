from typing import List, Optional

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.models import PersonalizedProductSection
from src.repository.base import BaseRepository


class PersonalizedProductRepository(
    BaseRepository[PersonalizedProductSection, tuple[int, int]],
):
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(
        self,
        id: tuple[int, int],
    ) -> Optional[PersonalizedProductSection]:
        """Fetches personalized product section by user id nad product id"""
        product_id, user_id = id
        query = select(PersonalizedProductSection).filter(
            PersonalizedProductSection.product_id == product_id,
            PersonalizedProductSection.user_id == user_id,
        )
        result = await self.db.execute(query)
        personalized_section = result.scalar_one_or_none()

        if not personalized_section:
            raise HTTPException(status_code=404, detail="Personalized data not found")

        return personalized_section

    async def get_all(self) -> List[PersonalizedProductSection]:
        """Fetches all personalized product sections."""
        query = select(PersonalizedProductSection)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def add(
        self,
        entity: PersonalizedProductSection,
    ) -> PersonalizedProductSection:
        self.db.add(entity)
        await self.db.commit()
        await self.db.refresh(entity)
        return entity

    async def update(
        self,
        id: tuple[int, int],
        entity: PersonalizedProductSection,
    ) -> Optional[PersonalizedProductSection]:
        product_id, user_id = id
        query = select(PersonalizedProductSection).filter(
            PersonalizedProductSection.product_id == product_id,
            PersonalizedProductSection.user_id == user_id,
        )
        result = await self.db.execute(query)
        personalized_section = result.scalar_one_or_none()

        if not personalized_section:
            raise ValueError("PersonalizedProductSection not found")

        for field in list(entity.to_dict().keys()):
            setattr(personalized_section, field, getattr(entity, field))

        await self.db.commit()
        await self.db.refresh(personalized_section)
        return personalized_section

    async def delete(self, id: tuple[int, int]) -> bool:
        product_id, user_id = id
        query = select(PersonalizedProductSection).filter(
            PersonalizedProductSection.product_id == product_id,
            PersonalizedProductSection.user_id == user_id,
        )
        result = await self.db.execute(query)
        product = result.scalar_one_or_none()

        if not product:
            raise HTTPException(status_code=404, detail="Personalized data not found")

        await self.db.delete(product)
        await self.db.commit()
        return True

    async def exists(self, id: tuple[int, int]) -> bool:
        """Checks if the personalized section exists."""
        product_id, user_id = id
        query = select(PersonalizedProductSection).filter(
            PersonalizedProductSection.product_id == product_id,
            PersonalizedProductSection.user_id == user_id,
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none() is not None

    async def add_or_update(
        self,
        entity: PersonalizedProductSection,
    ) -> PersonalizedProductSection:
        """Helper method to either add or update an entity."""
        id = (entity.product_id, entity.user_id)
        if await self.exists(id):
            return await self.update(id, entity)
        return await self.add(entity)
