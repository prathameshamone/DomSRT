import { useSpring, animated } from '@react-spring/web';
import { useTheme } from '../context/ThemeContext';
import { flushSync } from 'react-dom';


function SunIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="4" />
            <line x1="12" y1="2" x2="12" y2="4" />
            <line x1="12" y1="20" x2="12" y2="22" />
            <line x1="4.2" y1="4.2" x2="5.6" y2="5.6" />
            <line x1="18.4" y1="18.4" x2="19.8" y2="19.8" />
            <line x1="2" y1="12" x2="4" y2="12" />
            <line x1="20" y1="12" x2="22" y2="12" />
            <line x1="4.2" y1="19.8" x2="5.6" y2="18.4" />
            <line x1="18.4" y1="5.6" x2="19.8" y2="4.2" />
        </svg>
    );
}

function MoonIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M20.5 14.5c-1 0.4-2.1 0.6-3.2 0.6-5 0-9-4-9-9 0-1.7 0.5-3.3 1.3-4.6C5.6 2.7 2.5 6.8 2.5 11.6c0 5.7 4.6 10.4 10.4 10.4 4.4 0 8.2-2.8 9.6-6.7-0.7 -0.3-1.3-0.5-2-0.8z" />
        </svg>
    );
}

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    const iconSpring = useSpring({
        transform: isDark ? 'rotate(-15deg) scale(1)' : 'rotate(0deg) scale(1)',
        opacity: 1,
        from: { opacity: 0, transform: 'scale(0.6)' },
        config: { tension: 200, friction: 18 },
    });

    const handleClick = () => {
        if (!document.startViewTransition) {
            toggleTheme();
            return;
        }
        document.startViewTransition(() => {
            flushSync(() => {
                toggleTheme();
            });
        });
    };

    return (
        <button
            onClick={handleClick}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'var(--text)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
            }}
        >
            <animated.div style={{ ...iconSpring, color: 'var(--bg)', display: 'flex' }}>
                {isDark ? <MoonIcon /> : <SunIcon />}
            </animated.div>
        </button>
    );
}