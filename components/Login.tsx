import React, { useState, useEffect } from 'react';
import { CactusLogo } from './CactusLogo';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ChevronLeft, Backpack, Fingerprint, ScanFace } from 'lucide-react';

interface LoginProps {
    onSuccess: () => void;
    onStudentLogin?: () => void;
    onBack: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSuccess, onStudentLogin, onBack }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingType, setLoadingType] = useState<'generic' | 'student' | 'biometric' | null>(null);
    const [isBiometricSupported, setIsBiometricSupported] = useState(false);

    // Check for Biometric Support (WebAuthn)
    useEffect(() => {
        if (window.PublicKeyCredential) {
            // In a real app, you would also check specifically if a platform authenticator is available
            // PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().then(...)
            setIsBiometricSupported(true);
        }
    }, []);

    const authenticate = (callback: () => void, type: 'generic' | 'student' | 'biometric') => {
        setIsLoading(true);
        setLoadingType(type);
        // Simulate network/auth delay
        setTimeout(() => {
            setIsLoading(false);
            setLoadingType(null);
            callback();
        }, 1500);
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        authenticate(onSuccess, 'generic');
    };

    const handleBiometricLogin = () => {
        authenticate(onSuccess, 'biometric');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col relative">
            {/* Minimalist Header */}
            <div className="pt-12 px-6 pb-4 flex justify-between items-center z-10">
                <button 
                    onClick={onBack}
                    className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 shadow-sm active:scale-95 transition-all"
                >
                    <ChevronLeft size={22} />
                </button>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sign In</div>
                <div className="w-10" /> {/* Spacer */}
            </div>

            <div className="flex-1 px-8 flex flex-col overflow-y-auto no-scrollbar pb-8">
                <div className="mt-4 mb-10 text-center">
                    <div className="inline-flex justify-center mb-6 p-4 bg-white rounded-[28px] shadow-lg shadow-indigo-100">
                        <CactusLogo size={48} />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Welcome Back</h1>
                    <p className="text-slate-500 font-medium text-sm">Enter your credentials to access the portal.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-4">
                        <div className="group">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ml-1">Email</label>
                            <div className="relative">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                    <Mail size={20} />
                                </div>
                                <input 
                                    type="email" 
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@school.edu"
                                    className="w-full bg-white border border-slate-200 rounded-[24px] py-4 pl-14 pr-4 text-slate-800 font-semibold placeholder:text-slate-300 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="group">
                             <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ml-1">Password</label>
                            <div className="relative">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                    <Lock size={20} />
                                </div>
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white border border-slate-200 rounded-[24px] py-4 pl-14 pr-14 text-slate-800 font-semibold placeholder:text-slate-300 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all shadow-sm"
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button type="button" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
                            Forgot Password?
                        </button>
                    </div>

                    <div className="space-y-3 pt-2">
                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-slate-900 text-white font-bold text-lg py-4 rounded-[24px] shadow-lg shadow-slate-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                        >
                            {loadingType === 'generic' ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Sign In <ArrowRight size={20} className="text-slate-400 group-hover:text-white transition-colors" />
                                </>
                            )}
                        </button>

                        {onStudentLogin && (
                            <button 
                                type="button"
                                onClick={(e) => { e.preventDefault(); authenticate(onStudentLogin, 'student'); }}
                                disabled={isLoading}
                                className="w-full bg-orange-500 text-white font-bold text-lg py-4 rounded-[24px] shadow-lg shadow-orange-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                            >
                                {loadingType === 'student' ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Student Login <Backpack size={20} className="text-orange-200 group-hover:text-white transition-colors" />
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </form>

                <div className="mt-auto pt-8 flex items-center justify-center gap-4">
                    <button className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-500 hover:text-indigo-600 shadow-sm transition-colors">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12.0003 20.45C6.79029 20.45 2.55029 16.21 2.55029 11C2.55029 5.79 6.79029 1.55 12.0003 1.55C17.2103 1.55 21.4503 5.79 21.4503 11C21.4503 16.21 17.2103 20.45 12.0003 20.45ZM12.0003 3.55C7.89029 3.55 4.55029 6.89 4.55029 11C4.55029 15.11 7.89029 18.45 12.0003 18.45C16.1103 18.45 19.4503 15.11 19.4503 11C19.4503 6.89 16.1103 3.55 12.0003 3.55ZM10.5503 14.75L15.2503 10.05C15.6403 9.66 15.6403 9.03 15.2503 8.64C14.8603 8.25 14.2303 8.25 13.8403 8.64L9.84029 12.64L8.43029 11.23C8.04029 10.84 7.41029 10.84 7.02029 11.23C6.63029 11.62 6.63029 12.25 7.02029 12.64L9.14029 14.76C9.53029 15.15 10.1603 15.15 10.5503 14.75Z" /></svg>
                    </button>
                    
                    {isBiometricSupported && (
                        <button 
                            onClick={handleBiometricLogin}
                            disabled={isLoading}
                            className={`w-12 h-12 bg-white border rounded-2xl flex items-center justify-center shadow-sm transition-all ${
                                loadingType === 'biometric' 
                                ? 'border-indigo-500 text-indigo-600 ring-2 ring-indigo-100' 
                                : 'border-slate-100 text-slate-500 hover:text-indigo-600'
                            }`}
                            aria-label="Login with Biometrics"
                        >
                            {loadingType === 'biometric' ? (
                                <div className="w-5 h-5 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                            ) : (
                                <Fingerprint size={24} />
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};