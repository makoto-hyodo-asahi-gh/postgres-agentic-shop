from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class ProductSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    name: str
    category: str
    price: float
    brand: str
    description: str


class UserSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    first_name: str
    gender: str
    age: int
    hobbies: list[str]
    lifestyle_preferences: list[str]
    location: str | None
    search_history: Optional[list[str]]


class EventData(BaseModel):
    type: str
    data: dict
    meta: dict

    @classmethod
    def create_event_data(
        cls,
        data: dict,
        event_type: str,
        product_id: Optional[int] = None,
    ):
        meta = {
            "timestamp": datetime.now().isoformat() + "Z",
        }
        if product_id is not None:
            meta["product_id"] = product_id

        return cls(
            type=event_type,
            data=data,
            meta=meta,
        )
