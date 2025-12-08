import React from 'react';
import { CactusLogo } from './CactusLogo';
import { ArrowRight } from 'lucide-react';

interface WelcomeProps {
    onLogin: () => void;
    onSignUp: () => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onLogin, onSignUp }) => {
    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col">
            {/* Background Gradients */}
            <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[100px] mix-blend-multiply opacity-70"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-orange-100/50 rounded-full blur-[100px] mix-blend-multiply opacity-70"></div>

            <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
                {/* 3D Hero Illustration Area */}
                <div className="relative mb-12">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-3xl rounded-full transform scale-150"></div>
                    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[40px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-white relative">
                        <CactusLogo size={100} />
                        
                        {/* Floating Elements */}
                        <div className="absolute -top-6 -right-6 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-3xl animate-bounce delay-700">
                            🎓
                        </div>
                        <div className="absolute -bottom-4 -left-6 w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center text-2xl animate-bounce delay-1000">
                            ✨
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <div className="text-center space-y-4 mb-12">
                    <h1 className="text-4xl font-bold text-slate-800 tracking-tight leading-tight">
                        Discover your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5D8BF4] to-[#0EA5E9]">Dream School</span>
                    </h1>
                    <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                        Manage your curriculum, track attendance, and learn with AI assistance. All in one place.
                    </p>
                </div>

                {/* Actions */}
                <div className="w-full space-y-4">
                    <button 
                        onClick={onLogin}
                        className="w-full bg-[#5D8BF4] hover:bg-[#4F46E5] text-white font-bold text-lg py-4 rounded-[24px] shadow-xl shadow-blue-200/50 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        Log In
                        <ArrowRight size={20} className="opacity-80" />
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
                <p className="text-[10px] text-slate-400 font-bold tracking-wide uppercase">
                    Trusted by 500+ Schools
                </p>
            </div>
        </div>
    );
};