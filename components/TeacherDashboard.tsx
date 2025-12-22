import React, { useState } from 'react';
import { 
    LogOut, Bell, Calendar, BookOpen, Users, Clock, 
    MapPin, CheckSquare, Plus, ChevronDown, ChevronUp, 
    FileText, Video, Link as LinkIcon, CheckCircle2, 
    MoreHorizontal, Download, Play, ExternalLink, X, Save
} from 'lucide-react';

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

const SUBJECT_STYLES: Record<string, { icon: string; color: string }> = {
    'Mathematics': { icon: '📐', color: 'bg-orange-100 text-orange-600' },
    'Physics': { icon: '⚡', color: 'bg-purple-100 text-purple-600' },
    'Chemistry': { icon: '🧪', color: 'bg-emerald-100 text-emerald-600' },
    'Biology': { icon: '🧬', color: 'bg-blue-100 text-blue-600' },
    'History': { icon: '📜', color: 'bg-amber-100 text-amber-600' },
    'English': { icon: '📚', color: 'bg-pink-100 text-pink-600' },
    'Art': { icon: '🎨', color: 'bg-rose-100 text-rose-600' },
    'Other': { icon: '📝', color: 'bg-slate-100 text-slate-600' },
};

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState<TeacherTab>('PLANNER');
    const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);
    const [completedLessons, setCompletedLessons] = useState<string[]>([]);
    const [lessons, setLessons] = useState<Lesson[]>(MOCK_LESSONS);
    
    // Add Lesson Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newLesson, setNewLesson] = useState({
        subject: 'Mathematics',
        topic: '',
        time: '',
        classRoom: '',
        notes: '',
        resourceTitle: '',
        resourceType: 'PDF' as const
    });

    const toggleCompletion = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setCompletedLessons(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleSaveLesson = () => {
        if (!newLesson.topic || !newLesson.time || !newLesson.classRoom) return;

        const style = SUBJECT_STYLES[newLesson.subject] || SUBJECT_STYLES['Other'];
        const lessonToAdd: Lesson = {
            id: Date.now().toString(),
            subject: newLesson.subject,
            topic: newLesson.topic,
            time: newLesson.time,
            classRoom: newLesson.classRoom,
            notes: newLesson.notes,
            icon: style.icon,
            color: style.color,
            resources: newLesson.resourceTitle ? [{ title: newLesson.resourceTitle, type: newLesson.resourceType }] : []
        };

        setLessons(prev => [lessonToAdd, ...prev]);
        setIsAddModalOpen(false);
        setNewLesson({
            subject: 'Mathematics',
            topic: '',
            time: '',
            classRoom: '',
            notes: '',
            resourceTitle: '',
            resourceType: 'PDF'
        });
    };

    const renderResourceIcon = (type: string) => {
        switch (type) {
            case 'PDF': return <div className="text-red-500"><FileText size={16} /></div>;
            case 'VIDEO': return <div className="text-blue-500"><Video size={16} /></div>;
            case 'LINK': return <div className="text-emerald-500"><LinkIcon size={16} /></div>;
            default: return <FileText size={16} />;
        }
    };

    const getActionIcon = (type: string) => {
        switch (type) {
            case 'PDF': return <Download size={14} />;
            case 'VIDEO': return <Play size={14} />;
            case 'LINK': return <ExternalLink size={14} />;
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'PLANNER':
                return (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="flex justify-between items-center px-2">
                            <h3 className="font-bold text-slate-900 text-lg">Today's Schedule</h3>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                        </div>
                        
                        <div className="space-y-4">
                            {lessons.map((l) => {
                                const isExpanded = expandedLessonId === l.id;
                                const isCompleted = completedLessons.includes(l.id);
                                
                                return (
                                    <div 
                                        key={l.id} 
                                        onClick={() => setExpandedLessonId(isExpanded ? null : l.id)}
                                        className={`bg-white p-5 rounded-[32px] border relative overflow-hidden group transition-all duration-300 cursor-pointer ${
                                            isExpanded ? 'ring-2 ring-indigo-500/10 shadow-xl scale-[1.02] z-20 border-indigo-100' : 'hover:shadow-md border-slate-100 shadow-sm'
                                        } ${isCompleted && !isExpanded ? 'bg-emerald-50/50 border-emerald-100' : ''}`}
                                    >
                                        {/* Status Bar */}
                                        <div className={`absolute left-0 top-0 bottom-0 w-2 transition-all duration-300 ${
                                            isCompleted ? 'bg-emerald-500' : (isExpanded ? 'bg-indigo-600' : 'bg-slate-200')
                                        }`}></div>

                                        {/* Header Content */}
                                        <div className="flex gap-5 items-center">
                                            <div className={`w-14 h-14 rounded-[20px] ${isCompleted ? 'bg-emerald-100 text-emerald-600' : l.color} flex items-center justify-center text-2xl shrink-0 shadow-inner transition-colors`}>
                                                {isCompleted ? <CheckCircle2 size={28} /> : l.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-0.5">
                                                    <h4 className={`font-bold text-base transition-colors ${isCompleted ? 'text-emerald-700' : 'text-slate-900'}`}>{l.subject}</h4>
                                                    <div className="text-slate-300 flex items-center gap-2">
                                                        {isCompleted && <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-100 px-2 py-0.5 rounded-full">Finished</span>}
                                                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                    </div>
                                                </div>
                                                <p className="text-xs text-slate-500 mb-2 font-medium truncate">{l.topic}</p>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                                                        <Clock size={12} className="text-slate-300" /> {l.time}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                                                        <MapPin size={12} className="text-slate-300" /> Room {l.classRoom}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expanded Details */}
                                        {isExpanded && (
                                            <div className="mt-6 pt-6 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <div className="space-y-6">
                                                    {/* Resources */}
                                                    {l.resources.length > 0 && (
                                                        <div>
                                                            <div className="flex justify-between items-center mb-3">
                                                                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                                                    <LinkIcon size={12} /> Resources ({l.resources.length})
                                                                </h5>
                                                                <button className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md hover:bg-indigo-100 transition-colors">Add New</button>
                                                            </div>
                                                            <div className="grid grid-cols-1 gap-2">
                                                                {l.resources.map((r, idx) => (
                                                                    <button key={idx} className="w-full flex items-center gap-3 p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all group/res text-left border border-slate-50 hover:border-slate-200">
                                                                        <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 group-hover/res:scale-110 transition-transform">
                                                                            {renderResourceIcon(r.type)}
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <span className="text-xs font-bold text-slate-700 block truncate">{r.title}</span>
                                                                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{r.type}</span>
                                                                        </div>
                                                                        <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-slate-400 group-hover/res:text-indigo-600 shadow-sm border border-slate-100">
                                                                            {getActionIcon(r.type)}
                                                                        </div>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Notes */}
                                                    {l.notes && (
                                                        <div>
                                                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                                                <FileText size={12} /> Planner Notes
                                                            </h5>
                                                            <div className="text-xs text-slate-600 bg-amber-50/50 p-4 rounded-2xl border border-amber-100/30 leading-relaxed font-medium relative italic">
                                                                <div className="absolute top-0 left-0 w-1 h-full bg-amber-200 rounded-l-2xl"></div>
                                                                "{l.notes}"
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div className="flex gap-3 mt-8">
                                                    <button 
                                                        onClick={(e) => toggleCompletion(l.id, e)}
                                                        className={`flex-1 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${
                                                            isCompleted 
                                                            ? 'bg-emerald-500 text-white shadow-emerald-200' 
                                                            : 'bg-indigo-600 text-white shadow-indigo-200'
                                                        }`}
                                                    >
                                                        {isCompleted ? <><CheckCircle2 size={16} /> Mark Incomplete</> : 'Finish Lesson'}
                                                    </button>
                                                    <button className="w-12 h-12 bg-white border border-slate-200 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-slate-50 transition-colors">
                                                        <MoreHorizontal size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Summary Stats */}
                        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Daily Progress</h3>
                            <div className="flex items-center gap-4">
                                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-emerald-500 transition-all duration-1000 ease-out"
                                        style={{ width: `${(completedLessons.length / (lessons.length || 1)) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs font-black text-slate-900">{completedLessons.length}/{lessons.length} Done</span>
                            </div>
                        </div>
                    </div>
                );
            case 'CLASSES':
                return (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400 animate-in fade-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-slate-100 rounded-[32px] flex items-center justify-center mb-4">
                            <BookOpen size={40} className="opacity-30" />
                        </div>
                        <p className="font-bold">Classes Module</p>
                        <p className="text-xs mt-1">Management features coming soon</p>
                    </div>
                );
            case 'STUDENTS':
                    return (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400 animate-in fade-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-slate-100 rounded-[32px] flex items-center justify-center mb-4">
                            <Users size={40} className="opacity-30" />
                        </div>
                        <p className="font-bold">Student Directory</p>
                        <p className="text-xs mt-1">Full database access coming soon</p>
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
                        <div className="w-10 h-10 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 font-bold border-2 border-white shadow-sm overflow-hidden">
                            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Teacher" alt="JD" className="w-full h-full" />
                        </div>
                        <div>
                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Educator Portal</p>
                            <h1 className="text-sm font-bold text-slate-900">Prof. John Doe</h1>
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
            <div className="absolute bottom-0 w-full bg-white border-t border-slate-100 p-2 pb-8 z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                <div className="flex justify-around items-center px-2">
                    {[
                        { id: 'PLANNER', icon: Calendar, label: 'Planner' },
                        { id: 'CLASSES', icon: BookOpen, label: 'Classes' },
                        { id: 'STUDENTS', icon: Users, label: 'Students' },
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as TeacherTab)}
                            className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all duration-300 ${activeTab === tab.id ? 'text-indigo-600 bg-indigo-50 w-24' : 'text-slate-300 w-16'}`}
                        >
                            <tab.icon size={20} strokeWidth={activeTab === tab.id ? 3 : 2} />
                            <span className={`text-[10px] font-black uppercase tracking-tighter ${activeTab === tab.id ? 'block' : 'hidden'}`}>{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Floating Action Button */}
            {activeTab === 'PLANNER' && (
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="absolute bottom-28 right-6 w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-slate-300 active:scale-90 transition-transform z-30 group"
                >
                    <Plus size={28} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>
            )}

            {/* Add New Lesson Modal */}
            {isAddModalOpen && (
                <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-300">
                    <div className="bg-white w-full h-[90%] sm:h-auto sm:max-h-[80%] rounded-t-[40px] sm:rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-500 mx-0 sm:mx-6">
                        
                        {/* Modal Header */}
                        <div className="px-8 pt-8 pb-4 flex justify-between items-center shrink-0">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">New Lesson</h2>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Daily Planner</p>
                            </div>
                            <button 
                                onClick={() => setIsAddModalOpen(false)}
                                className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-6 no-scrollbar pt-2">
                            {/* Subject Picker */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {Object.keys(SUBJECT_STYLES).map(subj => (
                                        <button 
                                            key={subj}
                                            onClick={() => setNewLesson({...newLesson, subject: subj})}
                                            className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                                                newLesson.subject === subj 
                                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100 scale-105' 
                                                : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                                            }`}
                                        >
                                            <span className="text-xl mb-1">{SUBJECT_STYLES[subj].icon}</span>
                                            <span className="text-[8px] font-black uppercase truncate w-full text-center">{subj}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Form Fields */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Topic Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Calculus"
                                        value={newLesson.topic}
                                        onChange={e => setNewLesson({...newLesson, topic: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Time</label>
                                    <input 
                                        type="text" 
                                        placeholder="08:30 AM"
                                        value={newLesson.time}
                                        onChange={e => setNewLesson({...newLesson, time: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Classroom / Lab</label>
                                <input 
                                    type="text" 
                                    placeholder="Room 302"
                                    value={newLesson.classRoom}
                                    onChange={e => setNewLesson({...newLesson, classRoom: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Additional Notes</label>
                                <textarea 
                                    rows={3}
                                    placeholder="Write any reminders here..."
                                    value={newLesson.notes}
                                    onChange={e => setNewLesson({...newLesson, notes: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                                />
                            </div>

                            {/* Initial Resource */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Initial Resource (Optional)</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        placeholder="Document title..."
                                        value={newLesson.resourceTitle}
                                        onChange={e => setNewLesson({...newLesson, resourceTitle: e.target.value})}
                                        className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    />
                                    <select 
                                        value={newLesson.resourceType}
                                        onChange={e => setNewLesson({...newLesson, resourceType: e.target.value as any})}
                                        className="bg-white border border-slate-100 rounded-2xl px-3 text-xs font-bold focus:outline-none"
                                    >
                                        <option value="PDF">PDF</option>
                                        <option value="VIDEO">Video</option>
                                        <option value="LINK">Link</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-8 bg-white border-t border-slate-50 shrink-0">
                            <button 
                                onClick={handleSaveLesson}
                                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-slate-200 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                            >
                                <Save size={20} />
                                Create Lesson
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};