import React, { useState } from 'react';
import { Course } from '../types';
import { ChevronLeft, Star, PlayCircle, Lock, MessageCircle, ArrowRight, Clock, Award, Search, X } from 'lucide-react';
import { GeminiTutor } from './GeminiTutor';

interface CourseDetailProps {
    course: Course;
    onBack: () => void;
}

export const CourseDetail: React.FC<CourseDetailProps> = ({ course, onBack }) => {
    const [isTutorOpen, setIsTutorOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    const tutorSystemInstruction = `You are an expert AI Tutor for the course "${course.title}".
    Course Description: ${course.description}
    Syllabus Topics:
    ${course.syllabus.map(item => `- ${item.title} (${item.duration})`).join('\n')}
    Your goal is to help the student understand these specific topics. Keep answers concise.`;

    const isFirstItemUnlocked = course.syllabus.length > 0 && !course.syllabus[0].isLocked;

    const filteredSyllabus = course.syllabus.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-full bg-white flex flex-col relative overflow-hidden animate-in slide-in-from-right duration-300">
            {/* Floating Navigation */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
                <button 
                    onClick={onBack}
                    className="w-10 h-10 bg-white/20 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors text-white shadow-lg"
                >
                    <ChevronLeft size={22} />
                </button>
            </div>

            {/* Immersive Hero */}
            <div className={`w-full h-[380px] bg-gradient-to-br ${course.colorFrom} ${course.colorTo} relative shrink-0`}>
                 {/* Texture/Pattern */}
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                 <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20"></div>

                 <div className="absolute bottom-0 left-0 right-0 p-8 pb-12 pt-32">
                     <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/10 self-start">
                        <Award size={14} className="text-white" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">Premium Course</span>
                     </div>
                     <h1 className="text-4xl font-bold text-slate-900 mb-3 leading-tight tracking-tight mix-blend-screen">{course.title}</h1>
                     <div className="flex items-center gap-4 text-slate-600 font-medium text-sm">
                        <span className="flex items-center gap-1"><Star size={14} className="fill-slate-900 text-slate-900"/> {course.rating}</span>
                        <span>•</span>
                        <span>{course.reviews} Reviews</span>
                        <span>•</span>
                        <span>{course.syllabus.length} Lessons</span>
                     </div>
                 </div>
                 
                 {/* Hero Icon Decoration */}
                 <div className="absolute top-24 right-6 text-9xl opacity-20 filter blur-sm select-none animate-pulse rotate-12">
                     {course.icon}
                 </div>
            </div>

            {/* Syllabus Container */}
            <div className="flex-1 bg-white -mt-6 rounded-t-[40px] relative z-10 px-6 pt-10 pb-32 overflow-y-auto">
                <div className="flex justify-between items-end mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Curriculum</h2>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {searchTerm ? `Found ${filteredSyllabus.length} lessons` : '0% Completed'}
                    </span>
                </div>

                {/* Search Bar */}
                <div className="mb-8 relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-indigo-500 transition-colors">
                        <Search size={18} />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search lessons..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-11 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 text-slate-700"
                    />
                    {searchTerm && (
                        <button 
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-slate-200/50 hover:bg-slate-200 rounded-full p-1 transition-all"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* Timeline Layout */}
                <div className="relative pl-4 space-y-8">
                    {/* Timeline Line */}
                    <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-100"></div>

                    {filteredSyllabus.length > 0 ? (
                        filteredSyllabus.map((item, index) => (
                            <div key={item.id} className="relative flex items-center gap-5 group animate-in slide-in-from-bottom-2 fade-in duration-300" style={{ animationDelay: `${index * 50}ms` }}>
                                {/* Timeline Node */}
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 border-4 border-white shadow-sm transition-colors ${
                                    index === 0 && !searchTerm ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'
                                }`}>
                                    <span className="text-xs font-bold">{index + 1}</span>
                                </div>

                                <button className={`flex-1 flex items-center justify-between p-5 rounded-[24px] border transition-all hover:scale-[1.02] active:scale-[0.98] ${
                                    index === 0 && !searchTerm
                                    ? 'bg-white border-slate-900/10 shadow-lg shadow-slate-200' 
                                    : 'bg-slate-50 border-transparent opacity-80 hover:opacity-100'
                                }`}>
                                    <div className="text-left">
                                        <h3 className={`font-bold text-base mb-1 ${index === 0 && !searchTerm ? 'text-slate-900' : 'text-slate-700'}`}>{item.title}</h3>
                                        <div className="flex items-center gap-1 text-xs text-slate-400 font-bold uppercase tracking-wide">
                                            <Clock size={10} /> {item.duration}
                                        </div>
                                    </div>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.isLocked ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white shadow-md'}`}>
                                        {item.isLocked ? <Lock size={16} /> : <PlayCircle size={20} fill="currentColor" />}
                                    </div>
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-slate-400 text-sm font-medium animate-in fade-in zoom-in duration-300">
                            No lessons found matching "{searchTerm}"
                        </div>
                    )}
                </div>
            </div>

            {/* Action Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-white/0 z-20 flex gap-4 pt-12">
                 <button 
                    onClick={() => setIsTutorOpen(true)}
                    className="w-16 h-16 bg-white text-indigo-600 rounded-[22px] flex flex-col items-center justify-center shadow-lg shadow-slate-200 border border-slate-100 active:scale-90 transition-transform"
                >
                    <MessageCircle size={24} />
                    <span className="text-[8px] font-bold uppercase mt-1">AI Tutor</span>
                </button>
                
                <button className="flex-1 bg-slate-900 text-white font-bold text-lg rounded-[22px] shadow-2xl shadow-slate-400 active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                    {isFirstItemUnlocked ? 'Start Learning' : 'Enroll Now'}
                    <ArrowRight size={20} />
                </button>
            </div>

             <GeminiTutor 
                isOpen={isTutorOpen} 
                onClose={() => setIsTutorOpen(false)} 
                courseTitle={course.title}
                systemInstruction={tutorSystemInstruction}
            />
        </div>
    );
};