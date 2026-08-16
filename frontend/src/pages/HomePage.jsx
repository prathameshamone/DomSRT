import { useSpring, animated } from '@react-spring/web';
import Sidebar from '../components/Sidebar';
import ThemeToggle from '../components/ThemeToggle';
import Banner from '../components/Banner';
import GithubAvatar from '../components/GithubAvatar';
import { useState } from 'react';
import ProfileCard from '../components/ProfileCard';
import { useNavigate } from 'react-router-dom';

const GREETINGS = [
    "What's the vibe, {name}?",
    "Good to see you, {name}.",
    "What's on your mind, {name}?",
    "Ready when you are, {name}.",
    "Let's build something, {name}.",
    "Hey {name}, what's up?",
];

export default function HomePage({ userName = 'Prathamesh', onSend, conversations, onNewChat, onSelectConversation }) {
    const [showProfile, setShowProfile] = useState(false);



    const [greeting] = useState(() => {
        const pick = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
        return pick.replace('{name}', userName);
    });

    const greetingSpring = useSpring({
        opacity: 1,
        transform: 'translateY(0px)',
        from: { opacity: 0, transform: 'translateY(12px)' },
        delay: 150,
        config: { tension: 180, friction: 20 },
    });

    const searchSpring = useSpring({
        opacity: 1,
        transform: 'scale(1)',
        from: { opacity: 0, transform: 'scale(0.96)' },
        delay: 300,
        config: { tension: 200, friction: 22 },
    });

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const value = e.target.elements.message.value.trim();
        if (!value) return;
        navigate('/chat', { state: { initialMessage: value } });
    };

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
            <Sidebar
                conversations={conversations}
                onNewChat={onNewChat}
                onSelectConversation={onSelectConversation}
            />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <Banner />

                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '14px 18px 0' }}>
                    <GithubAvatar onClick={() => setShowProfile(true)} />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', gap: 28, padding: '0 24px', paddingTop: '25vh', }}>
                    <animated.p style={{ ...greetingSpring, fontSize: 26, fontWeight: 600, textAlign: 'center', margin: '0 0 -8px', fontFamily: 'Poppins, sans-serif' }}>
                        {greeting}
                    </animated.p>
                    <animated.form
                        onSubmit={handleSubmit}
                        style={{
                            ...searchSpring,
                            width: '100%',
                            maxWidth: 480,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            background: 'color-mix(in srgb, var(--text) 6%, transparent)',
                            border: '0.5px solid color-mix(in srgb, var(--text) 20%, transparent)',
                            borderRadius: 24,
                            padding: '10px 16px',
                        }}
                    >
                        <input
                            name="message"
                            type="text"
                            placeholder="Ask DomSRT"
                            autoComplete="off"
                            style={{
                                flex: 1,
                                border: 'none',
                                outline: 'none',
                                background: 'transparent',
                                color: 'var(--text)',
                                fontSize: 14,
                                fontFamily: 'Poppins, sans-serif',
                            }}
                        />
                        <button
                            type="submit"
                            aria-label="Send"
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--text)',
                                display: 'flex',
                            }}
                        >
                            →
                        </button>
                    </animated.form>
                </div>

                {showProfile && <ProfileCard onClose={() => setShowProfile(false)} />}

                <div style={{ position: 'absolute', bottom: 16, right: 18 }}>
                    <ThemeToggle />
                </div>
            </div>
        </div >
    );
}