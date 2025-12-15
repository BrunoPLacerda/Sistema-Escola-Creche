
export type Page = 'dashboard' | 'students' | 'teachers' | 'courses' | 'financial' | 'communications' | 'reports' | 'calendar' | 'receipts';
export type UserRole = 'admin' | 'guardian';

export enum PaymentStatus {
  Paid = 'Pago',
  Pending = 'Pendente',
  Overdue = 'Vencido',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  duration: string;
  tuitionFee: number;
  whatsappGroupLink?: string;
}

export interface AcademicRecord {
  subject: string;
  grade1?: number; // Nota 1º Bimestre/Semestre
  grade2?: number;
  grade3?: number;
  grade4?: number;
  attendance: number; // Porcentagem de presença (0-100)
  observations?: string;
}

export interface Student {
  id: string;
  name: string;
  dob: string;
  email: string;
  phone: string;
  enrolledCourseId: string;
  paymentStatus: PaymentStatus;
  // Dados do Responsável Legal
  guardianName: string;
  guardianCpf: string; // Chave de acesso
  // Dados Acadêmicos
  academicRecords?: AcademicRecord[];
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
