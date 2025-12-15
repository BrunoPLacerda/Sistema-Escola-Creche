
import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { StudentManagement } from './components/StudentManagement';
import { TeacherManagement } from './components/TeacherManagement';
import { CourseManagement } from './components/CourseManagement';
import { FinancialManagement } from './components/FinancialManagement';
import { Communications } from './components/Communications';
import { Reports } from './components/Reports';
import { Calendar } from './components/Calendar';
import { Login } from './components/Login';
import { Receipts } from './components/Receipts';
import { ParentPortal } from './components/ParentPortal';
import { Student, Course, Page, PaymentStatus, Teacher, CalendarEvent, UserRole } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [currentUserStudentId, setCurrentUserStudentId] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [schoolPixKey, setSchoolPixKey] = useState('42.882.025/0001-06'); // Chave PIX Padrão

  const [initialCourses, setInitialCourses] = useState<Course[]>([
    { id: 'crs-1', name: 'Desenvolvimento Web Full-Stack', description: 'Aprenda a criar aplicações web do zero.', duration: '12 meses', tuitionFee: 499.90, whatsappGroupLink: 'https://chat.whatsapp.com/L1nkExample1' },
    { id: 'crs-2', name: 'Ciência de Dados com Python', description: 'Domine análise de dados, machine learning e visualização.', duration: '9 meses', tuitionFee: 599.90 },
    { id: 'crs-3', name: 'Design de UX/UI', description: 'Crie interfaces intuitivas e experiências de usuário memoráveis.', duration: '6 meses', tuitionFee: 399.90 },
    { id: 'crs-4', name: 'Marketing Digital', description: 'Estratégias de SEO, mídias sociais e marketing de conteúdo.', duration: '8 meses', tuitionFee: 350.00 },
  ]);

  const [initialStudents, setInitialStudents] = useState<Student[]>([
    { 
      id: 'std-1', 
      name: 'Ana Silva', 
      dob: '1998-05-15', 
      email: 'ana.silva@email.com', 
      phone: '(11) 98765-4321', 
      enrolledCourseId: 'crs-1', 
      paymentStatus: PaymentStatus.Paid,
      guardianName: 'Maria Silva',
      guardianCpf: '111.222.333-44',
      academicRecords: [
        { subject: 'HTML/CSS', grade1: 8.5, grade2: 9.0, attendance: 95 },
        { subject: 'JavaScript', grade1: 7.0, grade2: 8.2, attendance: 88, observations: 'Bom desempenho em lógica.' },
        { subject: 'React Basics', grade1: 8.0, attendance: 100 }
      ]
    },
    { 
      id: 'std-2', 
      name: 'Bruno Costa', 
      dob: '2000-02-20', 
      email: 'bruno.costa@email.com', 
      phone: '(21) 91234-5678', 
      enrolledCourseId: 'crs-2', 
      paymentStatus: PaymentStatus.Pending,
      guardianName: 'Carlos Costa',
      guardianCpf: '555.666.777-88',
      academicRecords: [
         { subject: 'Python Intro', grade1: 6.5, grade2: 7.0, attendance: 70, observations: 'Precisa melhorar frequência.' },
         { subject: 'Estatística', grade1: 8.0, attendance: 90 }
      ]
    },
    { id: 'std-3', name: 'Carla Dias', dob: '1999-11-30', email: 'carla.dias@email.com', phone: '(31) 95555-8888', enrolledCourseId: 'crs-3', paymentStatus: PaymentStatus.Overdue, guardianName: 'Roberto Dias', guardianCpf: '999.888.777-66' },
    { id: 'std-4', name: 'Daniel Martins', dob: '2001-07-10', email: 'daniel.martins@email.com', phone: '(41) 99999-1111', enrolledCourseId: 'crs-1', paymentStatus: PaymentStatus.Paid, guardianName: 'Sônia Martins', guardianCpf: '222.333.444-55' },
    { id: 'std-5', name: 'Eduarda Ferreira', dob: '1997-09-05', email: 'eduarda.f@email.com', phone: '(51) 98888-2222', enrolledCourseId: 'crs-4', paymentStatus: PaymentStatus.Pending, guardianName: 'Paulo Ferreira', guardianCpf: '000.111.222-33' },
  ]);

  const [initialTeachers, setInitialTeachers] = useState<Teacher[]>([
    { id: 'tchr-1', name: 'Roberto Almeida', dob: '1982-05-10', phone: '(11) 98888-7777', address: 'Rua das Flores, 123, São Paulo - SP' },
    { id: 'tchr-2', name: 'Juliana Mendes', dob: '1990-09-15', phone: '(21) 97777-6666', address: 'Av. Paulista, 1000, São Paulo - SP' },
  ]);

  const [initialEvents, setInitialEvents] = useState<CalendarEvent[]>([
    { id: 'evt-1', title: 'Início das Aulas', date: '2024-02-05', type: 'other', description: 'Boas-vindas aos novos alunos' },
    { id: 'evt-2', title: 'Feriado de Carnaval', date: '2024-02-13', type: 'holiday' },
    { id: 'evt-3', title: 'Prova de UX/UI', date: '2024-03-15', type: 'exam', description: 'Turma A' },
    { id: 'evt-4', title: 'Reunião Pedagógica', date: '2024-03-20', type: 'meeting' },
  ]);
  
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const pageTitle = useMemo(() => {
    switch (currentPage) {
      case 'dashboard': return 'Painel de Controle';
      case 'students': return 'Gerenciamento de Alunos';
      case 'teachers': return 'Gerenciamento de Professores';
      case 'courses': return 'Gerenciamento de Cursos';
      case 'calendar': return 'Calendário Acadêmico';
      case 'financial': return 'Controle Financeiro';
      case 'receipts': return 'Emissão de Recibos';
      case 'communications': return 'Comunicados (WhatsApp)';
      case 'reports': return 'Relatórios';
      default: return 'Sistema Escolar';
    }
  }, [currentPage]);

  const handleLogin = (role: UserRole, linkedStudentId?: string) => {
    setUserRole(role);
    if (linkedStudentId) {
      setCurrentUserStudentId(linkedStudentId);
    }
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
    setUserRole('admin');
    setCurrentUserStudentId(undefined);
  };

  // Render Logic
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} students={students} />;
  }

  // --- RENDER PORTAL VIEW (FOR GUARDIANS) ---
  if (userRole === 'guardian' && currentUserStudentId) {
    const student = students.find(s => s.id === currentUserStudentId);
    if (!student) return <div>Erro: Aluno não encontrado.</div>;
    const course = courses.find(c => c.id === student.enrolledCourseId);

    return (
      <ParentPortal 
        student={student} 
        course={course}
        events={events}
        schoolPixKey={schoolPixKey}
        onLogout={handleLogout}
      />
    );
  }

  // --- RENDER ADMIN VIEW ---
  const renderAdminContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard students={students} courses={courses} />;
      case 'students':
        return <StudentManagement students={students} setStudents={setStudents} courses={courses} />;
      case 'teachers':
        return <TeacherManagement teachers={teachers} setTeachers={setTeachers} />;
      case 'courses':
        return <CourseManagement courses={courses} setCourses={setCourses} />;
      case 'calendar':
        return <Calendar events={events} setEvents={setEvents} />;
      case 'financial':
        return <FinancialManagement students={students} setStudents={setStudents} courses={courses} />;
      case 'receipts':
        return <Receipts students={students} courses={courses} />;
      case 'communications':
        return <Communications students={students} courses={courses} />;
      case 'reports':
        return <Reports students={students} courses={courses} />;
      default:
        return <Dashboard students={students} courses={courses} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        isOpen={isSidebarOpen} 
        setOpen={setSidebarOpen} 
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={pageTitle} onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6 print:p-0 print:bg-white">
          {renderAdminContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
