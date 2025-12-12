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
                className="drop-shadow-sm"
            >
                {/* Green Rind (with bite marks on right side) */}
                <path 
                    d="M 100 20 
                       L 130 65 L 120 75 L 135 85 L 125 95 L 175 145 
                       Q 100 190 25 145 
                       Z" 
                    fill="#16a34a" 
                    strokeLinejoin="round"
                />
                
                {/* White Rind Layer */}
                <path 
                    d="M 100 30 
                       L 125 68 L 118 76 L 130 86 L 122 94 L 165 142 
                       Q 100 180 35 142 
                       Z" 
                    fill="#ecfccb" 
                    strokeLinejoin="round"
                />

                {/* Red Flesh Layer */}
                <path 
                    d="M 100 40 
                       L 120 70 L 115 75 L 125 84 L 118 90 L 155 138 
                       Q 100 170 45 138 
                       Z" 
                    fill="#ef4444" 
                    strokeLinejoin="round"
                />

                {/* Seeds */}
                <g fill="#1f2937">
                    <ellipse cx="85" cy="100" rx="3" ry="5" transform="rotate(-15 85 100)" />
                    <ellipse cx="70" cy="125" rx="3" ry="5" transform="rotate(-20 70 125)" />
                    <ellipse cx="110" cy="115" rx="3" ry="5" transform="rotate(10 110 115)" />
                    <ellipse cx="130" cy="130" rx="3" ry="5" transform="rotate(20 130 130)" />
                    <ellipse cx="100" cy="135" rx="3" ry="5" />
                    <ellipse cx="55" cy="130" rx="3" ry="5" transform="rotate(-25 55 130)" />
                </g>
            </svg>
            
            {withText && (
                <div className="mt-2 text-center flex items-center gap-0.5 justify-center">
                    <span className="text-3xl font-bold text-[#16a34a] tracking-tight">Open</span>
                    <span className="text-3xl font-bold text-[#ef4444] tracking-tight">5</span>
                </div>
            )}
        </div>
    );
};