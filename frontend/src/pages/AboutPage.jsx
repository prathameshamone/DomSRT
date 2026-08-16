import { useSpring, animated } from '@react-spring/web';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

export default function AboutPage() {
  const fadeIn = useSpring({
    opacity: 1,
    transform: 'translateY(0px)',
    from: { opacity: 0, transform: 'translateY(10px)' },
    config: { tension: 180, friction: 20 },
  });

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Poppins, sans-serif', position: 'relative', padding: '0 24px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', paddingTop: 40 }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text)', textDecoration: 'none', fontSize: 13, marginBottom: 32 }}>
          <ArrowLeft size={15} /> Back to chat
        </Link>

        <animated.div style={fadeIn}>
          <h1 style={{ fontSize: 28, fontWeight: 600, margin: '0 0 12px' }}>About DomSRT</h1>
          <p style={{ fontSize: 15, lineHeight: 1.7, opacity: 0.85, margin: '0 0 24px' }}>
            DomSRT is a personal AI chat project built from the ground up — starting as a console script
            and growing into a full web application with persistent conversations and a streaming chat experience.
          </p>

          <h2 style={{ fontSize: 16, fontWeight: 600, margin: '28px 0 8px' }}>How it works</h2>
          <p style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.85, margin: 0 }}>
            Every message is sent to a FastAPI backend, which streams a response back from Google's Gemini AI
            in real time. Conversations are saved to Supabase, so past chats are always available in the sidebar.
          </p>

          <h2 style={{ fontSize: 16, fontWeight: 600, margin: '28px 0 8px' }}>Built with</h2>
          <p style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.85, margin: 0 }}>
            FastAPI, Supabase, Google Gemini, React, Tailwind, and React Spring for the interface.
          </p>
        </animated.div>
      </div>

      <div style={{ position: 'fixed', bottom: 16, right: 18 }}>
        <ThemeToggle />
      </div>
    </div>
  );
}