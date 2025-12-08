
import React, { useState, useRef, useEffect } from 'react';
import { MOCK_ATTENDANCE, MOCK_SALARY } from '../constants';
import { LogOut, CheckCircle, XCircle, Clock, DollarSign, Calendar, MapPin, Plus, X, BookOpen, Star, Users, ChevronRight, ChevronLeft, UserCog, Sparkles, ShieldCheck, CalendarX, UserX, StickyNote, Trophy } from 'lucide-react';

interface TeacherDashboardProps {
    onLogout: () => void;
}

interface Lesson {
    id: string;
    time: string;
    subject: string;
    topic: string;
    classRoom: string;
    icon: string;
    notes: string;
    color: string;
    date?: number; // Added to simulate calendar markers
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onLogout }) => {
    // Initialize Attendance from LocalStorage
    const [attendance, setAttendance] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('open5_attendance');
            if (saved) return JSON.parse(saved);
        }
        return MOCK_ATTENDANCE;
    });

    const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);
    
    // Calendar State
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date().getDate());

    // Initialize Lessons from LocalStorage
    const [lessons, setLessons] = useState<Lesson[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('open5_lessons');
            if (saved) return JSON.parse(saved);
        }
        return [
            { 
                id: '1', 
                time: '09:00 AM', 
                subject: 'Mathematics', 
                topic: 'Calculus Derivatives', 
                classRoom: '10-B • Room 302', 
                icon: '📐', 
                notes: 'Bring graph paper and scientific calculators.',
                color: 'bg-indigo-50',
                date: new Date().getDate()
            },
            { 
                id: '2', 
                time: '11:30 AM', 
                subject: 'Physics', 
                topic: 'Laws of Motion', 
                classRoom: '11-A • Lab 2', 
                icon: '⚡', 
                notes: 'Lab experiment setup required. Check safety goggles.',
                color: 'bg-orange-50',
                date: new Date().getDate()
            }
        ];
    });

    // Persistence Effects
    useEffect(() => {
        localStorage.setItem('open5_attendance', JSON.stringify(attendance));
    }, [attendance]);

    useEffect(() => {
        localStorage.setItem('open5_lessons', JSON.stringify(lessons));
    }, [lessons]);

    const [newLesson, setNewLesson] = useState<Partial<Lesson>>({
        time: '',
        subject: '',
        topic: '',
        classRoom: '',
        notes: ''
    });

    const [suggestedProxies, setSuggestedProxies] = useState([
        { id: 'p1', name: 'Mr. David Cohen', subject: 'Mathematics', match: 98, status: 'AVAILABLE', avatarColor: 'bg-indigo-100 text-indigo-600' },
        { id: 'p2', name: 'Ms. Emily Stone', subject: 'Physics', match: 85, status: 'BUSY', avatarColor: 'bg-pink-100 text-pink-600' },
        { id: 'p3', name: 'Mr. Robert Fox', subject: 'Statistics', match: 92, status: 'AVAILABLE', avatarColor: 'bg-cyan-100 text-cyan-600' },
    ]);

    // Calendar Helpers
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday
        
        const days = [];
        // Add padding for empty slots before 1st of month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(null);
        }
        // Add actual days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }
        return days;
    };

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const handleAddLesson = () => {
        if (!newLesson.subject || !newLesson.time) return;
        
        const lesson: Lesson = {
            id: Date.now().toString(),
            time: newLesson.time || '12:00 PM',
            subject: newLesson.subject || 'General',
            topic: newLesson.topic || 'Class Session',
            classRoom: newLesson.classRoom || 'Room 101',
            notes: newLesson.notes || '',
            icon: '📚', // Default icon
            color: 'bg-blue-50',
            date: selectedDate
        };

        setLessons([...lessons, lesson]);
        setNewLesson({ time: '', subject: '', topic: '', classRoom: '', notes: '' });
        setIsAddLessonOpen(false);
    };

    const toggleAttendance = (id: string) => {
        setAttendance(prev => prev.map(student => {
            if (student.id === id) {
                // Cycle: PRESENT -> ABSENT -> LATE -> PRESENT
                if (student.status === 'PRESENT') return { ...student, status: 'ABSENT' };
                if (student.status === 'ABSENT') return { ...student, status: 'LATE' };
                return { ...student, status: 'PRESENT' };
            }
            return student;
        }));
    };

    const markAllPresent = () => {
        setAttendance(prev => prev.map(student => ({ ...student, status: 'PRESENT' })));
    };

    const markAllAbsent = () => {
        setAttendance(prev => prev.map(student => ({ ...student, status: 'ABSENT' })));
    };

    const awardPoint = (id: string) => {
        setAttendance(prev => prev.map(student => {
            if (student.id === id) {
                return { ...student, behaviorPoints: (student.behaviorPoints || 0) + 1 };
            }
            return student;
        }));
    };

    const handleRequestProxy = (id: string) => {
        alert("Proxy request sent successfully!");
    };

    // Calculate Top Student
    const topStudent = attendance.reduce((prev, current) => 
        ((prev.behaviorPoints || 0) > (current.behaviorPoints || 0)) ? prev : current
    , attendance[0]);
    
    const showTopStudent = (topStudent?.behaviorPoints || 0) > 0;

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'PRESENT':
                return {
                    pillStyle: 'bg-gradient-to-r from-emerald-400 to-emerald-500 text-white shadow-lg shadow-emerald-200/40 ring-1 ring-emerald-400/50',
                    rowStyle: 'bg-emerald-50/60 ring-1 ring-emerald-100/50',
                    icon: <CheckCircle size={14} className="text-white drop-shadow-sm flex-shrink-0" />,
                    label: 'Present',
                    avatarRing: 'ring-emerald-400',
                    avatarBg: 'bg-emerald-100 text-emerald-600'
                };
            case 'ABSENT':
                return {
                    pillStyle: 'bg-gradient-to-r from-rose-400 to-rose-500 text-white shadow-lg shadow-rose-200/40 ring-1 ring-rose-400/50',
                    rowStyle: 'bg-rose-50/60 ring-1 ring-rose-100/50',
                    icon: <XCircle size={14} className="text-white drop-shadow-sm flex-shrink-0" />,
                    label: 'Absent',
                    avatarRing: 'ring-rose-400',
                    avatarBg: 'bg-rose-100 text-rose-600'
                };
            case 'LATE':
                return {
                    pillStyle: 'bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-lg shadow-amber-200/40 ring-1 ring-amber-400/50',
                    rowStyle: 'bg-amber-50/60 ring-1 ring-amber-100/50',
                    icon: <Clock size={14} className="text-white drop-shadow-sm flex-shrink-0" />,
                    label: 'Late',
                    avatarRing: 'ring-amber-400',
                    avatarBg: 'bg-amber-100 text-amber-600'
                };
            default:
                return {
                    pillStyle: 'bg-slate-100 text-slate-400',
                    rowStyle: 'bg-white border-transparent',
                    icon: null,
                    label: 'Unknown',
                    avatarRing: 'ring-slate-100',
                    avatarBg: 'bg-slate-100 text-slate-400'
                };
        }
    };

    const calendarGrid = getDaysInMonth(currentMonth);
    const displayedLessons = lessons.filter(l => l.date === selectedDate);

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans relative overflow-hidden">
            {/* Background decoration for soft feel */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-20%] w-[300px] h-[300px] bg-blue-100/40 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[10%] left-[-10%] w-[250px] h-[250px] bg-orange-100/40 rounded-full blur-[80px]"></div>
            </div>

            {/* Header Section */}
            <div className="px-5 pt-12 pb-8 sm:px-6 sm:pt-14 sm:pb-10 bg-gradient-to-br from-[#5D8BF4] to-[#8FAEFF] rounded-b-[40px] shadow-[0_20px_40px_-15px_rgba(93,139,244,0.3)] z-10 text-white relative overflow-hidden flex-shrink-0">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

                <div className="flex justify-between items-start mb-6 sm:mb-8 relative z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2 opacity-90">
                            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border border-white/10 shadow-sm">Teacher Portal</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold mt-1 leading-tight drop-shadow-sm">Hello,<br/>Ms. Sarah 👩‍🏫</h1>
                    </div>
                    <button onClick={onLogout} className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center hover:bg-white/30 transition-all active:scale-90 shadow-lg border border-white/10 group touch-manipulation">
                        <LogOut size={18} className="text-white group-hover:text-red-100 transition-colors sm:w-5 sm:h-5" />
                    </button>
                </div>

                {/* Salary Widget - Glassmorphism */}
                <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-[30px] p-5 sm:p-6 flex items-center justify-between shadow-2xl shadow-blue-900/10 relative overflow-hidden group hover:bg-white/20 transition-all active:scale-[0.99] cursor-pointer select-none touch-manipulation">
                    <div className="relative z-10 min-w-0 flex-1">
                        <p className="text-[10px] sm:text-xs text-blue-50 uppercase tracking-wider font-bold mb-1">Available Salary</p>
                        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-md truncate">${MOCK_SALARY.total.toLocaleString()}</h3>
                        <div className="mt-2 inline-flex items-center gap-1.5 bg-black/10 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-white/5 max-w-full">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)] flex-shrink-0"></div>
                            <p className="text-[10px] text-blue-50 font-medium truncate">Paid on {MOCK_SALARY.paymentDate}</p>
                        </div>
                    </div>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-white to-blue-50 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 group-hover:rotate-12 transition-transform duration-300 relative z-10 flex-shrink-0 ml-3">
                        <DollarSign size={24} className="text-[#5D8BF4] sm:w-7 sm:h-7" />
                    </div>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 pt-6 pb-44 space-y-8 relative z-10 no-scrollbar touch-pan-y">
                
                {/* Lesson Planner Section (Full Month Calendar) */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center text-orange-500 shadow-sm border border-orange-50">
                                <Calendar size={20} className="drop-shadow-sm" />
                            </div>
                            <h3 className="font-bold text-slate-800 text-lg">
                                Planner
                            </h3>
                        </div>
                        <button 
                            onClick={() => setIsAddLessonOpen(true)}
                            className="bg-[#FF7F43] hover:bg-[#ff8f5a] text-white p-2.5 px-4 rounded-xl shadow-lg shadow-orange-200/50 active:scale-95 transition-all touch-manipulation flex items-center gap-2"
                        >
                            <Plus size={18} strokeWidth={3} />
                            <span className="text-xs font-bold sm:inline hidden">Add Lesson</span>
                            <span className="text-xs font-bold sm:hidden">Add</span>
                        </button>
                    </div>

                    {/* Month View Calendar Widget */}
                    <div className="bg-white rounded-[32px] p-5 shadow-sm border border-slate-50">
                        {/* Month Header & Navigation */}
                        <div className="flex items-center justify-between mb-4">
                            <button onClick={handlePrevMonth} className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shadow-sm active:scale-95 touch-manipulation">
                                <ChevronLeft size={18} />
                            </button>
                            <h4 className="font-bold text-slate-800 text-lg">
                                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </h4>
                            <button onClick={handleNextMonth} className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shadow-sm active:scale-95 touch-manipulation">
                                <ChevronRight size={18} />
                            </button>
                        </div>

                        {/* Days of Week Header */}
                        <div className="grid grid-cols-7 mb-2 text-center">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                                    {day.charAt(0)}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-2">
                            {calendarGrid.map((day, index) => {
                                if (day === null) return <div key={`empty-${index}`} />;
                                
                                const isSelected = selectedDate === day;
                                const isToday = day === new Date().getDate() && currentMonth.getMonth() === new Date().getMonth() && currentMonth.getFullYear() === new Date().getFullYear();
                                // Check if actual lessons exist for this day
                                const hasLesson = lessons.some(l => l.date === day);

                                return (
                                    <button
                                        key={day}
                                        onClick={() => setSelectedDate(day as number)}
                                        className={`aspect-square rounded-[18px] flex flex-col items-center justify-center relative transition-all duration-300 touch-manipulation ${
                                            isSelected
                                            ? 'bg-gradient-to-br from-[#5D8BF4] to-[#8FAEFF] text-white shadow-lg shadow-blue-200/50 scale-105 z-10'
                                            : isToday 
                                                ? 'bg-blue-50 text-[#5D8BF4] font-bold border border-blue-100'
                                                : 'bg-transparent text-slate-600 hover:bg-slate-50 hover:shadow-sm'
                                        }`}
                                    >
                                        <span className={`text-sm ${isSelected ? 'font-bold' : 'font-medium'}`}>{day}</span>
                                        
                                        {/* Event Indicator Dot */}
                                        {(hasLesson || isSelected) && (
                                            <div className={`w-1 h-1 rounded-full mt-1 ${isSelected ? 'bg-white' : 'bg-[#FF7F43]'}`}></div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    
                    {/* Selected Day Lessons List */}
                    <div className="space-y-4 pt-2">
                        <h4 className="text-sm font-bold text-slate-500 px-2 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                            Schedule for {currentMonth.toLocaleDateString('en-US', { month: 'short' })} {selectedDate}
                        </h4>

                        {displayedLessons.length === 0 ? (
                            <div className="bg-white border-2 border-dashed border-slate-200 rounded-[32px] p-8 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-300">
                                <div className="w-16 h-16 bg-indigo-50 rounded-[24px] flex items-center justify-center text-indigo-300 mb-4 shadow-sm transform -rotate-3">
                                    <CalendarX size={32} />
                                </div>
                                <h4 className="text-slate-600 font-bold text-lg">No lessons scheduled</h4>
                                <p className="text-slate-400 text-sm mt-1 max-w-[200px] leading-relaxed">You have a free day! Tap "Add" above to schedule a new class.</p>
                            </div>
                        ) : (
                            displayedLessons.map((lesson) => (
                                <div key={lesson.id} className="bg-white p-5 rounded-[32px] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] border border-slate-50 relative overflow-hidden group active:scale-[0.98] transition-all duration-200 select-none touch-manipulation hover:shadow-md">
                                    {/* Decorative blob */}
                                    <div className={`absolute right-0 top-0 w-24 h-24 ${lesson.color} rounded-bl-[40px] -mr-6 -mt-6 transition-transform group-hover:scale-110 opacity-60`}></div>
                                    
                                    <div className="flex justify-between items-start relative z-10 mb-3">
                                        <span className="bg-slate-50 text-slate-600 text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-slate-100">
                                            <Clock size={12} className="text-slate-400" />
                                            {lesson.time}
                                        </span>
                                    </div>

                                    <div className="flex items-start gap-4 relative z-10 mb-3">
                                        <div className={`w-12 h-12 sm:w-14 sm:h-14 ${lesson.color} rounded-[20px] flex items-center justify-center text-xl sm:text-2xl shadow-sm ring-4 ring-white transform group-hover:rotate-6 transition-transform duration-300 flex-shrink-0`}>
                                            {lesson.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-slate-800 text-base sm:text-lg leading-tight mb-1 truncate">{lesson.subject}</h4>
                                            <p className="text-slate-500 text-xs sm:text-sm font-medium truncate">{lesson.topic}</p>
                                            
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                <div className="flex items-center gap-1 text-slate-500 text-[10px] font-bold bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100 max-w-full">
                                                    <MapPin size={10} className="flex-shrink-0" />
                                                    <span className="truncate">{lesson.classRoom}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Detailed Notes Section - Sticky Note Style */}
                                    {lesson.notes && (
                                        <div className="relative z-10 mt-2 bg-[#FFF8E1] p-3 rounded-2xl border border-amber-100 flex items-start gap-2 shadow-sm">
                                            <StickyNote size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
                                            <p className="text-xs text-slate-600 font-medium leading-relaxed">
                                                {lesson.notes}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Proxy Management / Substitute Suggestions */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 px-1">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center text-purple-600 shadow-sm border border-purple-50">
                            <UserCog size={20} className="drop-shadow-sm" />
                        </div>
                        <h3 className="font-bold text-slate-800 text-lg">
                            Proxy Management
                        </h3>
                    </div>

                    <div className="bg-slate-50/50 rounded-[32px] p-5 border border-slate-100/50 overflow-hidden relative">
                         <div className="flex justify-between items-center mb-4 px-1">
                             <h4 className="text-sm font-bold text-slate-700">Suggested Substitutes</h4>
                             {suggestedProxies.length > 0 && <span className="text-[10px] bg-purple-100 text-purple-600 px-2 py-1 rounded-md font-bold">Auto-Detected</span>}
                         </div>
                         
                         {suggestedProxies.length === 0 ? (
                            <div className="py-8 flex flex-col items-center justify-center text-center opacity-80 animate-in fade-in duration-300">
                                <div className="w-14 h-14 bg-purple-50 rounded-[20px] flex items-center justify-center text-purple-300 mb-3 shadow-sm rotate-6">
                                    <UserX size={24} />
                                </div>
                                <p className="text-slate-500 font-bold text-sm">No suggestions found</p>
                                <p className="text-[10px] text-slate-400 mt-1 max-w-[180px] leading-relaxed">All teachers are currently busy or no matches found for this period.</p>
                            </div>
                         ) : (
                             <div className="space-y-3">
                                {suggestedProxies.map((proxy) => (
                                    <div key={proxy.id} className="flex items-center justify-between p-4 rounded-[24px] bg-white shadow-sm hover:shadow-md border border-slate-50 transition-all duration-300 group">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-12 h-12 rounded-[18px] ${proxy.avatarColor} flex items-center justify-center font-bold text-lg shadow-inner ring-2 ring-white`}>
                                                {proxy.name.charAt(4)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h5 className="font-bold text-slate-800 text-sm">{proxy.name}</h5>
                                                </div>
                                                <p className="text-[10px] text-slate-400 font-medium">{proxy.subject}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-col items-end gap-1.5">
                                            <div className="flex items-center gap-1.5">
                                                {proxy.status === 'AVAILABLE' && <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span>}
                                                {proxy.status === 'BUSY' && <span className="w-2 h-2 rounded-full bg-orange-400"></span>}
                                                <div className="flex items-center gap-1 text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                                                    <Sparkles size={8} />
                                                    {proxy.match}%
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => handleRequestProxy(proxy.id)}
                                                className="text-[10px] font-bold text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl shadow-lg active:scale-95 transition-all touch-manipulation"
                                            >
                                                Request
                                            </button>
                                        </div>
                                    </div>
                                ))}
                             </div>
                         )}
                         {suggestedProxies.length > 0 && (
                            <button className="w-full mt-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">
                                View All Teachers
                            </button>
                         )}
                    </div>
                </div>

                {/* Attendance & Behavior Section */}
                <div className="relative pt-2">
                     {/* Sticky Header with improved Blur and Z-Index */}
                    <div className="flex justify-between items-center px-1 sticky top-0 bg-[#F8F9FA]/90 backdrop-blur-md py-4 z-20 -mx-4 px-4 sm:-mx-6 sm:px-6 border-b border-slate-200/50 transition-all">
                        <div className="flex items-center gap-3">
                            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                                 Attendance
                                 <span className="text-slate-300 font-normal text-xs">({attendance.length})</span>
                            </h3>
                            {/* Top Student Highlight Widget */}
                            {showTopStudent && (
                                <div className="hidden sm:flex items-center gap-1.5 bg-amber-50 border border-amber-100 px-2 py-1 rounded-full animate-in fade-in slide-in-from-left-2 shadow-sm">
                                    <Trophy size={10} className="text-amber-500 fill-amber-500" />
                                    <span className="text-[10px] font-bold text-amber-700">Top: {topStudent.name}</span>
                                </div>
                            )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                             <button 
                                onClick={markAllPresent}
                                className="bg-blue-50 hover:bg-blue-100 text-[#5D8BF4] px-3 py-1.5 rounded-full text-xs font-bold transition-colors active:scale-95 flex items-center gap-1 border border-blue-100 touch-manipulation whitespace-nowrap"
                             >
                                <Users size={12} />
                                <span className="sm:inline hidden">Mark All Present</span>
                                <span className="sm:hidden">All Present</span>
                             </button>
                             <button 
                                onClick={markAllAbsent}
                                className="bg-rose-50 hover:bg-rose-100 text-rose-500 px-3 py-1.5 rounded-full text-xs font-bold transition-colors active:scale-95 flex items-center gap-1 border border-rose-100 touch-manipulation whitespace-nowrap"
                             >
                                <UserX size={12} />
                                <span className="sm:inline hidden">Mark All Absent</span>
                                <span className="sm:hidden">Reset</span>
                             </button>
                        </div>
                    </div>

                    <div className="space-y-3 pt-4">
                        {attendance.map((student) => {
                            const config = getStatusConfig(student.status);
                            
                            return (
                                <div 
                                    key={student.id} 
                                    onClick={() => toggleAttendance(student.id)}
                                    className={`p-2.5 sm:p-3 pr-2 sm:pr-4 rounded-[24px] sm:rounded-[28px] shadow-sm flex items-center justify-between transition-all duration-300 cursor-pointer select-none active:scale-[0.98] hover:shadow-md ${config.rowStyle} relative overflow-hidden group border border-transparent hover:border-slate-100 touch-manipulation gap-2 sm:gap-4`}
                                >
                                    <div className="flex items-center gap-2 sm:gap-3 relative z-10 flex-1 min-w-0">
                                        <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl ${config.avatarBg} ${config.avatarRing} ring-2 ring-offset-2 flex items-center justify-center font-bold text-base sm:text-lg shadow-inner transition-all duration-300 flex-shrink-0`}>
                                            {student.name.charAt(0)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-1.5">
                                                <h4 className="font-bold text-slate-700 text-sm truncate leading-tight">{student.name}</h4>
                                                {student.status === 'PRESENT' && <CheckCircle size={15} className="text-emerald-500 fill-emerald-100/50 flex-shrink-0" />}
                                                {student.status === 'ABSENT' && <XCircle size={15} className="text-rose-500 fill-rose-100/50 flex-shrink-0" />}
                                                {student.status === 'LATE' && <Clock size={15} className="text-amber-500 fill-amber-100/50 flex-shrink-0" />}
                                            </div>
                                            <p className="text-[10px] text-slate-400 font-medium bg-white/60 px-2 py-0.5 rounded-md inline-block mt-1 backdrop-blur-sm">#{student.rollNo}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 sm:gap-3 relative z-10 flex-shrink-0">
                                        {/* Behavior Star Button */}
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                awardPoint(student.id);
                                            }}
                                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-yellow-50 to-amber-100 border border-amber-200 flex items-center justify-center text-amber-500 shadow-sm active:scale-90 hover:scale-105 transition-all relative touch-manipulation"
                                            title="Award Behavior Point"
                                        >
                                            <Star size={16} fill="currentColor" className="drop-shadow-sm sm:w-[18px] sm:h-[18px]" />
                                            <div className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-[9px] sm:text-[10px] font-bold w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full shadow-sm ring-2 ring-white">
                                                {student.behaviorPoints || 0}
                                            </div>
                                        </button>

                                        {/* Status Pill - Optimized for touch, min-width adjusted for content */}
                                        <button 
                                            className={`h-9 min-w-[70px] sm:min-w-[85px] px-2 sm:px-4 rounded-xl text-[10px] sm:text-xs font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg active:scale-95 ${config.pillStyle}`}
                                        >
                                            {config.icon}
                                            <span>{config.label}</span>
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            
            {/* Fixed Submit Button - Safe Area aware padding (pb-10 covers home indicator + padding) */}
            <div className="fixed bottom-0 left-0 right-0 p-5 pb-10 sm:p-6 bg-gradient-to-t from-white via-white/95 to-transparent z-30">
                 <button 
                    onClick={() => alert("Attendance Submitted!")}
                    className="w-full bg-[#FF7F43] hover:bg-[#ff8f5a] text-white font-bold text-lg py-4 rounded-[24px] shadow-xl shadow-orange-200/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 touch-manipulation border-t border-white/20"
                >
                    <CheckCircle size={20} />
                    Submit Attendance
                </button>
            </div>

            {/* Add Lesson Modal - Bottom Sheet Style */}
            {isAddLessonOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-white w-full sm:max-w-md max-h-[85vh] overflow-y-auto rounded-t-[40px] sm:rounded-[40px] p-6 sm:p-8 shadow-2xl animate-in slide-in-from-bottom duration-300 pb-10 sm:pb-8 overscroll-contain">
                        {/* Drag Handle */}
                        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 opacity-80 sticky top-0"></div>
                        
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-slate-800">Add Lesson</h2>
                            <button onClick={() => setIsAddLessonOpen(false)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors touch-manipulation">
                                <X size={20} className="text-slate-500" />
                            </button>
                        </div>

                        <div className="space-y-4">
                             <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Subject</label>
                                <input 
                                    type="text" 
                                    value={newLesson.subject}
                                    onChange={(e) => setNewLesson({...newLesson, subject: e.target.value})}
                                    placeholder="e.g. Mathematics"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-[20px] px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-[#5D8BF4]/20 focus:border-[#5D8BF4] transition-all shadow-sm"
                                />
                             </div>
                             
                             <div className="grid grid-cols-2 gap-4">
                                 <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Time</label>
                                    <input 
                                        type="text" 
                                        value={newLesson.time}
                                        onChange={(e) => setNewLesson({...newLesson, time: e.target.value})}
                                        placeholder="09:00 AM"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-[20px] px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-[#5D8BF4]/20 focus:border-[#5D8BF4] transition-all shadow-sm"
                                    />
                                 </div>
                                 <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Room</label>
                                    <input 
                                        type="text" 
                                        value={newLesson.classRoom}
                                        onChange={(e) => setNewLesson({...newLesson, classRoom: e.target.value})}
                                        placeholder="Room 101"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-[20px] px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-[#5D8BF4]/20 focus:border-[#5D8BF4] transition-all shadow-sm"
                                    />
                                 </div>
                             </div>

                             <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Topic</label>
                                <input 
                                    type="text" 
                                    value={newLesson.topic}
                                    onChange={(e) => setNewLesson({...newLesson, topic: e.target.value})}
                                    placeholder="e.g. Algebra Basics"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-[20px] px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-[#5D8BF4]/20 focus:border-[#5D8BF4] transition-all shadow-sm"
                                />
                             </div>

                             <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Notes</label>
                                <textarea
                                    value={newLesson.notes}
                                    onChange={(e) => setNewLesson({...newLesson, notes: e.target.value})}
                                    placeholder="e.g. Bring graph paper, Chapter 5..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-[20px] px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-[#5D8BF4]/20 focus:border-[#5D8BF4] transition-all resize-none h-24 shadow-sm"
                                />
                            </div>

                             <button 
                                onClick={handleAddLesson}
                                className="w-full bg-[#5D8BF4] text-white font-bold text-lg py-4 rounded-[24px] shadow-lg shadow-blue-200/50 mt-4 active:scale-95 transition-transform touch-manipulation"
                            >
                                Add to Planner
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
