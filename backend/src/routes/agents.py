import asyncio
import json

from fastapi import APIRouter, BackgroundTasks, Depends, Request
from fastapi.responses import StreamingResponse
from llama_index.core.agent.workflow import FunctionAgent
from sqlalchemy.ext.asyncio import AsyncSession
from src.agents.user_query_agent import UserQueryAgent
from src.config.memory import get_mem0_memory
from src.database import get_async_db
from src.logger import logger
from src.schemas.agents import QueryRequestSchema

router = APIRouter(
    prefix="/agents",
    tags=["agents"],
    responses={404: {"description": "Not found"}},
)


@router.post("/query")
async def user_chat(
    request: Request,
    chat_schema: QueryRequestSchema,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_async_db),
):
    """
    This endpoint handles user interaction
    - Handles user product search queries
    - Handles customization of the product personalization section based on user's query.
    """
    message_queue = asyncio.Queue()

    async def message_streamer():
        try:
            while True:
                message = await message_queue.get()
                if message is None:  # Sentinel value to indicate completion
                    break
                yield json.dumps(message) + "\n"
        except asyncio.CancelledError:
            # Ensure we clean up if the client disconnects
            pass

    async def run_chat():
        try:
            user_chat_agent = UserQueryAgent(
                db=db,
                user_query=chat_schema.user_query,
                user_id=request.state.user_id,
                product_id=chat_schema.product_id,
                memory=get_mem0_memory(),
                llm=request.app.state.llm,
                embed_model=request.app.state.embed_model,
                message_queue=message_queue,
                background_tasks=background_tasks,
                vector_store_products_embeddings=(
                    request.app.state.vector_store_products_embeddings
                ),
                vector_store_reviews_embeddings=(
                    request.app.state.vector_store_reviews_embeddings
                ),
            )
            agent: FunctionAgent = user_chat_agent.create_agent()
            logger.info("User chat agent started processing.")
            await agent.run(chat_schema.user_query)
        finally:
            logger.info("User chat agent finished processing.")
            await message_queue.put(None)  # Signal completion

    asyncio.create_task(run_chat())
    return StreamingResponse(message_streamer(), media_type="application/x-ndjson")
