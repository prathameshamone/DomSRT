import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSpring, animated } from '@react-spring/web';
import Sidebar from '../components/Sidebar';
import ThemeToggle from '../components/ThemeToggle';
import GithubAvatar from '../components/GithubAvatar';
import ProfileCard from '../components/ProfileCard';
import { streamChat, fetchConversationMessages } from '../lib/api';

export default function ChatPage({ conversations, refreshConversations }) {
  const { conversationId: urlConvId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const initialMessage = location.state?.initialMessage;

  const [conversationId, setConversationId] = useState(urlConvId || null);
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const bottomRef = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (urlConvId && !initialMessage) {
      fetchConversationMessages(urlConvId).then(setMessages).catch(() => {});
    }
  }, [urlConvId]);

  useEffect(() => {
    if (initialMessage && !startedRef.current) {
      startedRef.current = true;
      sendMessage(initialMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (text) => {
    setMessages((prev) => [...prev, { role: 'user', content: text }, { role: 'assistant', content: '' }]);
    setIsStreaming(true);

    streamChat(text, conversationId, {
      onConversationId: (id) => {
        setConversationId(id);
        if (!urlConvId) navigate(`/chat/${id}`, { replace: true });
      },
      onChunk: (chunk) => {
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { ...next[next.length - 1], content: next[next.length - 1].content + chunk };
          return next;
        });
      },
      onDone: () => {
        setIsStreaming(false);
        refreshConversations?.();
      },
      onError: () => setIsStreaming(false),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = e.target.elements.message.value.trim();
    if (!value || isStreaming) return;
    sendMessage(value);
    e.target.reset();
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', fontFamily: 'Poppins, sans-serif' }}>
      <Sidebar
        conversations={conversations}
        activeConversationId={conversationId}
        onNewChat={() => navigate('/')}
        onSelectConversation={(id) => navigate(`/chat/${id}`)}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '14px 18px' }}>
          <GithubAvatar onClick={() => setShowProfile(true)} />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {messages.map((msg, i) => (
            <MessageBubble key={i} role={msg.role} content={msg.content} />
          ))}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '16px 24px', display: 'flex', gap: 10 }}>
          <input
            name="message"
            type="text"
            placeholder="Ask DomSRT"
            autoComplete="off"
            disabled={isStreaming}
            style={{
              flex: 1,
              border: '0.5px solid color-mix(in srgb, var(--text) 20%, transparent)',
              borderRadius: 24,
              padding: '10px 16px',
              background: 'color-mix(in srgb, var(--text) 6%, transparent)',
              color: 'var(--text)',
              fontSize: 14,
              fontFamily: 'inherit',
              outline: 'none',
            }}
          />
          <button type="submit" disabled={isStreaming} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)' }}>
            →
          </button>
        </form>

        {showProfile && <ProfileCard onClose={() => setShowProfile(false)} />}

        <div style={{ position: 'absolute', bottom: 80, right: 18 }}>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ role, content }) {
  const spring = useSpring({
    opacity: 1,
    transform: 'translateY(0px)',
    from: { opacity: 0, transform: 'translateY(8px)' },
    config: { tension: 210, friction: 24 },
  });
  const isUser = role === 'user';

  return (
    <animated.div
      style={{
        ...spring,
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        maxWidth: '70%',
        background: isUser ? 'var(--text)' : 'color-mix(in srgb, var(--text) 8%, transparent)',
        color: isUser ? 'var(--bg)' : 'var(--text)',
        padding: '10px 14px',
        borderRadius: 14,
        fontSize: 14,
        lineHeight: 1.5,
        whiteSpace: 'pre-wrap',
      }}
    >
      {content || (!isUser && <TypingDots />)}
    </animated.div>
  );
}

function TypingDots() {
  return (
    <span style={{ display: 'inline-flex', gap: 4 }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text)', opacity: 0.5, animation: `domsrt-dot 1s ${i * 0.15}s infinite ease-in-out`, display: 'inline-block' }} />
      ))}
    </span>
  );
}