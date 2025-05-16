from fastapi.encoders import jsonable_encoder
from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .base import Base


class VariantAttribute(Base):
    __tablename__ = "variant_attributes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    product_id = Column(
        Integer,
        ForeignKey("product.id", ondelete="CASCADE"),
        nullable=False,
    )
    variant_id = Column(
        Integer,
        ForeignKey("variants.id", ondelete="CASCADE"),
        nullable=False,
    )
    attribute_name = Column(String(128), nullable=False)
    attribute_value = Column(String(128), nullable=False)

    variant = relationship("Variant", back_populates="attributes")

    def to_dict(self):
        return jsonable_encoder(self)
