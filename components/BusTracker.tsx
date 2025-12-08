import React, { useState, useEffect } from 'react';
import { X, Phone, Navigation, MapPin, Bus, Locate, Sparkles, ExternalLink } from 'lucide-react';
import { getTrafficInsight, TrafficUpdate } from '../services/geminiService';

interface BusTrackerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const BusTracker: React.FC<BusTrackerProps> = ({ isOpen, onClose }) => {
    const [progress, setProgress] = useState(25); // Start at 25% of the route
    const [eta, setEta] = useState(12);
    const [trafficInfo, setTrafficInfo] = useState<TrafficUpdate | null>(null);
    const [isLoadingTraffic, setIsLoadingTraffic] = useState(false);

    // Simulate GPS movement
    useEffect(() => {
        if (!isOpen) return;
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 85) return 85; // Stop near destination
                return prev + 0.2;
            });
            setEta(prev => Math.max(2, prev - 0.05));
        }, 1000);
        return () => clearInterval(interval);
    }, [isOpen]);

    // Fetch AI Traffic Insight with Geolocation
    useEffect(() => {
        if (isOpen && !trafficInfo) {
            const fetchTraffic = async () => {
                setIsLoadingTraffic(true);
                
                let currentLat: number | undefined;
                let currentLng: number | undefined;
                let searchQuery = "Central Park, New York"; // Default fallback if geo fails

                // Try to get real location
                try {
                    if (navigator.geolocation) {
                        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
                        });
                        currentLat = position.coords.latitude;
                        currentLng = position.coords.longitude;
                        // When using grounding with coords, we can be generic in the prompt or specific "around here"
                        searchQuery = "my current location";
                    }
                } catch (error) {
                    console.warn("Location access denied or timed out, using default.");
                }

                const data = await getTrafficInsight(searchQuery, currentLat, currentLng); 
                setTrafficInfo(data);
                setIsLoadingTraffic(false);
            };
            fetchTraffic();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Calculate position along a bezier curve
    const getBusPosition = (p: number) => {
        // Linear interpolation for simplicity in this demo layout
        // Mapping 0-100 to canvas coordinates
        // Roughly following a "S" shape
        const y = 100 + (p / 100) * 400; 
        const x = 200 + Math.sin(p / 15) * 80;
        return { x, y };
    };

    const pos = getBusPosition(progress);

    return (
        <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col animate-in slide-in-from-bottom duration-500">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-20 pointer-events-none">
                <button 
                    onClick={onClose}
                    className="w-12 h-12 bg-white rounded-2xl shadow-lg shadow-slate-200/50 flex items-center justify-center text-slate-800 pointer-events-auto active:scale-90 transition-transform"
                >
                    <X size={24} />
                </button>
                <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-white/50 pointer-events-auto">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimated Arrival</p>
                    <p className="text-xl font-bold text-slate-800 text-center">{Math.floor(eta)} mins</p>
                </div>
            </div>

            {/* Map Area */}
            <div className="flex-1 relative overflow-hidden bg-slate-100">
                {/* Simulated Map Background */}
                <div className="absolute inset-0 opacity-10">
                    <div className="w-[200%] h-[200%] border-[40px] border-slate-300 rounded-full absolute -top-1/2 -left-1/2"></div>
                    <div className="w-[150%] h-[150%] border-[30px] border-slate-300 rounded-full absolute top-1/4 left-1/4"></div>
                </div>

                {/* Route Visualization */}
                <svg className="w-full h-full" viewBox="0 0 400 600">
                    {/* Road Path */}
                    <path 
                        d="M 200 80 Q 280 200 200 300 T 200 550" 
                        fill="none" 
                        stroke="white" 
                        strokeWidth="40" 
                        strokeLinecap="round"
                        className="drop-shadow-sm"
                    />
                    <path 
                        d="M 200 80 Q 280 200 200 300 T 200 550" 
                        fill="none" 
                        stroke="#CBD5E1" 
                        strokeWidth="24" 
                        strokeLinecap="round"
                        strokeDasharray="20 20"
                    />

                    {/* School Location */}
                    <g transform="translate(176, 30)">
                        <circle cx="24" cy="24" r="30" fill="#EEF2FF" />
                        <circle cx="24" cy="24" r="6" fill="#4F46E5" />
                        <circle cx="24" cy="24" r="24" fill="none" stroke="#4F46E5" strokeWidth="2" opacity="0.2" />
                    </g>
                    
                    {/* Student Location (Home) */}
                    <g transform="translate(176, 520)">
                        <circle cx="24" cy="24" r="30" fill="#FFF7ED" />
                        <circle cx="24" cy="24" r="24" fill="none" stroke="#F97316" strokeWidth="2" opacity="0.2" />
                        <MapPin x="12" y="12" size={24} className="text-orange-500" fill="currentColor" />
                    </g>

                    {/* The Moving Bus */}
                    <g 
                        style={{ 
                            transform: `translate(${pos.x - 24}px, ${pos.y - 24}px)`,
                            transition: 'transform 1s linear' 
                        }}
                    >
                        {/* Pulse Effect */}
                        <circle cx="24" cy="24" r="40" fill="#4F46E5" opacity="0.1" className="animate-ping" />
                        <circle cx="24" cy="24" r="28" fill="white" className="shadow-xl" />
                        <Bus x="12" y="12" size={24} className="text-indigo-600" />
                    </g>
                </svg>

                {/* AI Traffic Insight Overlay */}
                <div className="absolute bottom-40 left-6 right-6">
                    <div className="bg-white/80 backdrop-blur-md p-4 rounded-[24px] shadow-lg border border-white/50 animate-in slide-in-from-bottom fade-in duration-700">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles size={16} className="text-indigo-500 fill-indigo-100" />
                            <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wide">AI Traffic Insight</h4>
                        </div>
                        {isLoadingTraffic ? (
                            <div className="flex gap-2 items-center">
                                <div className="w-4 h-4 rounded-full border-2 border-slate-300 border-t-indigo-500 animate-spin"></div>
                                <span className="text-xs text-slate-500 font-medium">Analyzing map data around you...</span>
                            </div>
                        ) : (
                            <div>
                                <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
                                    {trafficInfo?.text || "Traffic looks clear along the route."}
                                </p>
                                {trafficInfo?.mapUri && (
                                    <a 
                                        href={trafficInfo.mapUri} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-bold text-blue-600 hover:underline bg-blue-50 px-3 py-2 rounded-xl border border-blue-100 transition-colors"
                                    >
                                        <ExternalLink size={12} />
                                        View Live Map on Google
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="absolute bottom-40 right-6 opacity-0 pointer-events-none">
                    <button className="w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-slate-600 hover:text-indigo-600 active:scale-90 transition-transform">
                        <Locate size={24} />
                    </button>
                </div>
            </div>

            {/* Bottom Sheet - Driver Info */}
            <div className="bg-white rounded-t-[40px] p-8 pb-10 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] relative z-20">
                <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8 opacity-60"></div>
                
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shadow-sm">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Driver" alt="Driver" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">Mr. John Doe</h3>
                            <p className="text-sm text-slate-400 font-medium">Bus No. 42 • Route B</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Speed</p>
                        <p className="text-xl font-bold text-indigo-600">45 <span className="text-sm text-slate-400 font-medium">km/h</span></p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button className="flex-1 bg-slate-50 text-slate-700 font-bold py-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-transform">
                        <Navigation size={20} />
                        View Route
                    </button>
                    <button className="flex-1 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 active:scale-95 transition-transform">
                        <Phone size={20} />
                        Call Driver
                    </button>
                </div>
            </div>
        </div>
    );
};