
import React, { useMemo } from 'react';
import { Student, Course, PaymentStatus } from '../types';
import { MoneyIcon, OverdueIcon, BankIcon, CheckIcon } from './icons';

interface FinancialManagementProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  courses: Course[];
}

const StatCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: string;
    color: string;
  }> = ({ icon, title, value, color }) => {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md flex items-center border border-gray-100">
        <div className={`rounded-full p-3 ${color} text-white shadow-sm`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{title}</p>
          <p className="text-xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    );
};

export const FinancialManagement: React.FC<FinancialManagementProps> = ({ students, setStudents, courses }) => {
  
  const financialStats = useMemo(() => {
    let expected = 0;
    let received = 0;
    let overdue = 0;
    let pending = 0;

    students.forEach(student => {
        const course = courses.find(c => c.id === student.enrolledCourseId);
        const value = course ? course.tuitionFee : 0;
        
        expected += value;
        
        if (student.paymentStatus === PaymentStatus.Paid) {
            received += value;
        } else if (student.paymentStatus === PaymentStatus.Overdue) {
            overdue += value;
        } else {
            pending += value;
        }
    });

    return {
        expected: expected.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        received: received.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        overdue: overdue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        pending: pending.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    };
  }, [students, courses]);

  const handleStatusChange = (studentId: string, newStatus: PaymentStatus) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, paymentStatus: newStatus } : s));
  };

  const getStatusStyle = (status: PaymentStatus) => {
    switch(status) {
      case PaymentStatus.Paid: return 'bg-green-100 text-green-800 border-green-200';
      case PaymentStatus.Pending: return 'bg-orange-100 text-orange-800 border-orange-200';
      case PaymentStatus.Overdue: return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
                icon={<BankIcon />} 
                title="Receita Estimada" 
                value={financialStats.expected} 
                color="bg-brand-primary"
            />
            <StatCard 
                icon={<MoneyIcon />} 
                title="Receita Realizada" 
                value={financialStats.received} 
                color="bg-status-paid"
            />
            <StatCard 
                icon={<OverdueIcon />} 
                title="Valores em Atraso" 
                value={financialStats.overdue} 
                color="bg-status-overdue"
            />
             <StatCard 
                icon={<CheckIcon />} 
                title="A Receber" 
                value={financialStats.pending} 
                color="bg-status-pending"
            />
        </div>

        {/* Financial Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Controle de Mensalidades</h3>
                <span className="text-sm text-gray-500">Mês atual</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                        <tr>
                            <th className="px-6 py-4">Aluno</th>
                            <th className="px-6 py-4">Curso</th>
                            <th className="px-6 py-4">Valor</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Ação</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {students.map(student => {
                            const course = courses.find(c => c.id === student.enrolledCourseId);
                            return (
                                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {student.name}
                                        <div className="text-xs text-gray-500 font-normal">{student.email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{course?.name || 'N/A'}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {course?.tuitionFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(student.paymentStatus)}`}>
                                            {student.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select 
                                            value={student.paymentStatus}
                                            onChange={(e) => handleStatusChange(student.id, e.target.value as PaymentStatus)}
                                            className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block w-full p-2"
                                        >
                                            {Object.values(PaymentStatus).map(status => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            );
                        })}
                         {students.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    Nenhum aluno cadastrado para gerar financeiro.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};
