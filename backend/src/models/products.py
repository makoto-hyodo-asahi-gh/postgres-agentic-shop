from fastapi.encoders import jsonable_encoder
from sqlalchemy import (
    DECIMAL,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.schema import PrimaryKeyConstraint
from src.schemas.enums import StatusEnum

from .base import Base


class Product(Base):
    __tablename__ = "product"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String())
    category = Column(String())
    price = Column(DECIMAL(10, 2))
    brand = Column(String(64))
    description = Column(Text)
    specifications = Column(JSONB)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    reviews = relationship("Review", back_populates="product")
    images = relationship("ProductImage", back_populates="product")
    personalization = relationship(
        "PersonalizedProductSection",
        back_populates="product",
    )
    variants = relationship("Variant", back_populates="product")

    def to_dict(self):
        return jsonable_encoder(self)


class ProductImage(Base):
    __tablename__ = "product_image"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    product_id = Column(
        Integer,
        ForeignKey("product.id", ondelete="CASCADE"),
    )
    image_url = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    product = relationship("Product", back_populates="images")

    def to_dict(self):
        return jsonable_encoder(self)


class PersonalizedProductSection(Base):
    __tablename__ = "personalized_product_section"

    product_id = Column(
        Integer,
        ForeignKey("product.id", ondelete="CASCADE"),
        primary_key=True,
    )
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        primary_key=True,
    )
    personalization = Column(JSONB)
    status = Column(
        Enum(StatusEnum, name="personalized_product_section_status"),
        default=StatusEnum.pending,
        nullable=False,
    )
    phoenix_trace_id = Column(String(128), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    product = relationship("Product", back_populates="personalization")
    user = relationship("User", back_populates="personalization")

    __table_args__ = (PrimaryKeyConstraint("product_id", "user_id"),)

    def to_dict(self):
        return jsonable_encoder(self)
