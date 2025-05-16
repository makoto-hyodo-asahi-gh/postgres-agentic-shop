from datetime import datetime

from pydantic import BaseModel, ConfigDict
from src.schemas.reviews import ReviewResponseSchema


class ProductImageResponseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    image_url: str


class ProductResponseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    category: str
    average_rating: float
    price: float
    brand: str
    description: str
    created_at: datetime
    images: list[ProductImageResponseSchema]


class VariantAttributeResponseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    attribute_name: str
    attribute_value: str


class VariantResponseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    price: float
    in_stock: int
    attributes: list[VariantAttributeResponseSchema]


class ProductDetailsResponseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    category: str
    price: float
    average_rating: float
    brand: str
    description: str
    specifications: dict
    created_at: datetime
    reviews: list[ReviewResponseSchema]
    images: list[ProductImageResponseSchema]
    variants: list[VariantResponseSchema]


class PaginatedProductsResponseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    page: int
    page_size: int
    total: int
    products: list[ProductResponseSchema]


class ProductSearchResponseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    category: str
    price: float
    average_rating: float
    images: list[ProductImageResponseSchema]
