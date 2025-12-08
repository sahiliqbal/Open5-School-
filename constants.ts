
import { Course, FeeInvoice, AttendanceStudent, TeacherSalary } from "./types";

export const MOCK_COURSES: Course[] = [
    {
        id: '1',
        title: 'Mathematics',
        price: 10,
        rating: 4.9,
        reviews: 689,
        colorFrom: 'from-orange-400',
        colorTo: 'to-red-400',
        icon: '📐',
        description: 'Master algebra, calculus, and geometry fundamentals.',
        syllabus: [
            { id: '1', title: 'Order of Operations', duration: '16:56 min', isLocked: false },
            { id: '2', title: 'Sine, Cosine, Tangent', duration: '24:36 min', isLocked: false },
            { id: '3', title: 'Introduction to Algebra', duration: '45:10 min', isLocked: true },
            { id: '4', title: 'Quadratic Equations', duration: '32:05 min', isLocked: true },
            { id: '5', title: 'Calculus Basics', duration: '55:00 min', isLocked: true },
        ]
    },
    {
        id: '2',
        title: 'Chemistry',
        price: 14,
        rating: 4.8,
        reviews: 464,
        colorFrom: 'from-green-400',
        colorTo: 'to-emerald-600',
        icon: '🧪',
        description: 'Explore the periodic table and organic chemistry.',
        syllabus: [
            { id: '1', title: 'Atomic Structure', duration: '20:00 min', isLocked: false },
            { id: '2', title: 'Periodic Table', duration: '35:20 min', isLocked: false },
            { id: '3', title: 'Chemical Bonding', duration: '40:15 min', isLocked: true },
        ]
    },
    {
        id: '3',
        title: 'Biology',
        price: 16,
        rating: 4.7,
        reviews: 320,
        colorFrom: 'from-blue-400',
        colorTo: 'to-indigo-600',
        icon: '🧬',
        description: 'Understand the building blocks of life.',
        syllabus: [
            { id: '1', title: 'Cell Theory', duration: '18:30 min', isLocked: false },
            { id: '2', title: 'Genetics', duration: '42:10 min', isLocked: true },
        ]
    },
    {
        id: '4',
        title: 'Language',
        price: 16,
        rating: 4.9,
        reviews: 890,
        colorFrom: 'from-sky-400',
        colorTo: 'to-blue-500',
        icon: '文',
        description: 'Learn new languages and grammar rules.',
        syllabus: [
            { id: '1', title: 'Grammar Basics', duration: '15:00 min', isLocked: false },
            { id: '2', title: 'Vocabulary Builder', duration: '25:00 min', isLocked: false },
        ]
    }
];

export const MOCK_FEES: FeeInvoice[] = [
    { id: 'INV-001', month: 'February 2024', amount: 1200, status: 'PENDING', dueDate: '2024-02-28' },
    { id: 'INV-002', month: 'January 2024', amount: 1200, status: 'PAID', dueDate: '2024-01-31' },
];

export const MOCK_ATTENDANCE: AttendanceStudent[] = [
    { id: '1', name: 'Alice Johnson', rollNo: '101', status: 'PRESENT', avatarColor: 'bg-pink-200 text-pink-700', behaviorPoints: 12 },
    { id: '2', name: 'Bob Smith', rollNo: '102', status: 'ABSENT', avatarColor: 'bg-blue-200 text-blue-700', behaviorPoints: 8 },
    { id: '3', name: 'Charlie Brown', rollNo: '103', status: 'PRESENT', avatarColor: 'bg-yellow-200 text-yellow-700', behaviorPoints: 15 },
    { id: '4', name: 'Daisy Miller', rollNo: '104', status: 'LATE', avatarColor: 'bg-purple-200 text-purple-700', behaviorPoints: 10 },
    { id: '5', name: 'Ethan Hunt', rollNo: '105', status: 'PRESENT', avatarColor: 'bg-green-200 text-green-700', behaviorPoints: 20 },
];

export const MOCK_SALARY: TeacherSalary = {
    month: 'February 2025',
    basic: 4500,
    allowance: 500,
    total: 5000,
    paymentDate: '2025-02-28'
};
