
import React from 'react';
import { Student, Course, PaymentStatus } from '../types';
import { DownloadIcon } from './icons';

interface ReportsProps {
  students: Student[];
  courses: Course[];
}

export const Reports: React.FC<ReportsProps> = ({ students, courses }) => {

  // Report 1: Enrollment per Course
  const enrollmentData = courses.map(course => {
    const count = students.filter(s => s.enrolledCourseId === course.id).length;
    const percentage = students.length > 0 ? (count / students.length) * 100 : 0;
    return { ...course, count, percentage };
  });

  // Report 2: Financial Summary
  const totalRevenue = students.reduce((acc, s) => {
     const course = courses.find(c => c.id === s.enrolledCourseId);
     return acc + (course?.tuitionFee || 0);
  }, 0);

  const paidRevenue = students
    .filter(s => s.paymentStatus === PaymentStatus.Paid)
    .reduce((acc, s) => {
        const course = courses.find(c => c.id === s.enrolledCourseId);
        return acc + (course?.tuitionFee || 0);
    }, 0);
  
  const paidPercentage = totalRevenue > 0 ? (paidRevenue / totalRevenue) * 100 : 0;

  const handleExport = (reportName: string) => {
      alert(`Exportando ${reportName} para PDF... (Simulação)`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
        
        {/* Enrollment Report */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Distribuição de Alunos por Curso</h3>
                <button onClick={() => handleExport('Relatório de Matrículas')} className="flex items-center text-sm text-brand-primary hover:underline">
                    <DownloadIcon className="mr-1"/> Exportar PDF
                </button>
            </div>
            <div className="space-y-4">
                {enrollmentData.map(data => (
                    <div key={data.id}>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700">{data.name}</span>
                            <span className="text-gray-500">{data.count} alunos ({data.percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                                className="bg-brand-primary h-2.5 rounded-full transition-all duration-500" 
                                style={{ width: `${data.percentage}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Financial Status Report */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">Status de Adimplência</h3>
                     <button onClick={() => handleExport('Relatório Financeiro')} className="flex items-center text-sm text-brand-primary hover:underline">
                        <DownloadIcon className="mr-1"/> Exportar Excel
                    </button>
                </div>
                <div className="flex items-center justify-center py-4">
                     <div className="relative w-40 h-40">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                            <path
                                className="text-gray-200"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3.8"
                            />
                            <path
                                className="text-status-paid"
                                strokeDasharray={`${paidPercentage}, 100`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3.8"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-2xl font-bold text-gray-800">{paidPercentage.toFixed(0)}%</span>
                            <span className="text-xs text-gray-500">Arrecadado</span>
                        </div>
                     </div>
                </div>
                 <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-status-paid mr-2"></span>Pago</span>
                        <span className="font-semibold">{paidRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-gray-200 mr-2"></span>Total Esperado</span>
                        <span className="font-semibold">{totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    </div>
                </div>
            </div>

            {/* Students List Report */}
             <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">Resumo Geral</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-3xl font-bold text-brand-dark">{students.length}</p>
                        <p className="text-sm text-gray-500">Total de Alunos</p>
                    </div>
                     <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-3xl font-bold text-brand-dark">{courses.length}</p>
                        <p className="text-sm text-gray-500">Cursos Ativos</p>
                    </div>
                     <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-3xl font-bold text-status-overdue">
                            {students.filter(s => s.paymentStatus === PaymentStatus.Overdue).length}
                        </p>
                        <p className="text-sm text-gray-500">Inadimplentes</p>
                    </div>
                     <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-3xl font-bold text-brand-secondary">
                            {(students.length > 0 ? (students.length / courses.length) : 0).toFixed(1)}
                        </p>
                        <p className="text-sm text-gray-500">Média Alunos/Curso</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
