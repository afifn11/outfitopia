import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import { X, Send, Sparkles, Minimize2 } from 'lucide-react';

const SUGGESTIONS = [
    'Rekomendasi outfit casual untuk weekend',
    'Cara mix & match warna netral',
    'Produk apa yang cocok untuk kerja?',
];

const Message = ({ msg }) => (
    <div className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
        {msg.role === 'ai' && (
            <div className="w-7 h-7 bg-[#0a0a0a] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles size={12} className="text-white" />
            </div>
        )}
        <div className={`max-w-[80%] px-4 py-3 text-[13px] leading-relaxed ${
            msg.role === 'user'
                ? 'bg-[#0a0a0a] text-white'
                : 'bg-[#f4f4f4] text-[#0a0a0a]'
        }`}>
            {msg.content}
        </div>
    </div>
);

const AIChatWidget = () => {
    const [open, setOpen]         = useState(false);
    const [input, setInput]       = useState('');
    const [messages, setMessages] = useState([
        { role: 'ai', content: 'Halo! Saya asisten fashion Outfitopia. Ada yang bisa saya bantu?' }
    ]);
    const [loading, setLoading]   = useState(false);
    const bottomRef = useRef(null);
    const inputRef  = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 100);
    }, [open]);

    const sendMessage = async (text) => {
        const userMsg = text || input.trim();
        if (!userMsg || loading) return;

        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setLoading(true);

        try {
            const history = messages.map(m => ({ role: m.role === 'user' ? 'user' : 'model', content: m.content }));
            const res = await api.post('/ai/chat', { message: userMsg, history });
            setMessages(prev => [...prev, { role: 'ai', content: res.data.reply }]);
        } catch {
            setMessages(prev => [...prev, { role: 'ai', content: 'Maaf, saya sedang tidak tersedia. Coba lagi nanti.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Chat window */}
            {open && (
                <div className="fixed bottom-20 right-5 w-[340px] bg-white border border-[#e8e8e8] z-50 flex flex-col"
                    style={{ height: '480px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>

                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8e8e8] bg-[#0a0a0a]">
                        <div className="flex items-center gap-2">
                            <Sparkles size={14} className="text-white" />
                            <span className="text-[12px] font-medium tracking-wide uppercase text-white">Fashion AI</span>
                        </div>
                        <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white transition-colors">
                            <X size={16} strokeWidth={1.5} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, i) => <Message key={i} msg={msg} />)}
                        {loading && (
                            <div className="flex gap-3">
                                <div className="w-7 h-7 bg-[#0a0a0a] rounded-full flex items-center justify-center flex-shrink-0">
                                    <Sparkles size={12} className="text-white" />
                                </div>
                                <div className="bg-[#f4f4f4] px-4 py-3 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-[#a0a0a0] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-1.5 h-1.5 bg-[#a0a0a0] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-1.5 h-1.5 bg-[#a0a0a0] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Suggestions — show only at start */}
                    {messages.length <= 1 && (
                        <div className="px-4 pb-3 flex flex-col gap-1.5">
                            {SUGGESTIONS.map((s, i) => (
                                <button key={i} onClick={() => sendMessage(s)}
                                    className="text-left text-[11px] text-[#6b6b6b] border border-[#e8e8e8] px-3 py-2 hover:border-[#0a0a0a] hover:text-[#0a0a0a] transition-all">
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <div className="border-t border-[#e8e8e8] px-4 py-3 flex items-center gap-3">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                            placeholder="Tanya tentang fashion..."
                            className="flex-1 text-[13px] outline-none placeholder:text-[#a0a0a0] bg-transparent"
                        />
                        <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
                            className="w-8 h-8 bg-[#0a0a0a] flex items-center justify-center disabled:opacity-30 hover:opacity-80 transition-opacity flex-shrink-0">
                            <Send size={13} className="text-white" />
                        </button>
                    </div>
                </div>
            )}

            {/* Toggle button */}
            <button onClick={() => setOpen(!open)}
                className="fixed bottom-5 right-5 w-12 h-12 bg-[#0a0a0a] text-white flex items-center justify-center z-50 hover:opacity-90 transition-opacity"
                style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
                {open
                    ? <Minimize2 size={18} strokeWidth={1.5} />
                    : <Sparkles size={18} strokeWidth={1.5} />
                }
            </button>
        </>
    );
};

export default AIChatWidget;
