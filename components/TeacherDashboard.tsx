import React, { useState } from 'react';
import { LogOut, Bell, Calendar, BookOpen, Users, Clock, MapPin, CheckSquare, Plus, MoreVertical, ChevronDown, ChevronUp, FileText, Video, Link as LinkIcon } from 'lucide-react';

interface TeacherDashboardProps {
    onLogout: () => void;
}

type TeacherTab = 'PLANNER' | 'CLASSES' | 'STUDENTS';

interface Resource {
    type: 'PDF' | 'VIDEO' | 'LINK';
    title: string;
}

interface Lesson {
    id: string;
    subject: string;
    topic: string;
    time: string;
    classRoom: string;
    icon: string;
    color: string;
    resources: Resource[];
    notes: string;
}

const MOCK_LESSONS: Lesson[] = [
    { 
        id: '1', 
        subject: 'Mathematics', 
        topic: 'Calculus: Derivatives', 
        time: '08:30 AM', 
        classRoom: '302', 
        icon: '📐', 
        color: 'bg-orange-100 text-orange-600',
        resources: [
            { type: 'PDF', title: 'Chapter 4 Practice.pdf' },
            { type: 'VIDEO', title: 'Introduction to Derivatives' }
        ],
        notes: 'Review homework questions from yesterday before starting the new topic.'
    },
    { 
        id: '2', 
        subject: 'Physics', 
        topic: 'Quantum Mechanics Intro', 
        time: '10:15 AM', 
        classRoom: 'Lab A', 
        icon: '⚡', 
        color: 'bg-purple-100 text-purple-600',
        resources: [
            { type: 'LINK', title: 'Double Slit Experiment Sim' }
        ],
        notes: 'Set up the laser equipment 10 mins early. Ensure safety goggles are available.'
    },
    { 
        id: '3', 
        subject: 'Chemistry', 
        topic: 'Organic Compounds', 
        time: '01:00 PM', 
        classRoom: 'Lab B', 
        icon: '🧪', 
        color: 'bg-emerald-100 text-emerald-600',
        resources: [
            { type: 'PDF', title: 'Lab Report Template.pdf' },
            { type: 'PDF', title: 'Safety Guidelines.pdf' }
        ],
        notes: 'Collect signed permission slips for next week\'s field trip.'
    },
];

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState<TeacherTab>('PLANNER');
    const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);
    const lessons = MOCK_LESSONS;

    const renderResourceIcon = (type: string) => {
        switch (type) {
            case 'PDF': return <FileText size={16} />;
            case 'VIDEO': return <Video size={16} />;
            case 'LINK': return <LinkIcon size={16} />;
            default: return <FileText size={16} />;
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'PLANNER':
                return (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="flex justify-between items-center px-2">
                            <h3 className="font-bold text-slate-900 text-lg">Today's Schedule</h3>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{new Date().toLocaleDateString()}</div>
                        </div>
                        
                        <div className="space-y-4">
                            {lessons.map((l) => {
                                const isExpanded = expandedLessonId === l.id;
                                return (
                                    <div 
                                        key={l.id} 
                                        onClick={() => setExpandedLessonId(isExpanded ? null : l.id)}
                                        className={`bg-white p-5 rounded-[32px] shadow-sm border border-slate-100 relative overflow-visible group transition-all duration-300 cursor-pointer ${isExpanded ? 'ring-2 ring-indigo-500/10 shadow-md z-20' : 'hover:z-10'}`}
                                    >
                                        {/* Tooltip - Hide when expanded */}
                                        {!isExpanded && (
                                            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 bg-slate-900 text-white text-[10px] p-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-xl transform translate-y-2 group-hover:translate-y-0 z-50">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="font-bold text-indigo-300 uppercase tracking-wide text-[9px]">Topic Info</span>
                                                </div>
                                                <p className="font-medium leading-relaxed mb-1">{l.topic}</p>
                                                <p className="text-slate-400 text-[9px]">{l.resources.length} resources attached • Click to expand</p>
                                                
                                                {/* Arrow */}
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-slate-900"></div>
                                            </div>
                                        )}

                                        {/* Left Bar */}
                                        <div className={`absolute left-0 top-0 bottom-0 w-2 rounded-l-[32px] transition-all duration-300 ${isExpanded ? 'bg-indigo-600' : 'bg-gradient-to-b from-indigo-500 to-purple-500'}`}></div>

                                        {/* Header Content */}
                                        <div className="flex gap-5 items-center">
                                            <div className={`w-16 h-16 rounded-[20px] ${l.color} flex items-center justify-center text-2xl shrink-0 shadow-inner`}>
                                                {l.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="font-bold text-slate-900 text-lg">{l.subject}</h4>
                                                    <div className="text-slate-300">
                                                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-slate-500 mb-2 font-medium truncate">{l.topic}</p>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                                                        <Clock size={12} className="text-indigo-500" /> {l.time}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                                                        <MapPin size={12} className="text-orange-500" /> Rm {l.classRoom}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expanded Details */}
                                        {isExpanded && (
                                            <div className="mt-6 pt-6 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300 pl-2">
                                                <div className="grid grid-cols-1 gap-6">
                                                    {/* Resources */}
                                                    <div>
                                                        <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-1">
                                                            <LinkIcon size={12} /> Attached Resources ({l.resources.length})
                                                        </h5>
                                                        <div className="space-y-2">
                                                            {l.resources.map((r, idx) => (
                                                                <button key={idx} className="w-full flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group/res text-left border border-slate-100">
                                                                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-indigo-500 shadow-sm border border-slate-100 group-hover/res:scale-110 transition-transform">
                                                                        {renderResourceIcon(r.type)}
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <span className="text-xs font-bold text-slate-700 block truncate">{r.title}</span>
                                                                        <span className="text-[10px] text-slate-400 font-medium">{r.type} File</span>
                                                                    </div>
                                                                    <div className="opacity-0 group-hover/res:opacity-100 text-slate-400">
                                                                        <ChevronDown size={14} className="-rotate-90" />
                                                                    </div>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Notes */}
                                                    <div>
                                                        <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                                                            <FileText size={12} /> Teacher's Notes
                                                        </h5>
                                                        <div className="text-sm text-slate-600 bg-yellow-50/50 p-4 rounded-xl border border-yellow-100/50 leading-relaxed font-medium relative">
                                                            <div className="absolute top-0 left-0 w-1 h-full bg-yellow-300 rounded-l-xl opacity-50"></div>
                                                            {l.notes}
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex gap-2 mt-6">
                                                    <button className="flex-1 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-200 active:scale-95 transition-all">
                                                        Start Lesson
                                                    </button>
                                                    <button className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors">
                                                        Edit
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <button className="p-4 bg-indigo-600 rounded-[24px] text-white flex flex-col items-center gap-2 shadow-lg shadow-indigo-200 active:scale-95 transition-transform">
                                <Plus size={24} />
                                <span className="text-xs font-bold">New Lesson</span>
                            </button>
                            <button className="p-4 bg-white border border-slate-100 rounded-[24px] text-slate-600 flex flex-col items-center gap-2 shadow-sm active:scale-95 transition-transform">
                                <CheckSquare size={24} />
                                <span className="text-xs font-bold">Attendance</span>
                            </button>
                        </div>
                    </div>
                );
            case 'CLASSES':
                return (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400 animate-in fade-in zoom-in duration-300">
                        <BookOpen size={48} className="mb-4 opacity-50" />
                        <p className="font-bold">Classes Module</p>
                    </div>
                );
            case 'STUDENTS':
                    return (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400 animate-in fade-in zoom-in duration-300">
                        <Users size={48} className="mb-4 opacity-50" />
                        <p className="font-bold">Students Directory</p>
                    </div>
                );
            default: 
                return null;
        }
    };

    return (
        <div className="h-full flex flex-col bg-slate-50 relative">
                {/* Header */}
            <div className="px-6 py-6 bg-white/80 backdrop-blur-md border-b border-slate-100 z-10 shrink-0 sticky top-0">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold border-2 border-white shadow-sm">
                            JD
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Teacher</p>
                            <h1 className="text-sm font-bold text-slate-900">John Doe</h1>
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
            </div>

            <div className="flex-1 overflow-y-auto p-6 pb-32 no-scrollbar">
                {renderContent()}
            </div>

                {/* Tab Bar */}
            <div className="absolute bottom-0 w-full bg-white border-t border-slate-100 p-2 pb-6 z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                <div className="flex justify-around items-center px-2">
                    {[
                        { id: 'PLANNER', icon: Calendar, label: 'Planner' },
                        { id: 'CLASSES', icon: BookOpen, label: 'Classes' },
                        { id: 'STUDENTS', icon: Users, label: 'Students' },
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as TeacherTab)}
                            className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all duration-300 ${activeTab === tab.id ? 'text-indigo-600 bg-indigo-50 w-20' : 'text-slate-400 w-16'}`}
                        >
                            <tab.icon size={22} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
                            <span className={`text-[9px] font-bold ${activeTab === tab.id ? 'block' : 'hidden'}`}>{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};