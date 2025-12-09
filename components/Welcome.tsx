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
        description: "Your entire school life, organized in your pocket.",
        icon: <Backpack size={28} className="text-white" />,
        bgGradient: "bg-gradient-to-br from-indigo-500 to-indigo-600",
        shadow: "shadow-indigo-500/30",
        accent: "bg-white/20"
    },
    {
        id: 2,
        title: "Master Logic",
        description: "Solve complex problems with AI assistance.",
        icon: <Calculator size={28} className="text-white" />,
        bgGradient: "bg-gradient-to-br from-slate-700 to-slate-800",
        shadow: "shadow-slate-500/30",
        accent: "bg-white/10"
    },
    {
        id: 3,
        title: "Creative Arts",
        description: "Express yourself with new interactive modules.",
        icon: <Palette size={28} className="text-white" />,
        bgGradient: "bg-gradient-to-br from-orange-400 to-red-500",
        shadow: "shadow-orange-500/30",
        accent: "bg-white/20"
    },
    {
        id: 4,
        title: "New Session",
        description: "Start the academic year with confidence.",
        icon: <BookOpen size={28} className="text-white" />,
        bgGradient: "bg-gradient-to-br from-emerald-500 to-teal-600",
        shadow: "shadow-emerald-500/30",
        accent: "bg-white/20"
    }
];

export const Welcome: React.FC<WelcomeProps> = ({ onLogin, onSignUp }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col font-sans">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-indigo-50/50 to-transparent pointer-events-none" />
            
            {/* Header Brand */}
            <div className="pt-14 pb-8 flex justify-center z-10">
                <div className="flex flex-col items-center gap-2">
                    <CactusLogo size={48} />
                </div>
            </div>

            <div className="flex-1 flex flex-col px-6 relative z-10">
                
                {/* Modern Banner Carousel */}
                <div className="relative w-full aspect-[16/10] mb-8">
                    {BANNERS.map((banner, index) => (
                        <div 
                            key={banner.id}
                            className={`absolute inset-0 transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) transform ${
                                index === currentIndex 
                                ? 'opacity-100 translate-x-0 scale-100 z-10' 
                                : 'opacity-0 scale-95 z-0'
                            }`}
                        >
                            <div className={`w-full h-full rounded-[32px] ${banner.bgGradient} p-8 flex flex-col justify-between shadow-2xl ${banner.shadow} relative overflow-hidden`}>
                                {/* Abstract Shapes */}
                                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl transform translate-x-10 -translate-y-10"></div>
                                
                                <div className="flex justify-between items-start">
                                    <div className={`w-14 h-14 rounded-2xl ${banner.accent} backdrop-blur-md flex items-center justify-center border border-white/10`}>
                                        {banner.icon}
                                    </div>
                                    <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/10">
                                        <p className="text-[10px] font-bold text-white uppercase tracking-wider">Featured</p>
                                    </div>
                                </div>

                                <div className="relative z-10">
                                    <h2 className="text-2xl font-bold text-white mb-2 leading-tight">{banner.title}</h2>
                                    <p className="text-white/90 text-sm font-medium leading-relaxed opacity-90">{banner.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Indicators */}
                <div className="flex justify-center gap-2 mb-auto">
                    {BANNERS.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-1.5 rounded-full transition-all duration-500 ${
                                idx === currentIndex ? 'w-6 bg-slate-800' : 'w-1.5 bg-slate-300'
                            }`}
                        />
                    ))}
                </div>

                {/* Main Text */}
                <div className="text-center space-y-3 mb-12">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                        Learn smarter,<br/>not harder.
                    </h1>
                    <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed font-medium">
                        The all-in-one platform for students and teachers to connect, learn, and grow.
                    </p>
                </div>

                {/* Actions */}
                <div className="space-y-3 w-full mb-8">
                    <button 
                        onClick={onLogin}
                        className="w-full bg-slate-900 hover:bg-black text-white font-bold text-lg py-4 rounded-[24px] shadow-xl shadow-slate-200 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        Get Started
                        <ArrowRight size={20} className="text-slate-400" />
                    </button>
                    
                    <button 
                        onClick={onSignUp}
                        className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold text-lg py-4 rounded-[24px] border border-slate-200 transition-all transform active:scale-[0.98]"
                    >
                        Create Account
                    </button>
                </div>
            </div>
        </div>
    );
};