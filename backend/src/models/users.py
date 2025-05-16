from fastapi.encoders import jsonable_encoder
from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship

from .base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    first_name = Column(String(255))
    last_name = Column(String(255))
    city = Column(String(255))
    gender = Column(String(64))
    age = Column(Integer)
    hobbies = Column(ARRAY(String))
    search_history = Column(ARRAY(String))
    lifestyle_preferences = Column(ARRAY(String))
    location = Column(String, nullable=True)
    avatar_url = Column(Text, nullable=True)

    personalization = relationship(
        "PersonalizedProductSection",
        back_populates="user",
    )

    def to_dict(self):
        return jsonable_encoder(self)
