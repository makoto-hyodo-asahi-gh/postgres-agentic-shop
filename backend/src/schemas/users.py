from pydantic import BaseModel, ConfigDict


class UserResponseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    first_name: str
    last_name: str
    city: str
    gender: str
    age: int
    hobbies: list[str]
    avatar_url: str
    lifestyle_preferences: list[str]
    location: str | None
