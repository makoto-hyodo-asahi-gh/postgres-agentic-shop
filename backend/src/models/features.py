from sqlalchemy import Column, Integer, String
from sqlalchemy.dialects.postgresql import JSONB

from .base import Base


class Feature(Base):
    __tablename__ = "features"

    id = Column(Integer, primary_key=True, autoincrement=True)
    feature_name = Column(String(255), nullable=False, unique=True)
    categories = Column(JSONB, nullable=False)
