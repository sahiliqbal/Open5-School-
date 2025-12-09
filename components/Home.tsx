import React, { useState } from 'react';
import { Course } from '../types';
import { 
    LogOut, Receipt, MapPin, Mail, Phone, 
    CheckSquare, Bus, ClipboardList, CalendarDays, 
    Star, ArrowRight, Bell
} from 'lucide-react';
import { BusTracker } from './BusTracker';
import { FeePayment } from './FeePayment';

interface HomeProps {
    courses: Course[];
    onSelectCourse: (course: Course) => void;
    onLogout: () => void;
}

export const Home: React.FC<HomeProps> = ({ courses, onSelectCourse, onLogout }) => {
    const [isBusTrackerOpen, setIsBusTrackerOpen] = useState(false);
    const [isFeePaymentOpen, setIsFeePaymentOpen] = useState(false);

    const QuickAction = ({ icon: Icon, label, color, onClick, badge }: any) => (
        <button 
            onClick={onClick}
            className="flex flex-col items-center gap-2 group min-w-[72px]"
        >
            <div className={`w-16 h-16 rounded-[24px] ${color} flex items-center justify-center text-white shadow-lg shadow-slate-200 active:scale-90 transition-transform relative border-2 border-white`}>
                <Icon size={24} strokeWidth={2.5} />
                {badge && (
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                        {badge}
                    </span>
                )}
            </div>
            <span className="text-[11px] font-bold text-slate-600 tracking-wide">{label}</span>
        </button>
    );

    return (
        <div className="h-full flex flex-col bg-slate-50 relative animate-in fade-in duration-500">
            {/* Glass Header */}
            <div className="bg-white/80 backdrop-blur-xl px-6 py-4 flex justify-between items-center sticky top-0 z-30 border-b border-slate-100/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-md">
                        <img 
                            src="https://api.dicebear.com/7.x/notionists/svg?seed=Alex" 
                            alt="Profile" 
                            className="w-full h-full rounded-full"
                        />
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Good Morning</p>
                        <h1 className="text-sm font-bold text-slate-900">Alex Johnson</h1>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-indigo-600 shadow-sm border border-slate-100 transition-colors">
                        <Bell size={18} />
                    </button>
                    <button onClick={onLogout} className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                        <LogOut size={18} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 pb-32 no-scrollbar space-y-8">
                
                {/* ID Card Widget */}
                <div className="w-full bg-slate-900 rounded-[32px] p-6 text-white shadow-2xl shadow-slate-300/50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500 rounded-full blur-[60px] opacity-30"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-sky-400 rounded-full blur-[50px] opacity-20"></div>

                    <div className="relative z-10 flex flex-col h-full justify-between min-h-[140px]">
                        <div className="flex justify-between items-start">
                             <div>
                                <h2 className="text-xl font-bold">Fulkuri Academy</h2>
                                <div className="flex items-center gap-1 text-slate-400 text-xs mt-1">
                                    <MapPin size={12} />
                                    <span>Campus ID: 884-XJ</span>
                                </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                <span className="text-[10px] font-bold tracking-wide text-indigo-200">STD-XII</span>
                            </div>
                        </div>

                        <div className="flex items-end justify-between mt-4">
                            <div className="flex gap-4">
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-wide">Roll No</p>
                                    <p className="font-mono text-lg font-bold">2451</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-wide">Section</p>
                                    <p className="font-mono text-lg font-bold">A+</p>
                                </div>
                            </div>
                            <div className="w-12 h-12 bg-white rounded-xl p-1">
                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=AlexJohnson2451`} alt="QR" className="w-full h-full mix-blend-multiply" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions Scroll */}
                <div className="-mx-6 px-6 overflow-x-auto no-scrollbar py-2">
                    <div className="flex gap-4 w-max">
                        <QuickAction 
                            label="Attendance" 
                            icon={CheckSquare} 
                            color="bg-emerald-500" 
                            onClick={() => {}} 
                        />
                         <QuickAction 
                            label="Fees" 
                            icon={Receipt} 
                            color="bg-indigo-500" 
                            onClick={() => setIsFeePaymentOpen(true)}
                            badge={1}
                        />
                         <QuickAction 
                            label="Bus" 
                            icon={Bus} 
                            color="bg-orange-500" 
                            onClick={() => setIsBusTrackerOpen(true)}
                        />
                         <QuickAction 
                            label="Results" 
                            icon={ClipboardList} 
                            color="bg-pink-500" 
                            onClick={() => {}} 
                        />
                        <QuickAction 
                            label="Schedule" 
                            icon={CalendarDays} 
                            color="bg-sky-500" 
                            onClick={() => {}} 
                        />
                    </div>
                </div>

                {/* Courses Section */}
                <div>
                    <div className="flex justify-between items-center mb-5">
                        <h3 className="text-lg font-bold text-slate-900">My Courses</h3>
                        <button className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-full transition-colors">See All</button>
                    </div>

                    <div className="space-y-4">
                        {courses.map((course, idx) => (
                            <button
                                key={course.id}
                                onClick={() => onSelectCourse(course)}
                                className="w-full bg-white p-2 rounded-[28px] shadow-sm border border-slate-100 hover:shadow-md transition-all active:scale-[0.99] flex items-center gap-4 group text-left"
                            >
                                <div className={`w-24 h-24 rounded-[22px] bg-gradient-to-br ${course.colorFrom} ${course.colorTo} flex flex-col items-center justify-center text-white shadow-md relative overflow-hidden shrink-0`}>
                                     {/* Background Pattern */}
                                     <div className="absolute inset-0 opacity-20 flex items-center justify-center text-6xl rotate-12">{course.icon}</div>
                                     <span className="relative z-10 text-3xl">{course.icon}</span>
                                </div>
                                
                                <div className="flex-1 py-1 pr-4">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="text-base font-bold text-slate-900">{course.title}</h4>
                                        <div className="flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-100">
                                            <Star size={10} className="fill-amber-400 text-amber-400" />
                                            <span className="text-[10px] font-bold text-amber-700">{course.rating}</span>
                                        </div>
                                    </div>
                                    
                                    <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed font-medium">
                                        {course.description}
                                    </p>

                                    {/* Mock Progress */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full bg-gradient-to-r ${course.colorFrom} ${course.colorTo} rounded-full`} 
                                                style={{ width: `${Math.random() * 40 + 20}%` }}
                                            ></div>
                                        </div>
                                        <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                            <ArrowRight size={12} />
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modals with specific Z-index to overlay nicely */}
            {isBusTrackerOpen && (
                 <div className="absolute inset-0 z-50 rounded-[40px] overflow-hidden">
                    <BusTracker isOpen={isBusTrackerOpen} onClose={() => setIsBusTrackerOpen(false)} />
                 </div>
            )}
            {isFeePaymentOpen && (
                <div className="absolute inset-0 z-50 rounded-[40px] overflow-hidden">
                     <FeePayment isOpen={isFeePaymentOpen} onClose={() => setIsFeePaymentOpen(false)} />
                </div>
            )}
        </div>
    );
};