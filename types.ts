
export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';

export interface SyllabusItem {
    id: string;
    title: string;
    duration: string;
    isLocked: boolean;
}

export interface Course {
    id: string;
    title: string;
    price: number; // Used as "Monthly Fee" in ERP context
    rating: number;
    reviews: number;
    colorFrom: string;
    colorTo: string;
    icon: string; // Emoji or generic icon name
    description: string;
    syllabus: SyllabusItem[];
}

export enum ScreenState {
    ROLE_SELECTION,
    STUDENT_HOME,
    STUDENT_DETAILS,
    TEACHER_DASHBOARD,
    ADMIN_DASHBOARD,
    WELCOME,
    LOGIN
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    text: string;
    timestamp: Date;
}

// --- ERP Specific Types ---

export interface FeeInvoice {
    id: string;
    month: string;
    amount: number;
    status: 'PAID' | 'PENDING' | 'OVERDUE';
    dueDate: string;
}

export interface AttendanceStudent {
    id: string;
    name: string;
    rollNo: string;
    status: 'PRESENT' | 'ABSENT' | 'LATE';
    avatarColor: string;
    behaviorPoints: number;
}

export interface TeacherSalary {
    month: string;
    basic: number;
    allowance: number;
    total: number;
    paymentDate: string;
}