import React, { useState, useRef, useEffect } from 'react';
import { IoChatbubblesOutline, IoSend, IoClose, IoLeafOutline, IoSparklesOutline } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import { sendChatMessage } from '../services/api';

const ChatAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am your EcoRoute Sustainability Assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setLoading(true);

        try {
            const response = await sendChatMessage(userMsg);
            const reply = response.data?.reply || response.reply;
            setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.error || "I'm sorry, I'm having trouble connecting right now. Please try again later.";
            setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
        } finally {
            setLoading(false);
        }
    };

    const suggestedPrompts = [
        "Explain my carbon footprint",
        "How can I reduce emissions?",
        "Which offset project should I choose?"
    ];

    const handlePromptClick = (prompt) => {
        setInput(prompt);
    };

    return (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 2000 }}>
            {/* Toggle Button */}
            {!isOpen && (
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(true)}
                    style={{
                        width: '64px', height: '64px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        border: 'none', color: 'white', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)',
                        position: 'relative'
                    }}
                >
                    <IoChatbubblesOutline size={32} />
                    <div style={{
                        position: 'absolute', top: '-5px', right: '-5px',
                        background: '#ef4444', height: '12px', width: '12px',
                        borderRadius: '50%', border: '2px solid white'
                    }}></div>
                </motion.button>
            )}

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 100 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 100 }}
                        style={{
                            width: '400px', height: '600px', background: 'white',
                            borderRadius: '24px', overflow: 'hidden',
                            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                            display: 'flex', flexDirection: 'column',
                            border: '1px solid #e2e8f0'
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            padding: '1.5rem', background: '#0f172a', color: 'white',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                    padding: '0.5rem', background: '#10b981', borderRadius: '10px',
                                    display: 'flex'
                                }}>
                                    <IoSparklesOutline size={20} />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: 'white' }}>EcoRoute AI</h3>
                                    <div style={{ fontSize: '0.75rem', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                        <div style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%' }}></div>
                                        Online Support
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}
                            >
                                <IoClose size={24} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#f8fafc' }}>
                            {messages.map((msg, i) => (
                                <div key={i} style={{
                                    maxWidth: '85%', padding: '0.75rem 1rem', borderRadius: '16px',
                                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                    background: msg.role === 'user' ? '#10b981' : 'white',
                                    color: msg.role === 'user' ? 'white' : '#1e293b',
                                    boxShadow: msg.role === 'user' ? '0 4px 10px rgba(16, 185, 129, 0.2)' : '0 2px 5px rgba(0,0,0,0.05)',
                                    fontSize: '0.95rem', lineHeight: '1.5',
                                    border: msg.role === 'user' ? 'none' : '1px solid #e2e8f0'
                                }}>
                                    {msg.content}
                                </div>
                            ))}
                            {loading && (
                                <div style={{
                                    alignSelf: 'flex-start', background: 'white', padding: '0.75rem 1rem',
                                    borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', gap: '4px'
                                }}>
                                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: '6px', height: '6px', background: '#94a3b8', borderRadius: '50%' }}></motion.div>
                                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} style={{ width: '6px', height: '6px', background: '#94a3b8', borderRadius: '50%' }}></motion.div>
                                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} style={{ width: '6px', height: '6px', background: '#94a3b8', borderRadius: '50%' }}></motion.div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Suggested Prompts */}
                        {messages.length === 1 && (
                            <div style={{ padding: '0.5rem 1.5rem', background: '#f8fafc', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {suggestedPrompts.map((p, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handlePromptClick(p)}
                                        style={{
                                            background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px',
                                            padding: '0.4rem 0.8rem', fontSize: '0.8rem', cursor: 'pointer',
                                            color: '#64748b', transition: 'all 0.2s'
                                        }}
                                        onMouseOver={(e) => e.target.style.borderColor = '#10b981'}
                                        onMouseOut={(e) => e.target.style.borderColor = '#e2e8f0'}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input Area */}
                        <form onSubmit={handleSend} style={{ padding: '1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '0.75rem' }}>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your sustainability question..."
                                style={{
                                    flex: 1, padding: '0.75rem 1.25rem', borderRadius: '12px',
                                    border: '1px solid #e2e8f0', outline: 'none', background: '#f8fafc',
                                    fontSize: '0.95rem'
                                }}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || loading}
                                style={{
                                    width: '46px', height: '46px', borderRadius: '12px',
                                    background: '#10b981', border: 'none', color: 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: (input.trim() && !loading) ? 'pointer' : 'not-allowed',
                                    opacity: (input.trim() && !loading) ? 1 : 0.6
                                }}
                            >
                                <IoSend size={20} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChatAssistant;
