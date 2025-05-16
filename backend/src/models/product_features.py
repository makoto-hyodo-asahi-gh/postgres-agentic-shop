from sqlalchemy import Column, ForeignKey, Integer, UniqueConstraint

from .base import Base


class ProductFeature(Base):
    __tablename__ = "product_features"

    id = Column(Integer, primary_key=True, autoincrement=True)
    product_id = Column(
        Integer,
        ForeignKey("product.id", ondelete="CASCADE"),
        nullable=False,
    )
    feature_id = Column(
        Integer,
        ForeignKey("features.id", ondelete="CASCADE"),
        nullable=False,
    )

    __table_args__ = (
        UniqueConstraint("product_id", "feature_id", name="uq_product_feature"),
    )
