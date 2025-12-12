import React, { useState, useEffect } from 'react';
import { Welcome } from './components/Welcome';
import { Login } from './components/Login';
import { RoleSelection } from './components/RoleSelection';
import { Home } from './components/Home';
import { TeacherDashboard } from './components/TeacherDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { CourseDetail } from './components/CourseDetail';
import { ScreenState, Course } from './types';
import { MOCK_COURSES } from './constants';

const App: React.FC = () => {
    const [screen, setScreen] = useState<ScreenState>(() => {
        try {
            if (typeof window !== 'undefined') {
                const savedScreen = localStorage.getItem('open5_screen');
                if (savedScreen) {
                    const parsed = parseInt(savedScreen);
                    if (!isNaN(parsed)) {
                         // Fallback for detail view refresh to prevent stuck states
                        if (parsed === ScreenState.STUDENT_DETAILS) return ScreenState.STUDENT_HOME;
                        return parsed;
                    }
                }
            }
        } catch (e) { console.error(e); }
        return ScreenState.WELCOME;
    });

    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    // Persistence Effects
    useEffect(() => {
        try {
            localStorage.setItem('open5_screen', screen.toString());
        } catch (e) {}
    }, [screen]);

    const handleLogout = () => {
        setScreen(ScreenState.WELCOME);
        setSelectedCourse(null);
    };

    // Routing Logic
    const renderScreen = () => {
        switch (screen) {
            case ScreenState.WELCOME:
                return <Welcome onLogin={() => setScreen(ScreenState.LOGIN)} onSignUp={() => setScreen(ScreenState.LOGIN)} />;
            case ScreenState.LOGIN:
                return <Login 
                    onSuccess={() => setScreen(ScreenState.ROLE_SELECTION)} 
                    onStudentLogin={() => setScreen(ScreenState.STUDENT_HOME)}
                    onBack={() => setScreen(ScreenState.WELCOME)} 
                />;
            case ScreenState.ROLE_SELECTION:
                return <RoleSelection onSelectRole={(role) => {
                    if (role === 'STUDENT') setScreen(ScreenState.STUDENT_HOME);
                    if (role === 'TEACHER') setScreen(ScreenState.TEACHER_DASHBOARD);
                    if (role === 'ADMIN') setScreen(ScreenState.ADMIN_DASHBOARD);
                }} />;
            case ScreenState.STUDENT_HOME:
                return <Home courses={MOCK_COURSES} onSelectCourse={(c) => { setSelectedCourse(c); setScreen(ScreenState.STUDENT_DETAILS); }} onLogout={handleLogout} />;
            case ScreenState.STUDENT_DETAILS:
                return selectedCourse ? <CourseDetail course={selectedCourse} onBack={() => { setSelectedCourse(null); setScreen(ScreenState.STUDENT_HOME); }} /> : <Home courses={MOCK_COURSES} onSelectCourse={(c) => { setSelectedCourse(c); setScreen(ScreenState.STUDENT_DETAILS); }} onLogout={handleLogout} />;
            case ScreenState.TEACHER_DASHBOARD:
                return <TeacherDashboard onLogout={handleLogout} />;
            case ScreenState.ADMIN_DASHBOARD:
                return <AdminDashboard onLogout={handleLogout} />;
            default:
                return <RoleSelection onSelectRole={(role) => setScreen(ScreenState.STUDENT_HOME)} />;
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[100dvh] bg-slate-200 font-sans p-0 sm:p-4 md:p-8">
            {/* Main App Container - Simulates a High-End Mobile Device Frame */}
            <div className="w-full h-[100dvh] sm:h-[844px] sm:max-w-[390px] md:max-w-[420px] bg-slate-50 sm:rounded-[40px] shadow-2xl overflow-hidden relative border-[8px] border-slate-900/5 sm:border-slate-900 ring-1 ring-slate-900/5 flex flex-col">
                {renderScreen()}
            </div>
        </div>
    );
};

export default App;