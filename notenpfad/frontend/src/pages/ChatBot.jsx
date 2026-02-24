import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { API_BASE_URL as API_URL } from '../config';

const ChatBot = ({ studentId, userRole }) => {
    const isParent = userRole === 'parent';
    const initMsg = isParent
        ? 'Willkommen! Ich helfe Ihnen, die schulische Entwicklung Ihres Kindes zu verstehen. 🤝'
        : 'Hallo! Ich bin dein Lern-Coach. Wie kann ich dir heute helfen? 🤖';

    const [messages, setMessages] = useState([
        { sender: 'bot', text: initMsg }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [emotionMode, setEmotionMode] = useState('balanced');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    // Reset chat when switching context (student or role)
    useEffect(() => {
        const newInitMsg = userRole === 'parent'
            ? 'Willkommen! Ich helfe Ihnen, die schulische Entwicklung Ihres Kindes zu verstehen. 🤝'
            : 'Hallo! Ich bin dein Lern-Coach. Wie kann ich dir heute helfen? 🤖';

        setMessages([{ sender: 'bot', text: newInitMsg }]);
        setInput('');
    }, [studentId, userRole]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const token = localStorage.getItem('access_token');
            const history = messages
                .filter(msg => msg.text !== initMsg)
                .map(msg => ({
                    role: msg.sender === 'user' ? 'user' : 'assistant',
                    content: msg.text
                }));

            const res = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    message: input,
                    student_id: studentId,
                    emotion_mode: emotionMode,
                    history: history
                })
            });
            const data = await res.json();

            const botMsg = { sender: 'bot', text: data.response };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            setMessages(prev => [...prev, { sender: 'bot', text: "Entschuldigung, ich habe Verbindungsprobleme. 🔌" }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div className="container animate-fade-in" style={{ paddingBottom: '90px', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div className="card" style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <h2 style={{ margin: 0 }}>{isParent ? 'Lern-Begleiter für Eltern 🤝' : 'Lern-Coach AI 🧠'}</h2>
                    <select
                        value={emotionMode}
                        onChange={(e) => setEmotionMode(e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: '12px', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-bg)', color: 'var(--color-text)', cursor: 'pointer', fontWeight: 500 }}
                    >
                        <option value="motivating">✨ Sehr Motivierend</option>
                        <option value="mildly_motivating">🌟 Motivierend</option>
                        <option value="balanced">⚖️ Ausgewogen</option>
                        <option value="mildly_strict">📚 Streng</option>
                        <option value="strict">📏 Sehr Streng</option>
                    </select>
                </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1rem', paddingRight: '5px' }}>
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={msg.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}
                        style={{
                            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                            background: msg.sender === 'user' ? 'var(--color-primary)' : 'white',
                            color: msg.sender === 'user' ? 'white' : 'var(--color-text)',
                            padding: '10px 15px',
                            borderRadius: '15px',
                            borderBottomRightRadius: msg.sender === 'user' ? '2px' : '15px',
                            borderTopLeftRadius: msg.sender === 'bot' ? '2px' : '15px',
                            maxWidth: '80%',
                            boxShadow: 'var(--shadow-sm)'
                        }}
                    >
                        <ReactMarkdown>
                            {msg.text}
                        </ReactMarkdown>
                    </div>
                ))}
                {isLoading && <div style={{ alignSelf: 'flex-start', color: '#888', fontStyle: 'italic' }}>Schreibt...</div>}
                <div ref={messagesEndRef} />
            </div>

            <div style={{ display: 'flex', gap: '10px', background: 'white', padding: '10px', borderRadius: '15px', boxShadow: 'var(--shadow-md)' }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Frag mich etwas..."
                    style={{ flex: 1, border: 'none', outline: 'none', fontSize: '1rem' }}
                />
                <button
                    onClick={handleSend}
                    style={{
                        background: 'var(--color-primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    ➤
                </button>
            </div>
        </div>
    );
};

export default ChatBot;
