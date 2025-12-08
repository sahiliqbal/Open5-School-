import React, { useState, useRef, useEffect } from 'react';
import { getTutorResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, X, Bot, User, Loader2 } from 'lucide-react';

interface GeminiTutorProps {
    courseTitle: string;
    isOpen: boolean;
    onClose: () => void;
    systemInstruction?: string;
}

export const GeminiTutor: React.FC<GeminiTutorProps> = ({ courseTitle, isOpen, onClose, systemInstruction }) => {
    
    const getDynamicGreeting = (title: string) => {
        const t = title.toLowerCase();
        if (t.includes('math')) return `Let's crunch some numbers! I'm your ${title} AI Tutor. Ask me about algebra, calculus, or geometry.`;
        if (t.includes('physic')) return `Ready to explore the universe? I'm your ${title} AI Tutor. Ask me about motion, forces, or energy.`;
        if (t.includes('chem')) return `Welcome to the lab! I'm your ${title} AI Tutor. Ask me about elements, reactions, or bonding.`;
        if (t.includes('bio')) return `Let's study life! I'm your ${title} AI Tutor. Ask me about cells, genetics, or ecosystems.`;
        if (t.includes('history')) return `Let's travel back in time! I'm your ${title} AI Tutor. Ask me about events, figures, or eras.`;
        if (t.includes('english') || t.includes('language')) return `Words have power! I'm your ${title} AI Tutor. Ask me about grammar, literature, or writing.`;
        return `Hi! I'm your AI tutor for ${title}. Ask me anything about this subject!`;
    };

    const [initialGreeting, setInitialGreeting] = useState(getDynamicGreeting(courseTitle));

    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 'welcome',
            role: 'model',
            text: initialGreeting,
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Update greeting if courseTitle changes
    useEffect(() => {
        const newGreeting = getDynamicGreeting(courseTitle);
        setInitialGreeting(newGreeting);
        // Reset messages if the component is being reused for a different course (though usually unmounted)
        setMessages(prev => {
            if (prev.length === 1 && prev[0].id === 'welcome') {
                return [{
                    id: 'welcome',
                    role: 'model',
                    text: newGreeting,
                    timestamp: new Date()
                }];
            }
            return prev;
        });
    }, [courseTitle]);

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            text: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        // Prepare history for API
        const history = messages.map(m => ({
            role: m.role,
            text: m.text
        }));

        try {
            const responseText = await getTutorResponse(courseTitle, userMsg.text, history, systemInstruction);
            
            const botMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: responseText,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full sm:max-w-md h-[85vh] sm:h-[600px] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300">
                
                {/* Header */}
                <div className={`p-4 bg-gradient-to-r from-indigo-500 to-purple-600 flex justify-between items-center text-white`}>
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-white/20 rounded-full">
                            <Bot size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">{courseTitle} Tutor</h3>
                            <p className="text-xs text-indigo-100">Powered by Gemini AI</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex max-w-[80%] gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                                </div>
                                <div
                                    className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                        msg.role === 'user'
                                            ? 'bg-indigo-600 text-white rounded-tr-none'
                                            : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start w-full">
                            <div className="flex max-w-[80%] gap-2">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                                    <Bot size={16} />
                                </div>
                                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                                    <Loader2 className="animate-spin text-indigo-500" size={16} />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-100">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask a question..."
                            className="flex-1 bg-slate-100 border-none rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-full shadow-lg transition-transform active:scale-95"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};