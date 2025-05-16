from typing import List, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.models import User
from src.repository.base import BaseRepository


class UserRepository(BaseRepository[User, int]):
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, id: int) -> Optional[User]:
        """Fetches user information"""
        query = select(User).filter(User.id == id)
        result = await self.db.execute(query)
        user = result.scalar_one_or_none()
        return user

    async def get_all(self) -> List[User]:
        """Fetches all users"""
        query = select(User).order_by(User.id)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def add(self, entity: User) -> User:
        self.db.add(entity)
        await self.db.commit()
        await self.db.refresh(entity)
        return entity

    async def update(self, id: int, entity: User) -> Optional[User]:
        query = select(User).filter(User.id == id)
        result = await self.db.execute(query)
        user = result.scalar_one_or_none()

        if not user:
            return None

        for key, value in entity.dict().items():
            setattr(user, key, value)

        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def delete(self, id: int) -> bool:
        query = select(User).filter(User.id == id)
        result = await self.db.execute(query)
        user = result.scalar_one_or_none()

        if not user:
            return False

        await self.db.delete(user)
        await self.db.commit()
        return True

    async def exists(self, id: int) -> bool:
        """Check if a user exists"""
        query = select(User).filter(User.id == id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none() is not None
