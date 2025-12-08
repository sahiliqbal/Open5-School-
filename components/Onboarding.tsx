
import React, { useState } from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';

interface OnboardingProps {
    onStart: () => void;
}

const slides = [
    {
        id: 1,
        title: "Online university",
        description: "Access your classes from any device. Education is now at your fingertips with our digital campus.",
        image: "https://img.freepik.com/free-vector/online-learning-concept-illustration_114360-4565.jpg",
        bgColor: "bg-[#4F46E5]", // Indigo 600
        titleColor: "text-white",
        textColor: "text-indigo-100",
        btnColor: "bg-white",
        btnTextColor: "text-indigo-600",
        indicatorActive: "bg-white",
        indicatorInactive: "bg-white/30",
        blobColor: "bg-indigo-500"
    },
    {
        id: 2,
        title: "Home education",
        description: "Learn at your own pace comfortably. Our adaptive learning path fits your unique schedule.",
        image: "https://img.freepik.com/free-vector/studying-concept-illustration_114360-6189.jpg",
        bgColor: "bg-white",
        titleColor: "text-slate-800",
        textColor: "text-slate-500",
        btnColor: "bg-[#FB923C]", // Orange 400
        btnTextColor: "text-white",
        indicatorActive: "bg-orange-400",
        indicatorInactive: "bg-orange-100",
        blobColor: "bg-orange-100"
    },
    {
        id: 3,
        title: "Distance Learning",
        description: "Connect with tutors and classmates globally through our immersive virtual classrooms.",
        image: "https://img.freepik.com/free-vector/webinar-concept-illustration_114360-4764.jpg",
        bgColor: "bg-[#10B981]", // Emerald 500
        titleColor: "text-white",
        textColor: "text-emerald-50",
        btnColor: "bg-white",
        btnTextColor: "text-emerald-600",
        indicatorActive: "bg-white",
        indicatorInactive: "bg-white/30",
        blobColor: "bg-emerald-600"
    }
];

export const Onboarding: React.FC<OnboardingProps> = ({ onStart }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleNext = () => {
        if (isAnimating) return;
        
        if (currentSlide < slides.length - 1) {
            setIsAnimating(true);
            setCurrentSlide(curr => curr + 1);
            setTimeout(() => setIsAnimating(false), 500);
        } else {
            onStart();
        }
    };

    const activeSlide = slides[currentSlide];

    return (
        <div className={`h-screen w-full ${activeSlide.bgColor} flex flex-col relative overflow-hidden transition-colors duration-700 ease-in-out`}>
            
            {/* Background Decorations */}
            <div className={`absolute top-[-10%] right-[-10%] w-80 h-80 rounded-full blur-3xl opacity-50 transition-colors duration-700 ${activeSlide.blobColor}`}></div>
            <div className={`absolute bottom-[-10%] left-[-10%] w-64 h-64 rounded-full blur-3xl opacity-50 transition-colors duration-700 ${activeSlide.blobColor}`}></div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10 max-w-md mx-auto w-full">
                
                {/* Image Container */}
                <div className="w-full aspect-square mb-12 relative flex items-center justify-center">
                    {/* Card background for image to blend properly */}
                    <div className="absolute inset-4 bg-white rounded-[40px] shadow-2xl transform rotate-3 opacity-90 transition-transform duration-500"></div>
                    <div className="absolute inset-4 bg-white rounded-[40px] shadow-lg overflow-hidden transform transition-all duration-500 hover:scale-[1.02]">
                        <img 
                            key={activeSlide.image}
                            src={activeSlide.image} 
                            alt={activeSlide.title}
                            className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-700"
                        />
                    </div>
                </div>

                {/* Text Content */}
                <div className="text-center space-y-4 mb-8">
                    <h1 className={`text-3xl font-bold ${activeSlide.titleColor} transition-colors duration-500`}>
                        {activeSlide.title}
                    </h1>
                    <p className={`text-sm leading-relaxed max-w-xs mx-auto ${activeSlide.textColor} transition-colors duration-500`}>
                        {activeSlide.description}
                    </p>
                </div>

                {/* Indicators */}
                <div className="flex gap-2 mb-8">
                    {slides.map((slide, idx) => (
                        <div 
                            key={slide.id}
                            className={`h-2 rounded-full transition-all duration-500 ${
                                idx === currentSlide 
                                ? `w-8 ${activeSlide.indicatorActive}` 
                                : `w-2 ${activeSlide.indicatorInactive}`
                            }`}
                        />
                    ))}
                </div>

                {/* Action Button */}
                <button 
                    onClick={handleNext}
                    className={`${activeSlide.btnColor} ${activeSlide.btnTextColor} w-full py-4 rounded-[24px] font-bold text-lg shadow-xl hover:shadow-2xl active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 group`}
                >
                    {currentSlide === slides.length - 1 ? 'Get Started' : 'See more'}
                    <span className="group-hover:translate-x-1 transition-transform">
                        {currentSlide === slides.length - 1 ? <ArrowRight size={20} /> : <ChevronRight size={20} />}
                    </span>
                </button>

            </div>
        </div>
    );
};
