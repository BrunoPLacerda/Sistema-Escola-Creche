
import React from 'react';
import { Student, Course, PaymentStatus } from '../types';
import { StudentsIcon, CoursesIcon, MoneyIcon, OverdueIcon } from './icons';

interface DashboardProps {
  students: Student[];
  courses: Course[];
}

const StatCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string | number;
  color: string;
}> = ({ icon, title, value, color }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg flex items-center transform hover:scale-105 transition-transform duration-300">
      <div className={`rounded-full p-3 ${color} text-white`}>
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({ students, courses }) => {
  const totalStudents = students.length;
  const totalCourses = courses.length;

  const totalMonthlyRevenue = students
    .filter(s => s.paymentStatus === PaymentStatus.Paid)
    .reduce((acc, student) => {
      const course = courses.find(c => c.id === student.enrolledCourseId);
      return acc + (course?.tuitionFee || 0);
    }, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const overduePayments = students.filter(s => s.paymentStatus === PaymentStatus.Overdue).length;

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<StudentsIcon className="text-white"/>} 
          title="Total de Alunos" 
          value={totalStudents} 
          color="bg-brand-primary"
        />
        <StatCard 
          icon={<CoursesIcon className="text-white"/>} 
          title="Total de Cursos" 
          value={totalCourses} 
          color="bg-brand-secondary"
        />
        <StatCard 
          icon={<MoneyIcon className="text-white"/>} 
          title="Receita Mensal" 
          value={totalMonthlyRevenue} 
          color="bg-yellow-500"
        />
        <StatCard 
          icon={<OverdueIcon className="text-white"/>} 
          title="Pagamentos Vencidos" 
          value={overduePayments} 
          color="bg-red-500"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Alunos Recentes</h3>
          <ul className="space-y-4">
            {students.slice(0, 5).map(student => (
              <li key={student.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-semibold text-gray-800">{student.name}</p>
                  <p className="text-sm text-gray-500">{student.email}</p>
                </div>
                <span className="text-sm font-medium text-gray-600">
                    {courses.find(c => c.id === student.enrolledCourseId)?.name || 'Curso não encontrado'}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Cursos Populares</h3>
          <ul className="space-y-4">
             {courses.slice(0, 5).map(course => (
              <li key={course.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-semibold text-gray-800">{course.name}</p>
                  <p className="text-sm text-gray-500">{course.duration}</p>
                </div>
                <span className="text-lg font-bold text-brand-primary">
                    {course.tuitionFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
