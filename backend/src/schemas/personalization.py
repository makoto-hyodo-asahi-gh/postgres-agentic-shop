from typing import List, Union

from pydantic import BaseModel
from src.schemas.enums import PersonalizedCardTypes


class ListItem(BaseModel):
    type: str = PersonalizedCardTypes.LIST_CARD
    title: str
    items: List[str]


class TextCard(BaseModel):
    type: str = PersonalizedCardTypes.TEXT_CARD
    title: str
    content: str


class FeatureCard(BaseModel):
    type: str = PersonalizedCardTypes.FEATURE_CARD
    title: str
    value: str
    text: str


class PersonalizationSection(BaseModel):
    personalization: List[Union[ListItem, TextCard, FeatureCard]]


class PersonalizationResponseSchema(BaseModel):
    product_id: int
    user_id: int
    personalization: List[Union[ListItem, TextCard, FeatureCard]]
    status: str


class PersonalizationRequest(BaseModel):
    fault_correction: bool = False
