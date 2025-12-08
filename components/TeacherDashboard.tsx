import React, { useState, useEffect } from 'react';
import { MOCK_ATTENDANCE, MOCK_SALARY } from '../constants';
import { LogOut, CheckCircle, XCircle, Clock, DollarSign, Calendar, Plus, Home, ClipboardList, GraduationCap, FileText, UserCog, Star, Users, ChevronRight, ChevronLeft, UserX, StickyNote, Trophy } from 'lucide-react';

interface TeacherDashboardProps {
    onLogout: () => void;
}

type Tab = 'HOME' | 'PLANNER' | 'ASSIGNMENTS' | 'GRADING';

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState<Tab>('HOME');
    const [attendance, setAttendance] = useState(MOCK_ATTENDANCE);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Mock Data State (Simplified for reset)
    const [lessons] = useState([
        { id: '1', time: '09:00 AM', subject: 'Math', topic: 'Calculus', classRoom: '302', icon: '📐', color: 'bg-indigo-50' },
        { id: '2', time: '11:30 AM', subject: 'Physics', topic: 'Laws of Motion', classRoom: 'Lab 2', icon: '⚡', color: 'bg-orange-50' }
    ]);

    const renderHeader = () => (
        <div className="px-6 py-6 pb-8 bg-indigo-600 text-white rounded-b-[32px] shadow-lg shadow-indigo-200 z-10 shrink-0">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <span className="bg-indigo-500/50 border border-indigo-400/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Teacher Portal</span>
                    <h1 className="text-2xl font-bold mt-2">Hello, Sarah 👋</h1>
                </div>
                <button onClick={onLogout} className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors">
                    <LogOut size={20} />
                </button>
            </div>
            {activeTab === 'HOME' && (
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-xs text-indigo-100 uppercase font-bold mb-1">Upcoming Salary</p>
                        <h2 className="text-2xl font-bold">${MOCK_SALARY.total.toLocaleString()}</h2>
                    </div>
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-lg">
                        <DollarSign size={20} />
                    </div>
                </div>
            )}
        </div>
    );

    const renderContent = () => {
        switch(activeTab) {
            case 'HOME':
                return (
                    <div className="space-y-6">
                        <div className="bg-white p-4 rounded-[24px] shadow-sm border border-slate-100">
                             <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-slate-800">Attendance</h3>
                                <button className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">Mark All</button>
                             </div>
                             <div className="grid grid-cols-1 gap-3">
                                {attendance.map(s => (
                                    <div key={s.id} className="flex items-center justify-between p-3 rounded-2xl border border-slate-50 bg-slate-50/50">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl ${s.avatarColor} flex items-center justify-center font-bold`}>{s.name[0]}</div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-700">{s.name}</p>
                                                <p className="text-xs text-slate-400">Roll: {s.rollNo}</p>
                                            </div>
                                        </div>
                                        <div className={`px-3 py-1 rounded-lg text-xs font-bold ${s.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                            {s.status}
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </div>
                );
            case 'PLANNER':
                return (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-2">
                             <h3 className="font-bold text-slate-800">Today's Schedule</h3>
                             <button className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center"><Plus size={16}/></button>
                        </div>
                        {lessons.map(l => (
                            <div key={l.id} className="bg-white p-4 rounded-[24px] shadow-sm border border-slate-100 flex gap-4">
                                <div className={`w-16 flex flex-col items-center justify-center rounded-2xl ${l.color} text-lg`}>
                                    {l.icon}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800">{l.subject}</h4>
                                    <p className="text-xs text-slate-500 mb-2">{l.topic}</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-md">{l.time}</span>
                                        <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-md">Room {l.classRoom}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            default:
                return <div className="p-8 text-center text-slate-400 font-medium">Section under maintenance</div>;
        }
    }

    return (
        <div className="h-full flex flex-col bg-slate-50">
            {renderHeader()}
            <div className="flex-1 overflow-y-auto p-6 pb-28 no-scrollbar">
                {renderContent()}
            </div>
            
            {/* Bottom Nav */}
            <div className="bg-white border-t border-slate-200 p-2 pb-6 absolute bottom-0 w-full z-20">
                <div className="flex justify-around items-center">
                    {['HOME', 'PLANNER', 'ASSIGNMENTS', 'GRADING'].map((tab) => (
                        <button 
                            key={tab} 
                            onClick={() => setActiveTab(tab as Tab)}
                            className={`p-3 rounded-2xl transition-all ${activeTab === tab ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400'}`}
                        >
                            {tab === 'HOME' && <Home size={24} />}
                            {tab === 'PLANNER' && <Calendar size={24} />}
                            {tab === 'ASSIGNMENTS' && <ClipboardList size={24} />}
                            {tab === 'GRADING' && <GraduationCap size={24} />}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};