from typing import Optional

from pydantic import BaseModel


class QueryRequestSchema(BaseModel):
    product_id: Optional[int] = None
    user_query: str


class UserQueryAgentResponse(BaseModel):
    personalization: Optional[list[dict]] = None
    message: Optional[str] = None
    products: Optional[list[dict]] = None
    redirect_url: Optional[str] = None
    agent_action: Optional[str] = None
