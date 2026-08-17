const API_BASE = 'https://domsrt.onrender.com';

export async function streamChat(message, conversationId, { onConversationId, onChunk, onDone, onError }) {
  try {
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, conversation_id: conversationId || null }),
    });
    if (!res.ok || !res.body) throw new Error('Chat request failed');

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const events = buffer.split('\n\n');
      buffer = events.pop(); // keep the last (possibly incomplete) chunk for next read

      for (const raw of events) {
        let event = 'message';
        let data = '';
        for (const line of raw.split('\n')) {
          if (line.startsWith('event:')) event = line.slice(6).trim();
          if (line.startsWith('data:')) data = line.slice(5).trim();
        }
        if (event === 'conversation') onConversationId?.(data);
        else if (event === 'chunk') onChunk?.(data.replace(/\\n/g, '\n'));
        else if (event === 'done') onDone?.();
      }
    }
  } catch (err) {
    onError?.(err);
  }
}

export async function fetchConversations() {
  const res = await fetch(`${API_BASE}/api/conversations`);
  return res.json();
}

export async function fetchConversationMessages(id) {
  const res = await fetch(`${API_BASE}/api/conversations/${id}/messages`);
  return res.json();
}
