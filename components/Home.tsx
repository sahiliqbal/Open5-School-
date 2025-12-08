import React, { useState } from 'react';
import { Course } from '../types';
import { 
    LogOut, Bell, Calendar, MapPin, Mail, Phone, 
    CheckSquare, Receipt, ClipboardList, CalendarDays, 
    Cake, Bus, ChevronRight, UserCheck 
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

    const MenuItem = ({ 
        icon: Icon, 
        label, 
        colorClass, 
        iconColorClass,
        onClick,
        badge 
    }: { 
        icon: any, 
        label: string, 
        colorClass: string, 
        iconColorClass: string, 
        onClick: () => void, 
        badge?: number 
    }) => (
        <button 
            onClick={onClick}
            className={`aspect-square rounded-[24px] p-4 flex flex-col justify-between items-start text-left transition-transform active:scale-95 ${colorClass}`}
        >
            <div className="w-full flex justify-between items-start">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white/60 backdrop-blur-md shadow-sm ${iconColorClass}`}>
                    <Icon size={20} strokeWidth={2.5} />
                </div>
                {badge && (
                    <span className="w-6 h-6 bg-amber-400 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm">
                        {badge}
                    </span>
                )}
            </div>
            <span className="font-semibold text-slate-700 leading-tight mt-2 text-[15px]">
                {label}
            </span>
        </button>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Sticky Header */}
            <div className="bg-white px-6 py-4 flex justify-between items-center sticky top-0 z-30 shadow-[0_2px_15px_-10px_rgba(0,0,0,0.05)]">
                <h1 className="text-xl font-bold text-sky-500 tracking-tight">
                    Smart Pathshala
                </h1>
                <div className="flex items-center gap-3">
                    <button className="p-2 bg-sky-50 rounded-full text-sky-500 hover:bg-sky-100 transition-colors">
                        <Bell size={20} />
                    </button>
                     <button className="p-2 bg-sky-50 rounded-full text-sky-500 hover:bg-sky-100 transition-colors">
                        <Calendar size={20} />
                    </button>
                     <button onClick={onLogout} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:bg-slate-100 transition-colors">
                        <LogOut size={20} />
                    </button>
                </div>
            </div>

            <div className="p-6 space-y-6 flex-1 overflow-y-auto pb-20 no-scrollbar">
                
                {/* School Profile Card */}
                <div className="w-full bg-gradient-to-br from-[#0EA5E9] to-[#3B82F6] rounded-[32px] p-6 text-white shadow-xl shadow-sky-200/50 relative overflow-hidden">
                     {/* Background shapes */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full translate-x-10 -translate-y-10"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -translate-x-5 translate-y-5"></div>

                    <div className="relative z-10">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md p-1 shrink-0">
                                <div className="w-full h-full rounded-full bg-sky-50 flex items-center justify-center text-sky-600 font-bold text-2xl border border-sky-100">
                                    <img 
                                        src="https://api.dicebear.com/7.x/initials/svg?seed=FI&backgroundColor=e0f2fe&textColor=0ea5e9" 
                                        alt="Logo" 
                                        className="w-full h-full rounded-full"
                                    />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold leading-tight mb-1">FULKURI ISLAMIC <br/> ACADEMY <span className="text-sky-100 text-xs font-normal opacity-80">(Estd: 1982)</span></h2>
                                <span className="inline-block mt-1 bg-white/20 px-2.5 py-0.5 rounded-md text-[10px] font-medium backdrop-blur-md border border-white/10">Student Portal</span>
                            </div>
                        </div>

                        <div className="h-px bg-white/20 mb-4"></div>

                        <div className="space-y-2.5 text-sm font-medium text-sky-50">
                            <div className="flex items-center gap-3">
                                <MapPin size={16} className="text-white shrink-0" />
                                <span>Chapainawabganj-6300</span>
                            </div>
                             <div className="flex items-center gap-3">
                                <Mail size={16} className="text-white shrink-0" />
                                <span>Schoolfulkuri@gmail.com</span>
                            </div>
                             <div className="flex items-center gap-3">
                                <Phone size={16} className="text-white shrink-0" />
                                <span>01309124497</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <MenuItem 
                        label="Student Attendance" 
                        icon={CheckSquare} 
                        colorClass="bg-[#E0F2F1]" 
                        iconColorClass="text-[#00897B]" 
                        onClick={() => {}} 
                    />
                    <MenuItem 
                        label="Teachers Attendance" 
                        icon={UserCheck} 
                        colorClass="bg-[#FFF3E0]" 
                        iconColorClass="text-[#FB8C00]" 
                        onClick={() => {}} 
                    />
                    <MenuItem 
                        label="Accounts" 
                        icon={Receipt} 
                        colorClass="bg-[#E3F2FD]" 
                        iconColorClass="text-[#1E88E5]" 
                        onClick={() => setIsFeePaymentOpen(true)}
                        badge={1}
                    />
                     <MenuItem 
                        label="Exam Results" 
                        icon={ClipboardList} 
                        colorClass="bg-[#F3E5F5]" 
                        iconColorClass="text-[#8E24AA]" 
                        onClick={() => {}} 
                    />
                     <MenuItem 
                        label="Leave Management" 
                        icon={CalendarDays} 
                        colorClass="bg-[#FFEBEE]" 
                        iconColorClass="text-[#E53935]" 
                        onClick={() => {}} 
                    />
                     <MenuItem 
                        label="Notification" 
                        icon={Bell} 
                        colorClass="bg-[#FFFDE7]" 
                        iconColorClass="text-[#FBC02D]" 
                        onClick={() => {}} 
                    />
                     <MenuItem 
                        label="Event" 
                        icon={Cake} 
                        colorClass="bg-[#E1F5FE]" 
                        iconColorClass="text-[#039BE5]" 
                        onClick={() => {}} 
                    />
                     <MenuItem 
                        label="Transport" 
                        icon={Bus} 
                        colorClass="bg-[#EDE7F6]" 
                        iconColorClass="text-[#5E35B1]" 
                        onClick={() => setIsBusTrackerOpen(true)} 
                    />
                </div>
                
                {/* Courses List - Functionally accessible below grid */}
                <div className="pt-2">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-800 text-lg">My Subjects</h3>
                         <button className="text-xs font-bold text-sky-500 hover:text-sky-600 transition-colors">See All</button>
                    </div>
                    <div className="space-y-3">
                        {courses.map(course => (
                            <button 
                                key={course.id}
                                onClick={() => onSelectCourse(course)}
                                className="w-full bg-white p-4 rounded-[24px] shadow-sm border border-slate-100 flex items-center justify-between group active:scale-[0.98] transition-transform"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-slate-50 shadow-inner group-hover:scale-110 transition-transform`}>
                                        {course.icon}
                                    </div>
                                    <div className="text-left">
                                        <h4 className="font-bold text-slate-800">{course.title}</h4>
                                        <p className="text-xs text-slate-400 font-medium">Class 10-B</p>
                                    </div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-sky-50 group-hover:text-sky-500 transition-colors">
                                    <ChevronRight size={18} />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

            </div>

             {/* Bus Tracker Modal */}
            <BusTracker isOpen={isBusTrackerOpen} onClose={() => setIsBusTrackerOpen(false)} />
            
            {/* Fee Payment Modal */}
            <FeePayment isOpen={isFeePaymentOpen} onClose={() => setIsFeePaymentOpen(false)} />
        </div>
    );
};
