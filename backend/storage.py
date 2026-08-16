# storage.py
from datetime import datetime, timezone
from typing import List, Optional

from supabase import create_client, Client

from config import settings
from schema import ChatMessage, ConversationSummary, MessageRole

# Single shared Supabase client for the whole app
_supabase: Client = create_client(settings.supabase_url, settings.supabase_key)


def create_conversation() -> str:
    """Create a new empty conversation and return its ID."""
    result = _supabase.table("conversations").insert({}).execute()
    return result.data[0]["id"]


def get_conversation_history(conversation_id: str) -> List[ChatMessage]:
    """Fetch all messages for a conversation, oldest first."""
    result = (
        _supabase.table("messages")
        .select("role, content, timestamp")
        .eq("conversation_id", conversation_id)
        .order("timestamp", desc=False)
        .execute()
    )
    return [
        ChatMessage(role=MessageRole(row["role"]), content=row["content"], timestamp=row["timestamp"])
        for row in result.data
    ]


def save_message(conversation_id: str, role: MessageRole, content: str) -> None:
    """Save a single message to a conversation and bump the conversation's updated_at."""
    _supabase.table("messages").insert({
        "conversation_id": conversation_id,
        "role": role.value,
        "content": content,
    }).execute()

    _supabase.table("conversations").update({
        "updated_at": datetime.now(timezone.utc).isoformat()
    }).eq("id", conversation_id).execute()


def set_conversation_title_if_new(conversation_id: str, first_message: str) -> None:
    """
    If this conversation still has the default title, set it based on
    the first user message (truncated), so the sidebar shows something useful.
    """
    truncated = first_message[:50] + ("..." if len(first_message) > 50 else "")
    _supabase.table("conversations").update({
        "title": truncated
    }).eq("id", conversation_id).eq("title", "New Chat").execute()


def list_conversations() -> List[ConversationSummary]:
    """Fetch all conversations, most recently updated first — for the sidebar."""
    result = (
        _supabase.table("conversations")
        .select("id, title, updated_at")
        .order("updated_at", desc=True)
        .execute()
    )
    return [
        ConversationSummary(conversation_id=row["id"], title=row["title"], updated_at=row["updated_at"])
        for row in result.data
    ]