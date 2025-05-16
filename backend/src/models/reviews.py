from fastapi.encoders import jsonable_encoder
from sqlalchemy import (
    DECIMAL,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.orm import relationship

from .base import Base


class Review(Base):
    __tablename__ = "review"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    product_id = Column(Integer, ForeignKey("product.id", ondelete="CASCADE"))
    user_name = Column(String(255))
    review_text = Column(Text)
    feature_id = Column(
        Integer,
        ForeignKey("features.id", ondelete="SET NULL"),
        nullable=True,
    )
    sentiment = Column(String(255))
    rating = Column(DECIMAL(5, 2))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    product = relationship("Product", back_populates="reviews")

    def to_dict(self):
        return jsonable_encoder(self)
