import React, { useState, useEffect } from 'react';
import { LogOut, Bell, Home, PieChart, Users, Calendar, Package, MoreHorizontal, ArrowUp, ArrowDown, Wallet, Fingerprint, RefreshCw, CheckCircle, Plus, Clock, Camera, User, Armchair, Monitor, FlaskConical, BookOpen, Zap, Globe, Microscope, Palette, FileText, X, Calculator, UserCog, Shield, Settings, Check, Lock, Filter, TrendingUp, TrendingDown, CreditCard, DollarSign, Download, MessageSquare, Send, Smartphone, AlertTriangle, History, CalendarX, ShieldCheck, Search, Star, ChevronRight } from 'lucide-react';
import { MOCK_COURSES } from '../constants';
import { CourseDetail } from './CourseDetail';
import { Course } from '../types';

interface AdminDashboardProps {
    onLogout: () => void;
}

type Tab = 'DASHBOARD' | 'COURSES' | 'FINANCE' | 'EXAMS' | 'STUDENTS' | 'INVENTORY' | 'ROLES' | 'MESSAGES';

interface Exam {
    id: string;
    subject: string;
    class: string;
    type: string;
    time: string;
    room: string;
    icon: any;
    colorFrom: string;
    colorTo: string;
    textColor: string;
    borderColor: string;
}

interface InventoryItem {
    id: string;
    name: string;
    category: 'Furniture' | 'Electronics' | 'Lab' | 'Stationery';
    quantity: number;
    status: 'In Stock' | 'Low Stock' | 'Out of Stock';
    location: string;
    icon: any;
    color: string;
    value: string;
}

// Permission Definition
type PermissionId = 'VIEW_DASHBOARD' | 'MANAGE_EXAMS' | 'PROCESS_FEES' | 'VIEW_FINANCE' | 'MARK_ATTENDANCE' | 'MANAGE_INVENTORY' | 'MANAGE_USERS';

interface PermissionDef {
    id: PermissionId;
    label: string;
    description: string;
}

const ALL_PERMISSIONS: PermissionDef[] = [
    { id: 'VIEW_DASHBOARD', label: 'View Dashboard', description: 'Access basic overview stats' },
    { id: 'MARK_ATTENDANCE', label: 'Mark Attendance', description: 'Modify student attendance records' },
    { id: 'MANAGE_EXAMS', label: 'Manage Exams', description: 'Create and edit exam schedules' },
    { id: 'PROCESS_FEES', label: 'Process Fees', description: 'View and update fee statuses' },
    { id: 'VIEW_FINANCE', label: 'View Finance', description: 'Access sensitive financial reports' },
    { id: 'MANAGE_INVENTORY', label: 'Manage Inventory', description: 'Add or remove assets' },
    { id: 'MANAGE_USERS', label: 'Manage Users', description: 'Assign roles and permissions' },
];

interface SystemUser {
    id: string;
    name: string;
    email: string;
    role: 'STUDENT' | 'TEACHER' | 'ADMIN';
    avatarSeed: string;
    permissions: PermissionId[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState<Tab>('DASHBOARD');
    const [biometricStatus, setBiometricStatus] = useState<'IDLE' | 'SYNCING' | 'COMPLETED'>('IDLE');
    const [biometricData, setBiometricData] = useState({
        lastSync: 'Today, 08:30 AM',
        records: 58,
        errors: 0
    });
    const [isCreateExamOpen, setIsCreateExamOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    
    // State to store student profile images (keyed by Student ID)
    const [studentImages, setStudentImages] = useState<Record<string, string>>({});

    // User Management State
    const [editingUser, setEditingUser] = useState<SystemUser | null>(null);

    // Messaging State
    const [messageContent, setMessageContent] = useState('');
    const [selectedAudience, setSelectedAudience] = useState('All Parents');
    const [messageChannel, setMessageChannel] = useState<'SMS' | 'WHATSAPP'>('SMS');
    const [isSendingMsg, setIsSendingMsg] = useState(false);
    const [msgHistory, setMsgHistory] = useState([
        { id: 1, text: 'School will be closed tomorrow due to heavy rain.', audience: 'All Parents', channel: 'SMS', date: 'Yesterday, 08:00 PM', status: 'Delivered' },
        { id: 2, text: 'PTM Meeting reminder for Class 10.', audience: 'Class 10', channel: 'WHATSAPP', date: 'Mar 10, 10:30 AM', status: 'Delivered' },
    ]);

    // Inventory State
    const [isAddInventoryOpen, setIsAddInventoryOpen] = useState(false);
    const [newInventoryItem, setNewInventoryItem] = useState<Partial<InventoryItem>>({
        name: '',
        category: 'Furniture',
        quantity: 0,
        status: 'In Stock',
        location: '',
        value: ''
    });

    const [users, setUsers] = useState<SystemUser[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('open5_admin_users');
            if (saved) return JSON.parse(saved);
        }
        return [
            { 
                id: 'u1', name: 'Dr. Sarah Wilson', email: 'sarah.w@cactus9.edu', role: 'TEACHER', avatarSeed: 'Sarah',
                permissions: ['VIEW_DASHBOARD', 'MARK_ATTENDANCE', 'MANAGE_EXAMS'] 
            },
            { 
                id: 'u2', name: 'James Cameron', email: 'james.c@cactus9.edu', role: 'ADMIN', avatarSeed: 'James',
                permissions: ['VIEW_DASHBOARD', 'MANAGE_USERS', 'VIEW_FINANCE', 'PROCESS_FEES', 'MANAGE_INVENTORY']
            },
            { 
                id: 'u3', name: 'Emily Blunt', email: 'emily.b@cactus9.edu', role: 'STUDENT', avatarSeed: 'Emily',
                permissions: ['VIEW_DASHBOARD']
            },
            { 
                id: 'u4', name: 'Michael Scott', email: 'm.scott@cactus9.edu', role: 'TEACHER', avatarSeed: 'Michael',
                permissions: ['VIEW_DASHBOARD', 'MARK_ATTENDANCE']
            },
            { 
                id: 'u5', name: 'Robert California', email: 'robert.c@cactus9.edu', role: 'ADMIN', avatarSeed: 'Robert',
                permissions: ['VIEW_DASHBOARD', 'MANAGE_USERS', 'VIEW_FINANCE', 'PROCESS_FEES', 'MANAGE_INVENTORY', 'MANAGE_EXAMS']
            },
        ];
    });

    // Mock Data
    const stats = [
        { label: 'Students', count: '5,909', color: 'from-amber-100 to-amber-50 text-amber-600', iconBg: 'bg-white text-amber-500', icon: Users, shadow: 'shadow-amber-200/40' },
        { label: 'Teachers', count: '60', color: 'from-blue-100 to-blue-50 text-[#5D8BF4]', iconBg: 'bg-white text-[#5D8BF4]', icon: Users, shadow: 'shadow-blue-200/40' },
        { label: 'Staff', count: '100', color: 'from-purple-100 to-purple-50 text-purple-600', iconBg: 'bg-white text-purple-500', icon: Users, shadow: 'shadow-purple-200/40' },
    ];

    const studentList = [
        { name: 'Sophia Wilson', id: '522bcs009', class: '12-A', type: 'Hosteller', fees: 'Paid' },
        { name: 'Nathan Offord', id: '522bcs010', class: '11-B', type: 'Day Scholar', fees: 'Pending' },
        { name: 'Emily Clark', id: '522bcs011', class: '10-A', type: 'Hosteller', fees: 'Overdue' },
        { name: 'Ryan Giggs', id: '522bcs012', class: '12-A', type: 'Day Scholar', fees: 'Paid' },
        { name: 'Sarah Jones', id: '522bcs013', class: '09-C', type: 'Hosteller', fees: 'Paid' },
    ];

    const [exams, setExams] = useState<Exam[]>(() => {
        return [
            { 
                id: '1', 
                subject: 'Mathematics', 
                class: '10-A', 
                type: 'Mid Term', 
                time: '09:00 AM - 12:00 PM', 
                room: 'Room 301', 
                icon: <Calculator size={28} />,
                colorFrom: 'from-orange-100',
                colorTo: 'to-orange-200',
                textColor: 'text-[#FF7F43]',
                borderColor: 'border-orange-50'
            },
            { 
                id: '2', 
                subject: 'Chemistry', 
                class: '12-B', 
                type: 'Practical', 
                time: '10:00 AM - 11:30 AM', 
                room: 'Lab 2', 
                icon: <FlaskConical size={28} />,
                colorFrom: 'from-emerald-100',
                colorTo: 'to-emerald-200',
                textColor: 'text-emerald-600',
                borderColor: 'border-emerald-50'
            },
            { 
                id: '3', 
                subject: 'English Lit', 
                class: '09-C', 
                type: 'Final', 
                time: '01:00 PM - 03:00 PM', 
                room: 'Hall A', 
                icon: <BookOpen size={28} />,
                colorFrom: 'from-pink-100',
                colorTo: 'to-pink-200',
                textColor: 'text-pink-600',
                borderColor: 'border-pink-50'
            },
            { 
                id: '4', 
                subject: 'Biology', 
                class: '11-A', 
                type: 'Lab', 
                time: '08:30 AM - 10:30 AM', 
                room: 'Bio Lab', 
                icon: <Microscope size={28} />,
                colorFrom: 'from-green-100',
                colorTo: 'to-green-200',
                textColor: 'text-green-600',
                borderColor: 'border-green-50'
            },
            { 
                id: '5', 
                subject: 'Physics', 
                class: '11-B', 
                type: 'Practical', 
                time: '11:00 AM - 01:00 PM', 
                room: 'Physics Lab', 
                icon: <Zap size={28} />,
                colorFrom: 'from-cyan-100',
                colorTo: 'to-cyan-200',
                textColor: 'text-cyan-600',
                borderColor: 'border-cyan-50'
            },
            { 
                id: '6', 
                subject: 'History', 
                class: '10-B', 
                type: 'Final', 
                time: '02:00 PM - 04:00 PM', 
                room: 'Hall B', 
                icon: <Globe size={28} />,
                colorFrom: 'from-indigo-100',
                colorTo: 'to-indigo-200',
                textColor: 'text-indigo-600',
                borderColor: 'border-indigo-50'
            },
            { 
                id: '7', 
                subject: 'Computer Sci', 
                class: '12-A', 
                type: 'Lab Exam', 
                time: '09:00 AM - 12:00 PM', 
                room: 'Comp Lab', 
                icon: <Monitor size={28} />,
                colorFrom: 'from-slate-200',
                colorTo: 'to-slate-300',
                textColor: 'text-slate-700',
                borderColor: 'border-slate-200'
            },
            { 
                id: '8', 
                subject: 'Art & Design', 
                class: '09-A', 
                type: 'Portfolio', 
                time: '09:00 AM - 12:00 PM', 
                room: 'Art Studio', 
                icon: <Palette size={28} />,
                colorFrom: 'from-purple-100',
                colorTo: 'to-purple-200',
                textColor: 'text-purple-600',
                borderColor: 'border-purple-50'
            },
        ];
    });

    const [newExam, setNewExam] = useState<Partial<Exam>>({
        subject: '',
        class: '',
        type: '',
        time: '',
        room: ''
    });

    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(() => {
        return [
            { 
                id: 'INV001', name: 'Student Desks', category: 'Furniture', quantity: 120, status: 'In Stock', location: 'Block A & B', 
                icon: Armchair, color: 'bg-amber-100 text-amber-600', value: '$12,000' 
            },
            { 
                id: 'INV002', name: 'Dell Monitors', category: 'Electronics', quantity: 45, status: 'In Stock', location: 'Computer Lab 1', 
                icon: Monitor, color: 'bg-blue-100 text-blue-600', value: '$9,500' 
            },
            { 
                id: 'INV003', name: 'Microscopes', category: 'Lab', quantity: 5, status: 'Low Stock', location: 'Biology Lab', 
                icon: FlaskConical, color: 'bg-emerald-100 text-emerald-600', value: '$2,500' 
            },
            { 
                id: 'INV004', name: 'Whiteboard Markers', category: 'Stationery', quantity: 0, status: 'Out of Stock', location: 'Store Room', 
                icon: Package, color: 'bg-slate-100 text-slate-600', value: '$0' 
            },
            { 
                id: 'INV005', name: 'Projectors', category: 'Electronics', quantity: 12, status: 'In Stock', location: 'Media Room', 
                icon: Monitor, color: 'bg-purple-100 text-purple-600', value: '$6,000' 
            }
        ];
    });

    // Effects for Persistence (Only Users for now as they are JSON safe)
    useEffect(() => {
        localStorage.setItem('open5_admin_users', JSON.stringify(users));
    }, [users]);

    // Handlers
    const handleBiometricSync = () => {
        setBiometricStatus('SYNCING');
        setTimeout(() => {
            setBiometricStatus('COMPLETED');
            // Simulate random errors
            const errors = Math.floor(Math.random() * 5); 
            setBiometricData({
                lastSync: 'Just now',
                records: 124,
                errors: errors
            });
            setTimeout(() => setBiometricStatus('IDLE'), 2000);
        }, 2000);
    };

    const handleImageUpload = (studentId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setStudentImages(prev => ({
                    ...prev,
                    [studentId]: reader.result as string
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddExam = () => {
        if (!newExam.subject || !newExam.class) return;
        // Logic to determine theme based on subject
        // ... (Simplified for this snippet)
        setIsCreateExamOpen(false);
    };

    const handleAddInventoryItem = () => {
        // ... Logic to add inventory
        setIsAddInventoryOpen(false);
    };

    const togglePermission = (userId: string, permId: PermissionId) => {
        setUsers(prev => prev.map(u => {
            if (u.id === userId) {
                const hasPerm = u.permissions.includes(permId);
                return {
                    ...u,
                    permissions: hasPerm 
                        ? u.permissions.filter(p => p !== permId)
                        : [...u.permissions, permId]
                };
            }
            return u;
        }));
    };

    const handleSendMessage = () => {
        if (!messageContent.trim()) return;
        setIsSendingMsg(true);
        setTimeout(() => {
            const newMsg = {
                id: Date.now(),
                text: messageContent,
                audience: selectedAudience,
                channel: messageChannel,
                date: 'Just now',
                status: 'Delivered'
            };
            setMsgHistory([newMsg, ...msgHistory]);
            setMessageContent('');
            setIsSendingMsg(false);
        }, 1500);
    };

    const renderCourses = () => (
        <div className="space-y-6 pb-24">
            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-50 text-center">
                 <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-pink-600 shadow-sm rotate-3">
                     <BookOpen size={32} />
                 </div>
                 <h3 className="font-bold text-slate-800 text-lg">Course Management</h3>
                 <p className="text-slate-400 text-xs mt-1 max-w-[250px] mx-auto">Manage curriculum, syllabus and assign teachers to courses.</p>
             </div>
    
             <div className="flex justify-between items-center px-1">
                 <h3 className="font-bold text-slate-800 text-lg">All Courses</h3>
                 <button 
                    className="bg-[#FF7F43] hover:bg-[#ff8f5a] text-white p-3 rounded-2xl shadow-lg shadow-orange-200/50 active:scale-90 transition-transform"
                 >
                     <Plus size={20} strokeWidth={3} />
                 </button>
             </div>
    
             <div className="space-y-4">
                 {MOCK_COURSES.map((course) => (
                     <div 
                        key={course.id} 
                        onClick={() => setSelectedCourse(course)}
                        className="bg-white p-5 rounded-[28px] shadow-sm border border-slate-50 hover:shadow-md transition-all group active:scale-[0.98] cursor-pointer"
                     >
                         <div className="flex items-center gap-4">
                             <div className={`w-14 h-14 rounded-[22px] bg-gradient-to-br ${course.colorFrom} ${course.colorTo} flex items-center justify-center text-2xl shadow-inner ring-4 ring-white group-hover:scale-110 transition-transform`}>
                                 {course.icon}
                             </div>
                             <div className="flex-1">
                                 <h4 className="font-bold text-slate-800 text-base">{course.title}</h4>
                                 <p className="text-xs text-slate-400 font-medium line-clamp-1">{course.description}</p>
                                 <div className="flex items-center gap-3 mt-2">
                                    <span className="text-[10px] font-bold bg-slate-50 text-slate-500 px-2 py-0.5 rounded-md border border-slate-100 flex items-center gap-1">
                                        <Star size={10} className="fill-slate-400 text-slate-400"/> {course.rating}
                                    </span>
                                    <span className="text-[10px] font-bold bg-slate-50 text-slate-500 px-2 py-0.5 rounded-md border border-slate-100">
                                        {course.syllabus.length} Topics
                                    </span>
                                 </div>
                             </div>
                             <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                <ChevronRight size={18} />
                             </div>
                         </div>
                     </div>
                 ))}
             </div>
        </div>
    );

    // Render Helpers
    const renderDashboard = () => (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, idx) => (
                    <div key={idx} className={`rounded-[32px] p-5 bg-gradient-to-br ${stat.color} shadow-lg ${stat.shadow} relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300`}>
                        <div className="relative z-10">
                            <div className={`w-10 h-10 ${stat.iconBg} rounded-2xl flex items-center justify-center shadow-sm mb-3 group-hover:rotate-12 transition-transform duration-300`}>
                                <stat.icon size={20} />
                            </div>
                            <h3 className="text-3xl font-bold tracking-tight mb-1">{stat.count}</h3>
                            <p className="text-xs font-bold uppercase tracking-wide opacity-80">{stat.label}</p>
                        </div>
                    </div>
                ))}
                {/* Biometric Widget */}
                <div className="rounded-[32px] p-5 bg-white border border-slate-100 shadow-lg shadow-blue-100/50 flex flex-col justify-between relative overflow-hidden">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Attendance</p>
                            <h3 className="text-lg font-bold text-slate-800">Biometric Sync</h3>
                        </div>
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm transition-colors ${biometricStatus === 'SYNCING' ? 'bg-orange-100 text-orange-600 animate-pulse' : 'bg-emerald-50 text-emerald-600'}`}>
                            <Fingerprint size={24} />
                        </div>
                    </div>
                    
                    {/* Log Panel */}
                    <div className="bg-slate-50 rounded-xl p-3 mb-3 border border-slate-100">
                        <div className="grid grid-cols-3 gap-2 text-center divide-x divide-slate-200">
                            <div>
                                <p className="text-[9px] text-slate-400 font-bold uppercase">Last Sync</p>
                                <p className="text-[10px] font-bold text-slate-700 mt-1">{biometricData.lastSync}</p>
                            </div>
                            <div>
                                <p className="text-[9px] text-slate-400 font-bold uppercase">Records</p>
                                <p className="text-[10px] font-bold text-indigo-600 mt-1">{biometricData.records}</p>
                            </div>
                            <div>
                                <p className="text-[9px] text-slate-400 font-bold uppercase">Errors</p>
                                <div className={`flex items-center justify-center gap-1 mt-1 ${biometricData.errors > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                                    {biometricData.errors > 0 && <AlertTriangle size={10} />}
                                    <p className="text-[10px] font-bold">{biometricData.errors}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleBiometricSync}
                        disabled={biometricStatus === 'SYNCING'}
                        className="w-full py-3 bg-[#5D8BF4] hover:bg-[#4F46E5] text-white rounded-xl text-xs font-bold shadow-md shadow-blue-200 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        {biometricStatus === 'SYNCING' ? (
                            <>
                                <RefreshCw size={14} className="animate-spin" />
                                Syncing Devices...
                            </>
                        ) : biometricStatus === 'COMPLETED' ? (
                            <>
                                <CheckCircle size={14} />
                                Sync Complete
                            </>
                        ) : (
                            <>
                                <RefreshCw size={14} />
                                Sync Now
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Financial Overview Card */}
            <div className="bg-gradient-to-r from-[#5D8BF4] to-[#8FAEFF] rounded-[32px] p-6 text-white shadow-xl shadow-blue-200/50 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl transform translate-x-10 -translate-y-10"></div>
                 
                 <div className="relative z-10">
                     <div className="flex justify-between items-center mb-6">
                         <h3 className="font-bold text-lg flex items-center gap-2">
                             <Wallet size={20} className="text-blue-100" />
                             Financial Overview
                         </h3>
                         <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold backdrop-blur-md border border-white/10">This Month</span>
                     </div>
                     
                     <div className="flex gap-4">
                         <div className="flex-1 bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/20 transition-colors">
                             <div className="flex items-center gap-2 mb-2 text-blue-100">
                                 <ArrowUp size={16} />
                                 <span className="text-xs font-bold uppercase">Income</span>
                             </div>
                             <p className="text-2xl font-bold tracking-tight">$29.5k</p>
                         </div>
                         <div className="flex-1 bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/20 transition-colors">
                             <div className="flex items-center gap-2 mb-2 text-orange-100">
                                 <ArrowDown size={16} />
                                 <span className="text-xs font-bold uppercase">Expense</span>
                             </div>
                             <p className="text-2xl font-bold tracking-tight">$19.2k</p>
                         </div>
                     </div>
                 </div>
            </div>
            
            {/* Earnings Graph Visualization */}
            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-50">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800">Earnings</h3>
                    <MoreHorizontal size={20} className="text-slate-400" />
                </div>
                {/* SVG Chart */}
                <div className="h-40 w-full relative">
                    <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
                        {/* Grid Lines */}
                        <line x1="0" y1="25" x2="300" y2="25" stroke="#f1f5f9" strokeWidth="1" />
                        <line x1="0" y1="50" x2="300" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                        <line x1="0" y1="75" x2="300" y2="75" stroke="#f1f5f9" strokeWidth="1" />
                        
                        {/* The Curve */}
                        <path 
                            d="M0,80 C50,80 70,30 120,40 C170,50 190,20 240,30 C270,35 290,10 300,5" 
                            fill="none" 
                            stroke="#5D8BF4" 
                            strokeWidth="3" 
                            strokeLinecap="round"
                        />
                        {/* Area Gradient */}
                        <path 
                            d="M0,80 C50,80 70,30 120,40 C170,50 190,20 240,30 C270,35 290,10 300,5 V 100 H 0 Z" 
                            fill="url(#chartGradient)" 
                            opacity="0.2"
                        />
                        <defs>
                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#5D8BF4" />
                                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        {/* Data Points */}
                        <circle cx="120" cy="40" r="4" fill="#5D8BF4" stroke="white" strokeWidth="2" />
                        <circle cx="240" cy="30" r="4" fill="#FF7F43" stroke="white" strokeWidth="2" />
                        
                        {/* Tooltip Simulation */}
                        <g transform="translate(190, 0)">
                             <rect x="0" y="0" width="80" height="30" rx="8" fill="white" filter="url(#shadow)" />
                             <text x="40" y="19" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#334155">$14,230</text>
                        </g>
                        <defs>
                            <filter id="shadow" x="-10" y="-10" width="100" height="60">
                                <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.1" />
                            </filter>
                        </defs>
                    </svg>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-400 mt-2 uppercase tracking-wide">
                    <span>Jan</span>
                    <span>Mar</span>
                    <span>May</span>
                    <span>Jul</span>
                    <span>Sep</span>
                    <span>Nov</span>
                </div>
            </div>
        </div>
    );

    const renderStudents = () => (
        <div className="space-y-4">
            <div className="flex items-center gap-2 bg-white p-3 rounded-2xl shadow-sm border border-slate-50">
                <Search size={20} className="text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search students..." 
                    className="flex-1 bg-transparent text-sm font-medium focus:outline-none placeholder:text-slate-300"
                />
            </div>

            <div className="space-y-3 pb-20">
                {studentList.map((student, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-[24px] shadow-sm border border-slate-50 flex items-center justify-between group active:scale-[0.98] transition-all">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-14 h-14 bg-slate-100 rounded-[20px] overflow-hidden flex items-center justify-center border border-slate-100">
                                    {studentImages[student.id] ? (
                                        <img src={studentImages[student.id]} alt={student.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={24} className="text-slate-300" />
                                    )}
                                </div>
                                <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center cursor-pointer hover:bg-slate-50 active:scale-90 transition-transform">
                                    <Camera size={14} className="text-[#5D8BF4]" />
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(student.id, e)}
                                    />
                                </label>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">{student.name}</h4>
                                <p className="text-xs text-slate-400 font-medium">Class {student.class}</p>
                                <span className="inline-block px-2 py-0.5 rounded-md bg-slate-50 text-[10px] font-bold text-slate-500 mt-1 border border-slate-100">
                                    {student.type}
                                </span>
                            </div>
                        </div>
                        <div className={`px-3 py-1.5 rounded-xl text-[10px] font-bold ${
                            student.fees === 'Paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                            student.fees === 'Pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                            'bg-red-50 text-red-600 border border-red-100'
                        }`}>
                            {student.fees}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
    
    const renderInventory = () => (
        <div className="space-y-6 pb-20">
            {/* Inventory Stats */}
            <div className="bg-gradient-to-br from-[#5D8BF4] to-[#8FAEFF] rounded-[32px] p-6 text-white shadow-xl shadow-blue-200/50 relative overflow-hidden">
                <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-white opacity-10 rounded-full blur-3xl"></div>
                <div className="relative z-10 flex justify-between items-end">
                    <div>
                        <p className="text-xs font-bold text-blue-100 uppercase tracking-wider mb-1">Total Assets</p>
                        <h2 className="text-3xl font-bold">$128,500</h2>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-lg border border-white/10">
                        <Package size={24} />
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-lg">Inventory Items</h3>
                <button 
                    onClick={() => setIsAddInventoryOpen(true)}
                    className="bg-[#FF7F43] hover:bg-[#ff8f5a] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-orange-200/50 active:scale-95 transition-all flex items-center gap-2"
                >
                    <Plus size={16} strokeWidth={3} />
                    Add New
                </button>
            </div>

            <div className="space-y-4">
                {inventoryItems.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-[28px] shadow-sm border border-slate-50 flex items-center gap-4 group hover:shadow-md transition-all duration-300">
                        <div className={`w-14 h-14 rounded-[20px] ${item.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                            <item.icon size={24} />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] text-slate-500 font-bold bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">{item.location}</span>
                                <span className="text-[10px] text-slate-400 font-medium">• {item.quantity} units</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <span className="font-bold text-slate-800 text-sm">{item.value}</span>
                            <span className={`text-[9px] font-bold px-2 py-1 rounded-full ${
                                item.status === 'In Stock' ? 'bg-emerald-50 text-emerald-600' :
                                item.status === 'Low Stock' ? 'bg-amber-50 text-amber-600' :
                                'bg-red-50 text-red-600'
                            }`}>
                                {item.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderExams = () => (
        <div className="space-y-6 pb-24">
             {/* Calendar Strip */}
             <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4">
                 {[14, 15, 16, 17, 18, 19, 20].map((date, idx) => (
                     <div key={idx} className={`min-w-[60px] h-[80px] rounded-[24px] flex flex-col items-center justify-center gap-1 transition-all duration-300 ${idx === 2 ? 'bg-[#5D8BF4] text-white shadow-lg shadow-blue-200/50 scale-105 ring-4 ring-blue-50' : 'bg-white text-slate-400 border border-slate-100'}`}>
                         <span className="text-[10px] font-bold uppercase tracking-wider">{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][idx]}</span>
                         <span className="text-xl font-bold">{date}</span>
                         {idx === 2 && <div className="w-1 h-1 bg-white rounded-full mt-1"></div>}
                     </div>
                 ))}
             </div>

             <div className="flex justify-between items-center px-1">
                 <h3 className="font-bold text-slate-800 text-lg">Upcoming Exams</h3>
                 <button 
                    onClick={() => setIsCreateExamOpen(true)}
                    className="bg-[#FF7F43] hover:bg-[#ff8f5a] text-white p-3 rounded-2xl shadow-lg shadow-orange-200/50 active:scale-90 transition-transform"
                 >
                     <Plus size={20} strokeWidth={3} />
                 </button>
             </div>

             {exams.length === 0 ? (
                 <div className="bg-white border-2 border-dashed border-slate-200 rounded-[32px] p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-indigo-50 rounded-[24px] flex items-center justify-center text-indigo-300 mb-4 shadow-sm transform -rotate-3">
                        <CalendarX size={32} />
                    </div>
                    <h4 className="text-slate-600 font-bold text-lg">No exams scheduled</h4>
                    <p className="text-slate-400 text-sm mt-1 max-w-[200px] leading-relaxed">The calendar is clear. Tap "+" to schedule a new exam.</p>
                 </div>
             ) : (
                <div className="space-y-4">
                    {exams.map((exam) => (
                        <div key={exam.id} className="bg-white p-5 rounded-[32px] shadow-sm hover:shadow-md transition-all duration-300 border border-slate-50 group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-[22px] bg-gradient-to-br ${exam.colorFrom} ${exam.colorTo} flex items-center justify-center ${exam.textColor} shadow-inner ring-4 ring-white`}>
                                        {exam.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-base">{exam.subject}</h4>
                                        <p className="text-xs text-slate-400 font-medium">{exam.class} • {exam.type}</p>
                                    </div>
                                </div>
                                <div className={`px-3 py-1.5 rounded-xl border ${exam.borderColor} bg-white flex items-center gap-1.5`}>
                                    <Clock size={12} className={exam.textColor} />
                                    <span className={`text-[10px] font-bold ${exam.textColor}`}>{exam.time.split(' - ')[0]}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 pl-[72px]">
                                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                    <Users size={12} className="text-slate-400" />
                                    <span className="text-[10px] font-bold text-slate-600">{exam.room}</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                    <Calendar size={12} className="text-slate-400" />
                                    <span className="text-[10px] font-bold text-slate-600">May 16, 2024</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
             )}
        </div>
    );

    const renderMessages = () => (
        <div className="space-y-6 pb-24">
            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-50">
                <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                    <MessageSquare size={20} className="text-[#5D8BF4]" />
                    New Broadcast
                </h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1 mb-1.5 block">Audience</label>
                        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                            {['All Parents', 'Class 10', 'Class 12', 'Teachers'].map(aud => (
                                <button 
                                    key={aud}
                                    onClick={() => setSelectedAudience(aud)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${selectedAudience === aud ? 'bg-slate-800 text-white border-slate-800 shadow-lg shadow-slate-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                                >
                                    {aud}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => setMessageChannel('SMS')}
                            className={`p-4 rounded-2xl border transition-all flex items-center justify-center gap-2 ${messageChannel === 'SMS' ? 'border-[#5D8BF4] bg-blue-50 text-[#5D8BF4] font-bold' : 'border-slate-100 text-slate-400 font-medium'}`}
                        >
                            <Smartphone size={18} /> SMS
                        </button>
                        <button 
                            onClick={() => setMessageChannel('WHATSAPP')}
                            className={`p-4 rounded-2xl border transition-all flex items-center justify-center gap-2 ${messageChannel === 'WHATSAPP' ? 'border-emerald-500 bg-emerald-50 text-emerald-600 font-bold' : 'border-slate-100 text-slate-400 font-medium'}`}
                        >
                            <MessageSquare size={18} /> WhatsApp
                        </button>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1 mb-1.5 block">Message</label>
                        <textarea 
                            value={messageContent}
                            onChange={(e) => setMessageContent(e.target.value)}
                            placeholder="Type your alert here..."
                            className="w-full h-32 bg-slate-50 border border-slate-200 rounded-[20px] p-4 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#5D8BF4]/20 focus:border-[#5D8BF4] resize-none"
                        />
                    </div>

                    <button 
                        onClick={handleSendMessage}
                        disabled={!messageContent.trim() || isSendingMsg}
                        className="w-full bg-[#5D8BF4] hover:bg-[#4F46E5] text-white py-4 rounded-[24px] font-bold shadow-xl shadow-blue-200/50 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        {isSendingMsg ? 'Sending...' : (
                            <>
                                Send Alert <Send size={18} />
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="font-bold text-slate-500 text-sm px-2 flex items-center gap-2">
                    <History size={14} /> Recent Broadcasts
                </h3>
                {msgHistory.map(msg => (
                    <div key={msg.id} className="bg-white p-4 rounded-[24px] shadow-sm border border-slate-50">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-md">{msg.audience}</span>
                            <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1"><CheckCircle size={10} /> {msg.status}</span>
                        </div>
                        <p className="text-sm font-medium text-slate-700 leading-relaxed mb-2">{msg.text}</p>
                        <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                            <span>{msg.channel}</span>
                            <span>{msg.date}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderFinance = () => (
        <div className="space-y-6 pb-24">
             {/* Summary Cards */}
             <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white p-5 rounded-[28px] shadow-sm border border-slate-50 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                     <div className="relative z-10">
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 mb-3 border border-emerald-100">
                            <ArrowUp size={20} />
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total Revenue</p>
                        <h3 className="text-2xl font-bold text-slate-800 mt-1">$124.5k</h3>
                        <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md mt-2 inline-flex items-center gap-1">
                            <TrendingUp size={10} /> +12% vs last month
                        </span>
                     </div>
                 </div>
                 <div className="bg-white p-5 rounded-[28px] shadow-sm border border-slate-50 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-20 h-20 bg-orange-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                     <div className="relative z-10">
                        <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 mb-3 border border-orange-100">
                            <ArrowDown size={20} />
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Expenses</p>
                        <h3 className="text-2xl font-bold text-slate-800 mt-1">$45.2k</h3>
                        <span className="text-[10px] text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded-md mt-2 inline-flex items-center gap-1">
                            <TrendingDown size={10} /> +5% vs last month
                        </span>
                     </div>
                 </div>
             </div>

             {/* Recent Transactions List */}
             <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-50">
                 <div className="flex justify-between items-center mb-6">
                     <h3 className="font-bold text-slate-800 text-lg">Transactions</h3>
                     <button className="text-xs font-bold text-[#5D8BF4] hover:underline">View All</button>
                 </div>
                 
                 <div className="space-y-2">
                     {[
                         { id: 1, title: 'School Fees - Class 10', date: 'Today, 10:30 AM', amount: '+$2,400', type: 'INCOME' },
                         { id: 2, title: 'Lab Equipment Purchase', date: 'Yesterday, 02:15 PM', amount: '-$850', type: 'EXPENSE' },
                         { id: 3, title: 'Staff Salary Disbursement', date: 'Feb 28, 2024', amount: '-$12,500', type: 'EXPENSE' },
                         { id: 4, title: 'Bus Maintenance', date: 'Feb 25, 2024', amount: '-$320', type: 'EXPENSE' },
                         { id: 5, title: 'School Fees - Class 12', date: 'Feb 24, 2024', amount: '+$1,800', type: 'INCOME' },
                     ].map((tx) => (
                         <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer">
                             <div className="flex items-center gap-4">
                                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tx.type === 'INCOME' ? 'bg-emerald-50 text-emerald-500' : 'bg-orange-50 text-orange-500'}`}>
                                     {tx.type === 'INCOME' ? <ArrowUp size={20} /> : <ArrowDown size={20} />}
                                 </div>
                                 <div>
                                     <h4 className="font-bold text-slate-800 text-sm">{tx.title}</h4>
                                     <p className="text-[10px] text-slate-400 font-medium">{tx.date}</p>
                                 </div>
                             </div>
                             <span className={`font-bold text-sm ${tx.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-800'}`}>{tx.amount}</span>
                         </div>
                     ))}
                 </div>
             </div>
        </div>
    );

    const renderRoles = () => (
        <div className="space-y-6 pb-24">
             <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[32px] p-6 text-white shadow-xl shadow-indigo-200/50 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl transform translate-x-8 -translate-y-8"></div>
                 <div className="relative z-10">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 border border-white/10">
                        <UserCog size={24} className="text-white" />
                    </div>
                    <h3 className="font-bold text-xl mb-1">User Management</h3>
                    <p className="text-indigo-100 text-sm opacity-90 max-w-[240px] leading-relaxed">Control access levels and permissions for staff and students.</p>
                 </div>
             </div>

             <div className="flex justify-between items-center px-1">
                 <h3 className="font-bold text-slate-800 text-lg">System Users</h3>
                 <button className="bg-[#5D8BF4] text-white p-2.5 rounded-xl shadow-lg shadow-blue-200/50 active:scale-95 transition-transform">
                     <Plus size={20} />
                 </button>
             </div>

             <div className="space-y-4">
                 {users.map((user) => (
                     <div key={user.id} className="bg-white p-4 rounded-[24px] shadow-sm border border-slate-50 flex items-center justify-between group hover:shadow-md transition-all duration-300">
                         <div className="flex items-center gap-4">
                             <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center text-xl font-bold text-white shadow-sm ${
                                 user.role === 'ADMIN' ? 'bg-purple-500' :
                                 user.role === 'TEACHER' ? 'bg-orange-500' : 'bg-blue-500'
                             }`}>
                                 {user.name.charAt(0)}
                             </div>
                             <div>
                                 <h4 className="font-bold text-slate-800 text-sm">{user.name}</h4>
                                 <p className="text-xs text-slate-400 font-medium mb-1.5">{user.email}</p>
                                 <div className="flex flex-wrap gap-2">
                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${
                                        user.role === 'ADMIN' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                        user.role === 'TEACHER' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                        'bg-blue-50 text-blue-600 border-blue-100'
                                    }`}>
                                        {user.role}
                                    </span>
                                    <span className="text-[9px] text-slate-400 font-bold bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                                        {user.permissions.length} Permissions
                                    </span>
                                 </div>
                             </div>
                         </div>
                         <button 
                            onClick={() => setEditingUser(user)}
                            className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 hover:text-[#5D8BF4] hover:bg-blue-50 flex items-center justify-center transition-colors"
                         >
                             <Settings size={20} />
                         </button>
                     </div>
                 ))}
             </div>
        </div>
    );

    if (selectedCourse) {
        return <CourseDetail course={selectedCourse} onBack={() => setSelectedCourse(null)} />;
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans relative overflow-hidden">
            {/* Header */}
            <div className="px-6 pt-12 pb-6 flex justify-between items-center bg-white shadow-sm rounded-b-[32px] z-10 border-b border-slate-100">
                <div>
                    <h2 className="text-slate-400 text-sm font-medium">Administrator</h2>
                    <h1 className="text-slate-900 text-2xl font-bold mt-1">Dashboard</h1>
                </div>
                <div className="flex gap-2">
                    <button onClick={onLogout} className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors border border-slate-100">
                        <LogOut size={20} />
                    </button>
                    <button className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-[#5D8BF4] transition-colors border border-slate-100 relative">
                        <Bell size={20} />
                        <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 no-scrollbar">
                {activeTab === 'DASHBOARD' && renderDashboard()}
                {activeTab === 'COURSES' && renderCourses()}
                {activeTab === 'FINANCE' && renderFinance()}
                {activeTab === 'EXAMS' && renderExams()}
                {activeTab === 'STUDENTS' && renderStudents()}
                {activeTab === 'INVENTORY' && renderInventory()}
                {activeTab === 'ROLES' && renderRoles()}
                {activeTab === 'MESSAGES' && renderMessages()}
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl py-3 px-4 rounded-t-[30px] shadow-[0_-5px_30px_-5px_rgba(0,0,0,0.05)] border-t border-slate-100 z-40">
                <div className="flex items-center justify-between overflow-x-auto no-scrollbar gap-2 px-2">
                    {[
                        { id: 'DASHBOARD', icon: Home, label: 'Home' },
                        { id: 'COURSES', icon: BookOpen, label: 'Courses' },
                        { id: 'FINANCE', icon: PieChart, label: 'Finance' },
                        { id: 'EXAMS', icon: Calendar, label: 'Exams' },
                        { id: 'STUDENTS', icon: Users, label: 'Students' },
                        { id: 'INVENTORY', icon: Package, label: 'Inv.' },
                        { id: 'ROLES', icon: UserCog, label: 'Roles' },
                        { id: 'MESSAGES', icon: MessageSquare, label: 'Msg' },
                    ].map((item) => (
                        <button 
                            key={item.id}
                            onClick={() => setActiveTab(item.id as Tab)}
                            className={`flex flex-col items-center gap-1 min-w-[60px] p-2 rounded-2xl transition-all duration-300 ${activeTab === item.id ? 'text-[#5D8BF4]' : 'text-slate-300 hover:text-slate-400'}`}
                        >
                            <div className={`p-1.5 rounded-xl transition-all ${activeTab === item.id ? 'bg-blue-50 scale-110 shadow-sm' : 'bg-transparent'}`}>
                                <item.icon size={22} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                            </div>
                            {activeTab === item.id && (
                                <span className="text-[9px] font-bold animate-in fade-in slide-in-from-bottom-2">{item.label}</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Permission Modal (Bottom Sheet) */}
            {editingUser && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-white w-full sm:max-w-md max-h-[85vh] overflow-y-auto rounded-t-[40px] sm:rounded-[40px] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 pb-10">
                        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 opacity-60"></div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-slate-100 rounded-[20px] flex items-center justify-center text-2xl font-bold shadow-inner">
                                {editingUser.name.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">{editingUser.name}</h2>
                                <div className="flex gap-2 mt-1">
                                    {['STUDENT', 'TEACHER', 'ADMIN'].map(role => (
                                        <button 
                                            key={role}
                                            onClick={() => setEditingUser({...editingUser, role: role as any})}
                                            className={`text-[9px] font-bold px-2 py-1 rounded-md border transition-colors ${editingUser.role === role ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                                        >
                                            {role}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-1 mb-6">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Permissions</h3>
                            {ALL_PERMISSIONS.map(perm => (
                                <div 
                                    key={perm.id}
                                    onClick={() => togglePermission(editingUser.id, perm.id)}
                                    className={`p-4 rounded-2xl border flex items-start gap-3 transition-all cursor-pointer active:scale-[0.99] ${editingUser.permissions.includes(perm.id) ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-slate-100'}`}
                                >
                                    <div className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${editingUser.permissions.includes(perm.id) ? 'bg-[#5D8BF4] border-[#5D8BF4]' : 'bg-white border-slate-300'}`}>
                                        {editingUser.permissions.includes(perm.id) && <Check size={12} className="text-white" />}
                                    </div>
                                    <div>
                                        <h4 className={`text-sm font-bold ${editingUser.permissions.includes(perm.id) ? 'text-slate-800' : 'text-slate-500'}`}>{perm.label}</h4>
                                        <p className="text-xs text-slate-400 leading-tight mt-0.5">{perm.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button 
                            onClick={() => {
                                // Save logic here (e.g. update users state)
                                // For now, we update local state which persists to users state via toggle
                                setEditingUser(null);
                            }}
                            className="w-full bg-slate-800 text-white font-bold py-4 rounded-[24px] shadow-xl active:scale-95 transition-transform"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};