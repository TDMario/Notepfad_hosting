import React, { useState, useEffect, useRef } from 'react';

import { API_BASE_URL as API_URL } from '../config';

const ChatBot = () => {
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hallo! Ich bin dein Lern-Coach. Wie kann ich dir heute helfen? 🤖' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }, // Unprotected endpoint as per analysis, but let's check. 
                // Wait, chat endpoint in main.py is NOT protected.
                // @app.post("/chat") ...
                // So I don't need to add header here if I didn't protect it.
                // But good practice to verify.
                // The task list said "Protect /grades/, /subjects/, /users/".
                // I didn't explicitly check /chat in the plan, but I should probably leave it open or protect it.
                // Let's check main.py again.
                // In main.py: @app.post("/chat") def chat_bot ... no dependency.
                // So no change needed for ChatBot.jsx unless I want to protect it.
                // I'll skip ChatBot.jsx for now or protect it in main.py if I want consistency.
                // Given the plan defined specific endpoints, I'll stick to the plan.
                body: JSON.stringify({ message: input })
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
                <h2>Lern-Coach AI 🧠</h2>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1rem', paddingRight: '5px' }}>
                {messages.map((msg, index) => (
                    <div
                        key={index}
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
                        {msg.text}
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
