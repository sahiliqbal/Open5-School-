import React, { useState, useEffect } from 'react';
import { CactusLogo } from './CactusLogo';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ChevronLeft, Backpack, Fingerprint, ScanFace, ShieldCheck, AlertCircle } from 'lucide-react';

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
    const [error, setError] = useState<string | null>(null);
    const [isBiometricSupported, setIsBiometricSupported] = useState(false);
    const [biometricType, setBiometricType] = useState<'face' | 'touch'>('touch');

    // Check for Biometric Support (WebAuthn)
    useEffect(() => {
        if (typeof window !== 'undefined' && (window as any).PublicKeyCredential) {
            setIsBiometricSupported(true);
            setBiometricType(Math.random() > 0.5 ? 'face' : 'touch');
        }
    }, []);

    // Clear error when user starts typing
    useEffect(() => {
        if (error) setError(null);
    }, [email, password]);

    const authenticate = (callback: () => void, type: 'generic' | 'student' | 'biometric') => {
        setIsLoading(true);
        setLoadingType(type);
        setError(null);

        // Simulate network/auth delay
        setTimeout(() => {
            setIsLoading(false);
            setLoadingType(null);

            // Mock Logic for Error Simulation
            if (type === 'generic') {
                if (email === 'suspended@school.edu') {
                    setError('This account has been suspended by the administrator.');
                    return;
                }
                if (email === 'error@school.edu' || password !== 'admin123' && email !== '') {
                    setError('Invalid credentials. Please check your email and password.');
                    return;
                }
            }

            callback();
        }, 1500);
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }
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
                <div className="mt-4 mb-8 text-center">
                    <div className="inline-flex justify-center mb-6 p-4 bg-white rounded-[28px] shadow-lg shadow-indigo-100">
                        <CactusLogo size={48} />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Welcome Back</h1>
                    <p className="text-slate-500 font-medium text-sm">Enter your credentials to access the portal.</p>
                </div>

                {/* Dynamic Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="mt-0.5 text-red-500">
                            <AlertCircle size={18} />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-red-800 leading-tight">Authentication Failed</p>
                            <p className="text-xs font-medium text-red-600/80 mt-1 leading-relaxed">{error}</p>
                        </div>
                    </div>
                )}

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
                                    className={`w-full bg-white border rounded-[24px] py-4 pl-14 pr-4 text-slate-800 font-semibold placeholder:text-slate-300 focus:outline-none focus:ring-4 transition-all shadow-sm ${
                                        error ? 'border-red-200 focus:border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-600 focus:ring-indigo-100'
                                    }`}
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
                                    className={`w-full bg-white border rounded-[24px] py-4 pl-14 pr-14 text-slate-800 font-semibold placeholder:text-slate-300 focus:outline-none focus:ring-4 transition-all shadow-sm ${
                                        error ? 'border-red-200 focus:border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-600 focus:ring-indigo-100'
                                    }`}
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

                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                            <label htmlFor="remember" className="text-xs font-bold text-slate-400">Remember me</label>
                        </div>
                        <button type="button" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
                            Forgot Password?
                        </button>
                    </div>

                    <div className="space-y-3 pt-2">
                        <button 
                            type="submit"
                            disabled={isLoading}
                            className={`w-full text-white font-bold text-lg py-4 rounded-[24px] shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 group ${
                                error ? 'bg-red-500 shadow-red-100 hover:bg-red-600' : 'bg-slate-900 shadow-slate-200 hover:bg-black'
                            }`}
                        >
                            {loadingType === 'generic' ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {error ? 'Try Again' : 'Sign In'} 
                                    <ArrowRight size={20} className="text-slate-400 group-hover:text-white transition-colors" />
                                </>
                            )}
                        </button>

                        {isBiometricSupported && (
                            <button 
                                type="button"
                                onClick={handleBiometricLogin}
                                disabled={isLoading}
                                className="w-full bg-indigo-50 text-indigo-700 font-bold text-lg py-4 rounded-[24px] border border-indigo-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group hover:bg-indigo-100"
                            >
                                {loadingType === 'biometric' ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-indigo-300 border-t-indigo-700 rounded-full animate-spin" />
                                        <span className="text-sm">Verifying {biometricType === 'face' ? 'Face ID' : 'Biometrics'}...</span>
                                    </>
                                ) : (
                                    <>
                                        Login with {biometricType === 'face' ? 'Face ID' : 'Touch ID'} 
                                        {biometricType === 'face' ? (
                                            <ScanFace size={20} className="text-indigo-400 group-hover:text-indigo-600 transition-colors" />
                                        ) : (
                                            <Fingerprint size={20} className="text-indigo-400 group-hover:text-indigo-600 transition-colors" />
                                        )}
                                    </>
                                )}
                            </button>
                        )}

                        {onStudentLogin && (
                            <button 
                                type="button"
                                onClick={(e) => { 
                                    e.preventDefault(); 
                                    if (onStudentLogin) authenticate(onStudentLogin, 'student'); 
                                }}
                                disabled={isLoading}
                                className="w-full bg-white text-slate-700 font-bold text-lg py-4 rounded-[24px] shadow-sm border border-slate-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group hover:bg-slate-50"
                            >
                                {loadingType === 'student' ? (
                                    <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Student Portal Demo <Backpack size={20} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </form>

                <div className="mt-auto pt-8 flex items-center justify-center gap-2 text-xs font-medium text-slate-400">
                    <ShieldCheck size={14} />
                    <span>Secure Enrollment System • Open5 v3.1</span>
                </div>
            </div>
        </div>
    );
};