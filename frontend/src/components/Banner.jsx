import { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { X } from 'lucide-react';

export default function Banner() {
  const [dismissed, setDismissed] = useState(false);

  const spring = useSpring({
    height: dismissed ? 0 : 36,
    opacity: dismissed ? 0 : 1,
    from: { height: 0, opacity: 0 },
    config: { tension: 210, friction: 24 },
  });

  return (
    <animated.div style={{ ...spring, overflow: 'hidden', flexShrink: 0 }}>
      <div
        style={{
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          fontSize: 12,
          background: 'color-mix(in srgb, var(--text) 6%, transparent)',
          borderBottom: '0.5px solid color-mix(in srgb, var(--text) 12%, transparent)',
        }}
      >
        <span>DomSRT uses Gemini AI for responses. Please double-check important information.</span>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', display: 'flex' }}
        >
          <X size={14} />
        </button>
      </div>
    </animated.div>
  );
}