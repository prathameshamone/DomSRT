# services.py
from typing import AsyncGenerator

from google import genai
from google.genai import types

from config import settings
from schema import ChatRequest, MessageRole
import storage

_client = genai.Client(api_key=settings.google_api_key)


def _build_gemini_history(chat_messages) -> list[types.Content]:
    role_map = {MessageRole.USER: "user", MessageRole.ASSISTANT: "model"}
    return [
        types.Content(role=role_map[msg.role], parts=[types.Part(text=msg.content)])
        for msg in chat_messages
    ]


async def stream_chat_response(request: ChatRequest) -> AsyncGenerator[str, None]:
    """
    Handle a full chat turn as a stream: resolve the conversation,
    stream chunks from Gemini as they arrive, then persist the
    complete exchange once streaming finishes.

    Yields raw text chunks. The route layer wraps these as SSE.
    """
    is_new_conversation = request.conversation_id is None
    conversation_id = request.conversation_id or storage.create_conversation()

    # First chunk sent is always the conversation_id, so the frontend
    # knows which thread this belongs to before any text arrives.
    yield f"event: conversation\ndata: {conversation_id}\n\n"

    history = [] if is_new_conversation else storage.get_conversation_history(conversation_id)
    gemini_history = _build_gemini_history(history)

    chat = _client.chats.create(model=settings.gemini_model, history=gemini_history)

    full_reply = ""
    for chunk in chat.send_message_stream(request.message):
        if chunk.text:
            full_reply += chunk.text
            # SSE data lines can't contain raw newlines — escape them
            safe_chunk = chunk.text.replace("\n", "\\n")
            yield f"event: chunk\ndata: {safe_chunk}\n\n"

    # Persist only after the full reply has been assembled
    storage.save_message(conversation_id, MessageRole.USER, request.message)
    storage.save_message(conversation_id, MessageRole.ASSISTANT, full_reply)

    if is_new_conversation:
        storage.set_conversation_title_if_new(conversation_id, request.message)

    yield "event: done\ndata: \n\n"