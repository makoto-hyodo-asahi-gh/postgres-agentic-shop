from abc import ABC, abstractmethod
from typing import Generic, List, Optional, TypeVar

T = TypeVar("T")
ID = TypeVar("ID")


class BaseRepository(ABC, Generic[T, ID]):
    """
    A base repository interface to be implemented by other repository classes.
    """

    @abstractmethod
    async def get_by_id(self, id: ID) -> Optional[T]:
        """
        Retrieve an entity by its ID.
        """
        pass

    @abstractmethod
    async def get_all(self) -> List[T]:
        """
        Retrieve all entities.
        """
        pass

    @abstractmethod
    async def add(self, entity: T) -> T:
        """
        Add a new entity.
        """
        pass

    @abstractmethod
    async def update(self, id: ID, entity: T) -> Optional[T]:
        """
        Update an existing entity by its ID.
        """
        pass

    @abstractmethod
    async def delete(self, id: ID) -> bool:
        """
        Delete an entity by its ID.
        """
        pass

    @abstractmethod
    async def exists(self, id: ID) -> bool:
        """
        Check if an entity exists by its ID.
        """
        pass
