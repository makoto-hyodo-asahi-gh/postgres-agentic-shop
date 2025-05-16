from fastapi.encoders import jsonable_encoder
from sqlalchemy import DECIMAL, Column, ForeignKey, Integer
from sqlalchemy.orm import relationship

from .base import Base


class Variant(Base):
    __tablename__ = "variants"

    id = Column(Integer, primary_key=True, autoincrement=True)
    product_id = Column(
        Integer,
        ForeignKey("product.id", ondelete="CASCADE"),
        nullable=False,
    )
    price = Column(DECIMAL(10, 2), nullable=False)  # New column for price
    in_stock = Column(Integer, nullable=False)  # New column for stock quantity

    # Relationships
    product = relationship("Product", back_populates="variants")
    attributes = relationship("VariantAttribute", back_populates="variant")

    def to_dict(self):
        return jsonable_encoder(self)
