# routes.py
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from schema import ChatRequest, ConversationSummary, ChatMessage
import services
import storage

router = APIRouter(prefix="/api", tags=["chat"])


@router.post("/chat")
async def chat(request: ChatRequest) -> StreamingResponse:
    """
    Stream a chat reply back as Server-Sent Events.
    Creates a new conversation if conversation_id is omitted.
    """
    return StreamingResponse(
        services.stream_chat_response(request),
        media_type="text/event-stream",
    )


@router.get("/conversations", response_model=list[ConversationSummary])
def get_conversations() -> list[ConversationSummary]:
    try:
        return storage.list_conversations()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load conversations: {str(e)}")


@router.get("/conversations/{conversation_id}/messages", response_model=list[ChatMessage])
def get_conversation_messages(conversation_id: str) -> list[ChatMessage]:
    try:
        return storage.get_conversation_history(conversation_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load conversation: {str(e)}")