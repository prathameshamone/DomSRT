import { useCallback, useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ChatPage from './pages/ChatPage';
import { fetchConversations } from './lib/api';

function App() {
  const [conversations, setConversations] = useState([]);

  const refreshConversations = useCallback(() => {
    fetchConversations().then(setConversations).catch(() => {});
  }, []);

  useEffect(() => {
    refreshConversations();
  }, [refreshConversations]);

  return (
    <Routes>
      <Route path="/" element={<HomePage userName="Prathamesh" conversations={conversations} />} />
      <Route path="/chat/:conversationId?" element={<ChatPage conversations={conversations} refreshConversations={refreshConversations} />} />
      <Route path="/about" element={<AboutPage />} />
    </Routes>
  );
}

export default App;