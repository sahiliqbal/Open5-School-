import React, { useState, useEffect } from 'react';
import { CactusLogo } from './CactusLogo';
import { ArrowRight, Sparkles, Backpack, Calculator, Palette, BookOpen } from 'lucide-react';

interface WelcomeProps {
    onLogin: () => void;
    onSignUp: () => void;
}

const BANNERS = [
    {
        id: 1,
        title: "Digital Backpack",
        description: "Keep your notes, syllabus, and lessons organized in one place.",
        icon: <Backpack size={32} className="text-white" />,
        bgGradient: "bg-gradient-to-br from-indigo-500 to-blue-500",
        shadow: "shadow-indigo-200",
        accent: "bg-white/20"
    },
    {
        id: 2,
        title: "Math & Logic",
        description: "Master complex equations with smart AI-powered tools.",
        icon: <Calculator size={32} className="text-white" />,
        bgGradient: "bg-gradient-to-br from-slate-700 to-slate-900",
        shadow: "shadow-slate-200",
        accent: "bg-yellow-400/20"
    },
    {
        id: 3,
        title: "Art & Design",
        description: "Unleash your creativity with interactive art modules.",
        icon: <Palette size={32} className="text-white" />,
        bgGradient: "bg-gradient-to-br from-orange-400 to-red-500",
        shadow: "shadow-orange-200",
        accent: "bg-white/20"
    },
    {
        id: 4,
        title: "Start Learning",
        description: "Welcome to the new academic session. Let's achieve more!",
        icon: <BookOpen size={32} className="text-white" />,
        bgGradient: "bg-gradient-to-br from-fuchsia-500 to-purple-600",
        shadow: "shadow-fuchsia-200",
        accent: "bg-white/20"
    }
];

export const Welcome: React.FC<WelcomeProps> = ({ onLogin, onSignUp }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col font-sans">
            {/* Background Atmosphere */}
            <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-[100px] mix-blend-multiply pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-orange-100/40 rounded-full blur-[100px] mix-blend-multiply pointer-events-none"></div>

            {/* Header Brand */}
            <div className="pt-12 pb-6 flex justify-center z-10">
                <div className="flex items-center gap-2.5">
                    <CactusLogo size={40} />
                    <span className="text-2xl font-bold text-slate-800 tracking-tight">Open<span className="text-[#0EA5E9]">5</span></span>
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center px-6 relative z-10">
                
                {/* Banner Carousel */}
                <div className="relative w-full aspect-[4/3] mb-10">
                    {BANNERS.map((banner, index) => (
                        <div 
                            key={banner.id}
                            className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
                                index === currentIndex 
                                ? 'opacity-100 translate-x-0 scale-100' 
                                : index < currentIndex 
                                    ? 'opacity-0 -translate-x-10 scale-95' 
                                    : 'opacity-0 translate-x-10 scale-95'
                            }`}
                        >
                            <div className={`w-full h-full rounded-[40px] ${banner.bgGradient} p-8 flex flex-col justify-between shadow-2xl ${banner.shadow} relative overflow-hidden`}>
                                {/* Decor */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-10 -translate-y-10"></div>
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl transform -translate-x-5 translate-y-5"></div>

                                <div className={`w-16 h-16 rounded-2xl ${banner.accent} backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg`}>
                                    {banner.icon}
                                </div>

                                <div className="relative z-10">
                                    <h2 className="text-3xl font-bold text-white mb-2 leading-tight">{banner.title}</h2>
                                    <p className="text-white/80 text-sm font-medium leading-relaxed">{banner.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Indicators */}
                <div className="flex justify-center gap-2 mb-12">
                    {BANNERS.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                idx === currentIndex ? 'w-8 bg-slate-800' : 'w-2 bg-slate-300'
                            }`}
                        />
                    ))}
                </div>

                {/* Main Text */}
                <div className="text-center space-y-3 mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                        School in your pocket
                    </h1>
                    <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
                        Manage your curriculum, track attendance, and learn with AI assistance.
                    </p>
                </div>

                {/* Actions */}
                <div className="space-y-4 w-full max-w-sm mx-auto">
                    <button 
                        onClick={onLogin}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg py-4 rounded-[24px] shadow-xl shadow-slate-200 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 group"
                    >
                        Log In
                        <ArrowRight size={20} className="text-slate-400 group-hover:text-white transition-colors" />
                    </button>
                    
                    <button 
                        onClick={onSignUp}
                        className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold text-lg py-4 rounded-[24px] border border-slate-200 shadow-sm transition-all transform active:scale-[0.98]"
                    >
                        Create Account
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="p-6 text-center">
                <p className="text-[10px] text-slate-400 font-bold tracking-wide uppercase flex items-center justify-center gap-2">
                    <Sparkles size={12} className="text-[#0EA5E9]" />
                    Powered by Gemini AI
                </p>
            </div>
        </div>
    );
};