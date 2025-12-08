
import React from 'react';

interface CactusLogoProps {
    className?: string;
    size?: number;
    withText?: boolean;
}

export const CactusLogo: React.FC<CactusLogoProps> = ({ className = "", size = 64, withText = false }) => {
    return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
            <svg 
                width={size} 
                height={size} 
                viewBox="0 0 200 200" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-xl"
            >
                <defs>
                    <linearGradient id="mainGradient" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#4F46E5" /> {/* Indigo 600 */}
                        <stop offset="1" stopColor="#0EA5E9" /> {/* Sky 500 */}
                    </linearGradient>
                    <linearGradient id="accentGradient" x1="100" y1="100" x2="180" y2="100" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#F97316" /> {/* Orange 500 */}
                        <stop offset="1" stopColor="#FBBF24" /> {/* Amber 400 */}
                    </linearGradient>
                    <filter id="glow" x="-20" y="-20" width="240" height="240" filterUnits="userSpaceOnUse">
                        <feGaussianBlur stdDeviation="8" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* The 'O' / Circle Background representing a global portal or community */}
                <circle cx="100" cy="100" r="85" stroke="url(#mainGradient)" strokeWidth="12" strokeLinecap="round" opacity="0.1" />

                {/* The '5' Shape / Open Book Motif */}
                {/* Top horizontal stroke of '5' */}
                <path 
                    d="M 70 55 H 140" 
                    stroke="url(#mainGradient)" 
                    strokeWidth="16" 
                    strokeLinecap="round"
                />
                
                {/* Vertical stem of '5' */}
                <path 
                    d="M 70 55 V 100" 
                    stroke="url(#mainGradient)" 
                    strokeWidth="16" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                />

                {/* The Curve of '5' which also looks like an open page/book */}
                <path 
                    d="M 70 100 C 70 100, 140 100, 140 145 C 140 175, 100 175, 75 160" 
                    stroke="url(#mainGradient)" 
                    strokeWidth="16" 
                    strokeLinecap="round"
                    fill="none"
                />

                {/* Tech Accent Dot / Notification - Orange Spark */}
                <circle cx="140" cy="55" r="10" fill="url(#accentGradient)" className="animate-pulse">
                    <animate attributeName="r" values="10;12;10" dur="2s" repeatCount="indefinite" />
                </circle>

                {/* Digital Connectivity Nodes */}
                <circle cx="70" cy="55" r="6" fill="#6366F1" />
                <circle cx="70" cy="100" r="6" fill="#6366F1" />
                
            </svg>
            
            {withText && (
                <div className="mt-2 text-center">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 tracking-tight flex items-center gap-0.5">
                        Open<span className="text-[#0EA5E9]">5</span>
                    </h1>
                </div>
            )}
        </div>
    );
};
