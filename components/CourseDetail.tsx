
import React, { useState, useRef } from 'react';
import { Course } from '../types';
import { ChevronLeft, Star, PlayCircle, Lock, MessageCircle, ArrowRight } from 'lucide-react';
import { GeminiTutor } from './GeminiTutor';

interface CourseDetailProps {
    course: Course;
    onBack: () => void;
}

export const CourseDetail: React.FC<CourseDetailProps> = ({ course, onBack }) => {
    const [isTutorOpen, setIsTutorOpen] = useState(false);
    const [highlightFirst, setHighlightFirst] = useState(false);
    const firstItemRef = useRef<HTMLDivElement>(null);

    // Create dynamic system instruction based on course details
    const tutorSystemInstruction = `You are an expert AI Tutor for the course "${course.title}".
    
Course Description: ${course.description}

Syllabus Topics:
${course.syllabus.map(item => `- ${item.title} (${item.duration})`).join('\n')}

Your goal is to help the student understand these specific topics. 
When asked, refer to the syllabus to provide context. 
Keep your answers encouraging, educational, and concise suitable for a mobile app.`;

    const handleNextTopic = () => {
        if (firstItemRef.current) {
            firstItemRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setHighlightFirst(true);
            setTimeout(() => setHighlightFirst(false), 2000);
        }
    };

    const isFirstItemUnlocked = course.syllabus.length > 0 && !course.syllabus[0].isLocked;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
            {/* Header / Top Section */}
            <div className="px-6 pt-12 pb-8 flex justify-between items-center z-10">
                <button 
                    onClick={onBack}
                    className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center hover:bg-slate-100 transition-colors"
                >
                    <ChevronLeft size={20} className="text-slate-700" />
                </button>
                <div className="text-slate-800 font-semibold text-lg">Details</div>
                <button className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
            </div>

            {/* Main Course Card */}
            <div className="px-6 mb-8 relative z-10">
                <div className={`w-full rounded-[32px] p-6 bg-gradient-to-r ${course.colorFrom} ${course.colorTo} text-white shadow-xl shadow-orange-200/50 relative overflow-hidden`}>
                    
                    {/* Floating Illustration Placeholder */}
                    <div className="absolute -right-4 top-10 opacity-20 transform rotate-12">
                        <span className="text-9xl">📐</span>
                    </div>

                    <div className="relative z-10">
                        <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
                        <div className="flex items-center gap-2 text-sm text-white/90 mb-6">
                            <Star size={16} fill="white" className="text-white" />
                            <span className="font-semibold">{course.rating}</span>
                            <span className="opacity-80">• {course.reviews} reviews &gt;</span>
                        </div>
                        
                        <div className="flex justify-between items-end">
                            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                                <span className="text-xs uppercase tracking-wider opacity-80 block">Fee</span>
                                <span className="text-xl font-bold">${course.price}</span>
                            </div>
                            
                            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-lg">
                                 <span className="text-5xl drop-shadow-lg filter">{course.icon}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Sheet - Details & Syllabus */}
            <div className="flex-1 bg-white rounded-t-[40px] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] px-6 pt-8 pb-32 relative overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-800">Outline</h2>
                    <button className="text-sm text-indigo-600 font-medium hover:underline">View All</button>
                </div>

                <div className="space-y-4 mb-8">
                    {course.syllabus.map((item, index) => (
                        <div 
                            key={item.id} 
                            ref={index === 0 ? firstItemRef : null}
                            className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-500 border group ${
                                index === 0 && highlightFirst 
                                ? 'bg-orange-50 border-orange-200 shadow-md scale-[1.02]' 
                                : 'hover:bg-slate-50 border-transparent hover:border-slate-100'
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-md ${index === 0 ? 'bg-orange-400' : 'bg-indigo-100 text-indigo-600'}`}>
                                    {index === 0 ? (
                                        <span className="text-xs flex gap-1 items-center justify-center">
                                          <div className="w-1 h-1 bg-white rounded-full"></div>
                                          <div className="w-1 h-1 bg-white rounded-full"></div>
                                        </span>
                                    ) : (
                                        <span className="text-sm text-indigo-400">0{index + 1}</span>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-800 mb-1">{item.title}</h3>
                                    <p className="text-xs text-slate-400">{item.duration}</p>
                                </div>
                            </div>
                            
                            <button className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${item.isLocked ? 'bg-slate-100 text-slate-400' : 'bg-orange-100 text-orange-500 shadow-sm'}`}>
                                {item.isLocked ? <Lock size={18} /> : <PlayCircle size={20} fill="currentColor" className="text-orange-500 bg-white rounded-full" />}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Next Topic Button */}
                <div className="flex justify-end">
                    <button
                        onClick={handleNextTopic}
                        disabled={!isFirstItemUnlocked}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all active:scale-95 ${
                            isFirstItemUnlocked
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                    >
                        Next Topic
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>

            {/* Bottom Sticky Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md p-6 pb-8 border-t border-slate-100 flex items-center gap-4 z-40">
                 <button 
                    onClick={() => setIsTutorOpen(true)}
                    className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex flex-col items-center justify-center shadow-sm active:scale-95 transition-transform"
                >
                    <MessageCircle size={24} />
                    <span className="text-[10px] font-bold">AI Help</span>
                </button>
                
                <button className="flex-1 bg-indigo-600 text-white font-semibold text-lg py-4 rounded-2xl shadow-xl shadow-indigo-200 active:scale-95 transition-transform flex items-center justify-center gap-2">
                    <Lock size={18} />
                    Unlock Course Now
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
