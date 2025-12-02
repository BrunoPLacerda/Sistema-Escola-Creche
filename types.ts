
export type Page = 'dashboard' | 'students' | 'teachers' | 'courses' | 'financial' | 'communications' | 'reports' | 'calendar' | 'receipts';

export enum PaymentStatus {
  Paid = 'Pago',
  Pending = 'Pendente',
  Overdue = 'Vencido',
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  duration: string;
  tuitionFee: number;
  whatsappGroupLink?: string;
}

export interface Student {
  id: string;
  name: string;
  dob: string;
  email: string;
  phone: string;
  enrolledCourseId: string;
  paymentStatus: PaymentStatus;
}

export interface Teacher {
  id: string;
  name: string;
  dob: string;
  phone: string;
  address: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  description?: string;
  type: 'exam' | 'holiday' | 'meeting' | 'other';
}