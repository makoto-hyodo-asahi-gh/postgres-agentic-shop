from fastapi import Request


async def add_user_id_to_request(request: Request, call_next):
    user_id = request.headers.get("X-User-ID")
    if user_id:
        request.state.user_id = int(user_id)
    response = await call_next(request)
    return response
