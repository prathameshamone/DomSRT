import { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { PanelLeftClose, PanelLeftOpen, Plus, MessageCircle } from 'lucide-react';

const EXPANDED_WIDTH = 260;
const COLLAPSED_WIDTH = 56;

export default function Sidebar({ conversations = [], onNewChat, onSelectConversation, activeConversationId }) {
  const [collapsed, setCollapsed] = useState(false);

  const containerSpring = useSpring({
    width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
    config: { tension: 210, friction: 24 },
  });

  const labelSpring = useSpring({
    opacity: collapsed ? 0 : 1,
    // slight delay on the way in so text doesn't clip mid-expand
    config: { tension: 210, friction: 24 },
    delay: collapsed ? 0 : 80,
  });

  return (
    <animated.div
      style={{
        ...containerSpring,
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Poppins, sans-serif',
        background: 'color-mix(in srgb, var(--text) 4%, transparent)',
        borderRight: '0.5px solid color-mix(in srgb, var(--text) 15%, transparent)',
        flexShrink: 0,
      }}
    >
      {/* Top controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '14px 8px 10px' }}>
        <Row collapsed={collapsed} labelSpring={labelSpring}>
          <IconButton
            onClick={() => setCollapsed((v) => !v)}
            label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          </IconButton>
          <animated.span style={{ ...labelSpring, fontSize: 20, fontWeight: 600, whiteSpace: 'nowrap' }}>
            DomSRT
          </animated.span>
        </Row>

        <Row collapsed={collapsed} labelSpring={labelSpring} onClick={onNewChat} clickable>
          <IconButton
            as="div"
            label="New chat"
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'var(--text)',
              color: 'var(--bg)',
            }}
          >
            <Plus size={16} />
          </IconButton>
          <animated.span style={{ ...labelSpring, fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap' }}>
            New chat
          </animated.span>
        </Row>
      </div>

      {/* Recents */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '4px 8px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Row collapsed={collapsed} labelSpring={labelSpring}>
          <IconButton label="Chats" style={{ width: 32, height: 32 }}>
            <MessageCircle size={20} />
          </IconButton>
          <animated.span
            style={{
              ...labelSpring,
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: 0.3,
              color: 'color-mix(in srgb, var(--text) 55%, transparent)',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            Recent
          </animated.span>
        </Row>

        {!collapsed && (
          <animated.div style={{ ...labelSpring, display: 'flex', flexDirection: 'column', gap: 2, marginTop: 4 }}>
            {conversations.length === 0 && (
              <p style={{ fontSize: 12, color: 'color-mix(in srgb, var(--text) 45%, transparent)', margin: '4px 10px' }}>
                No chats yet
              </p>
            )}
            {conversations.map((conv) => {
              const isActive = conv.conversation_id === activeConversationId;
              return (
                <button
                  key={conv.conversation_id}
                  onClick={() => onSelectConversation(conv.conversation_id)}
                  style={{
                    textAlign: 'left',
                    padding: '9px 10px',
                    borderRadius: 8,
                    border: 'none',
                    background: isActive ? 'color-mix(in srgb, var(--text) 12%, transparent)' : 'transparent',
                    color: 'var(--text)',
                    fontSize: 13,
                    fontWeight: isActive ? 500 : 400,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'color-mix(in srgb, var(--text) 6%, transparent)'; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  {conv.title}
                </button>
              );
            })}
          </animated.div>
        )}
      </div>
    </animated.div>
  );
}

function Row({ children, onClick, clickable }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '6px 6px',
        borderRadius: 8,
        cursor: clickable ? 'pointer' : 'default',
      }}
    >
      {children}
    </div>
  );
}

function IconButton({ children, onClick, label, style }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--text)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        width: 32,
        height: 32,
        borderRadius: 8,
        flexShrink: 0,
        ...style,
      }}
    >
      {children}
    </button>
  );
}