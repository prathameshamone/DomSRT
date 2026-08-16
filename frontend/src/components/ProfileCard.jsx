import profileImg from '../assets/profile.jpeg';
import { useSpring, animated } from '@react-spring/web';
import { X, Mail, Phone } from 'lucide-react';

export default function ProfileCard({ onClose }) {
  const spring = useSpring({
    opacity: 1,
    transform: 'scale(1)',
    from: { opacity: 0, transform: 'scale(0.92)' },
    config: { tension: 280, friction: 24 },
  });

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.35)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        padding: '70px 24px 0 0',
        zIndex: 50,
      }}
    >
      <animated.div
        onClick={(e) => e.stopPropagation()}
        style={{
          ...spring,
          width: 340,
          maxHeight: '80vh',
          overflowY: 'auto',
          background: 'var(--bg)',
          color: 'var(--text)',
          border: '0.5px solid color-mix(in srgb, var(--text) 20%, transparent)',
          borderRadius: 16,
          padding: '20px',
          fontFamily: 'var(--font-poppins)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img
              src={profileImg}
              alt="Prathamesh Amone"
              style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 15 }}>Prathamesh Amone</p>
              <p style={{ margin: 0, fontSize: 12, opacity: 0.7 }}>Full stack developer</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, marginBottom: 18 }}>
          <a href="mailto:prathameshamone07@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'inherit', textDecoration: 'none' }}>
            <Mail size={13} /> prathameshamone07@gmail.com
          </a>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: 0.85 }}>
            <Phone size={13} /> 8261876508
          </span>
        </div>

        <Section title="Education">
          Government Polytechnic Solapur — diploma in computer science, 3rd year (graduating 2026, MSBTE K-scheme)
        </Section>

        <Section title="Experience">
          Ex-intern, Construction Department, Central Railway Solapur Division — authentication specialist on the Kaarya Siddhi intern team. Owned auth end-to-end: JWT sessions, OTP via Brevo, secure token storage, and fixed BOLA/role-injection vulnerabilities.
        </Section>

        <Section title="Projects">
          <ul style={{ margin: 0, paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <li>Kaarya Siddhi — FastAPI, Supabase, PyJWT, React Native</li>
            <li>Universal Agencies website — Firebase Firestore, admin and client dashboards</li>
            <li>Shop stock management app — electrical shop client project</li>
            <li>Weather app — React Native / Expo</li>
            <li>Truth and dare game — C</li>
          </ul>
        </Section>

        <Section title="Skills">
          Java, Python, JavaScript, C, C++ — React Native, FastAPI, Supabase, Firebase, Git/GitHub. Focus: authentication, REST APIs, mobile dev, backend architecture.
        </Section>
      </animated.div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4, opacity: 0.6, margin: '0 0 6px' }}>
        {title}
      </p>
      <div style={{ fontSize: 13, lineHeight: 1.5 }}>{children}</div>
    </div>
  );
}