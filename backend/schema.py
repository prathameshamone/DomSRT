from datetime import datetime, timezone
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class MessageRole(str, Enum):
    """Who sent a given message in a conversation."""
    USER = "user"
    ASSISTANT = "assistant"


class ChatMessage(BaseModel):
    """
    A single message inside a conversation.
    Used both for storing history and for returning
    conversation history to the sidebar.
    """
    role: MessageRole
    content: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ChatRequest(BaseModel):
    """
    What the frontend sends when the user submits a message.
    """
    message: str = Field(..., min_length=1, description="The user's chat input")
    conversation_id: Optional[str] = Field(
        default=None,
        description="Existing conversation to continue. Omit/null to start a new one."
    )


class ChatResponse(BaseModel):
    """
    What the backend sends back after calling Gemini.
    """
    reply: str
    conversation_id: str  # always returned — new ID if one wasn't provided
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ConversationSummary(BaseModel):
    """
    Lightweight info for populating the sidebar list —
    NOT the full message history, just enough to show a clickable entry.
    """
    conversation_id: str
    title: str  # e.g. first few words of the first user message
    updated_at: datetime