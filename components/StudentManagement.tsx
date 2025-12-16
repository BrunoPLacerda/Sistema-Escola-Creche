
import React, { useState } from 'react';
import { Student, Course, PaymentStatus } from '../types';
import { Modal } from './Modal';
import { EditIcon, DeleteIcon, AddIcon } from './icons';

interface StudentManagementProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  courses: Course[];
}

const StudentForm: React.FC<{
  student: Partial<Student> | null;
  courses: Course[];
  onSave: (student: Omit<Student, 'id'> | Student) => void;
  onCancel: () => void;
}> = ({ student, courses, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Student>>(
    student || { 
        name: '', 
        dob: '', 
        email: '', 
        phone: '', 
        enrolledCourseId: '', 
        paymentStatus: PaymentStatus.Pending,
        guardianName: '',
        guardianCpf: ''
    }
  );

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let finalValue = value;

    if (name === 'guardianCpf') {
        finalValue = formatCPF(value);
    }

    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Student);
  };

  return (
     <form onSubmit={handleSubmit} className="space-y-4">
        <h4 className="text-sm font-bold text-brand-primary uppercase border-b pb-1">Dados do Aluno</h4>
        <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo do Aluno</label>
            <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
                <input type="date" name="dob" id="dob" value={formData.dob || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"/>
            </div>
            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefone (Aluno)</label>
                <input type="tel" name="phone" id="phone" value={formData.phone || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"/>
            </div>
        </div>
        <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" id="email" value={formData.email || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"/>
        </div>
        
        <h4 className="text-sm font-bold text-brand-primary uppercase border-b pb-1 mt-6">Dados do Responsável (Portal)</h4>
        <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
            <div className="mb-3">
                <label htmlFor="guardianName" className="block text-sm font-medium text-gray-700">Nome do Responsável Legal</label>
                <input type="text" name="guardianName" id="guardianName" value={formData.guardianName || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"/>
            </div>
            <div>
                <label htmlFor="guardianCpf" className="block text-sm font-medium text-gray-700">CPF do Responsável (Login do Portal)</label>
                <input 
                    type="text" 
                    name="guardianCpf" 
                    id="guardianCpf" 
                    value={formData.guardianCpf || ''} 
                    onChange={handleChange} 
                    required 
                    maxLength={14}
                    placeholder="000.000.000-00"
                    className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Este CPF será usado para o responsável acessar o Portal do Aluno.</p>
            </div>
        </div>

        <h4 className="text-sm font-bold text-brand-primary uppercase border-b pb-1 mt-6">Matrícula</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="enrolledCourseId" className="block text-sm font-medium text-gray-700">Curso Matriculado</label>
                <select name="enrolledCourseId" id="enrolledCourseId" value={formData.enrolledCourseId || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm">
                    <option value="">Selecione um curso</option>
                    {courses.map(course => <option key={course.id} value={course.id}>{course.name}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700">Status do Pagamento</label>
                <select name="paymentStatus" id="paymentStatus" value={formData.paymentStatus || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm">
                    {Object.values(PaymentStatus).map(status => <option key={status} value={status}>{status}</option>)}
                </select>
            </div>
        </div>
        <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-secondary transition-colors">Salvar</button>
        </div>
    </form>
  );
};


export const StudentManagement: React.FC<StudentManagementProps> = ({ students, setStudents, courses }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  const handleAdd = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };
  
  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (student: Student) => {
    setStudentToDelete(student);
  };

  const confirmDelete = () => {
    if (studentToDelete) {
      setStudents(prev => prev.filter(s => s.id !== studentToDelete.id));
      setStudentToDelete(null);
    }
  };
  
  const handleSave = (studentData: Omit<Student, 'id'> | Student) => {
    if ('id' in studentData) {
      // Editing
      setStudents(prev => prev.map(s => s.id === studentData.id ? studentData : s));
    } else {
      // Adding
      setStudents(prev => [...prev, { ...studentData, id: `std-${Date.now()}` }]);
    }
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  const getStatusColor = (status: PaymentStatus) => {
    switch(status) {
      case PaymentStatus.Paid: return 'bg-status-paid/20 text-status-paid';
      case PaymentStatus.Pending: return 'bg-status-pending/20 text-status-pending';
      case PaymentStatus.Overdue: return 'bg-status-overdue/20 text-status-overdue';
      default: return 'bg-gray-200 text-gray-800';
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-700">Lista de Alunos e Responsáveis</h3>
            <button onClick={handleAdd} className="flex items-center px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-transform transform hover:scale-105 shadow-md">
                <AddIcon />
                <span className="ml-2">Adicionar Aluno</span>
            </button>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Aluno</th>
                        <th scope="col" className="px-6 py-3">Responsável</th>
                        <th scope="col" className="px-6 py-3">Curso</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3 text-center">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => {
                        const course = courses.find(c => c.id === student.enrolledCourseId);
                        return (
                            <tr key={student.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{student.name}</div>
                                    <div className="text-xs text-gray-400">{student.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-gray-900">{student.guardianName}</div>
                                    <div className="text-xs text-gray-400">CPF: {student.guardianCpf}</div>
                                </td>
                                <td className="px-6 py-4">{course?.name || 'N/A'}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(student.paymentStatus)}`}>
                                        {student.paymentStatus}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button onClick={() => handleEdit(student)} className="font-medium text-brand-primary hover:underline mr-4 p-1 rounded-full hover:bg-brand-light">
                                        <EditIcon />
                                    </button>
                                    <button onClick={() => handleDeleteClick(student)} className="font-medium text-red-600 hover:underline p-1 rounded-full hover:bg-red-100">
                                        <DeleteIcon />
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
      
      {isModalOpen && (
          <Modal title={editingStudent ? 'Editar Aluno' : 'Adicionar Aluno'} onClose={() => setIsModalOpen(false)}>
              <StudentForm 
                student={editingStudent}
                courses={courses}
                onSave={handleSave}
                onCancel={() => setIsModalOpen(false)}
              />
          </Modal>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {studentToDelete && (
          <Modal title="Confirmar Exclusão" onClose={() => setStudentToDelete(null)}>
              <div className="text-center p-4">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                      <DeleteIcon className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-xl leading-6 font-semibold text-gray-900 mb-2">Excluir Aluno?</h3>
                  <div className="mt-2 mb-6">
                      <p className="text-sm text-gray-500">
                          Tem certeza que deseja excluir o aluno <b>{studentToDelete.name}</b>? <br/>Esta ação não pode ser desfeita.
                      </p>
                  </div>
                  <div className="flex justify-center space-x-4">
                      <button 
                        onClick={() => setStudentToDelete(null)} 
                        className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition-colors"
                      >
                        Cancelar
                      </button>
                      <button 
                        onClick={confirmDelete} 
                        className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors shadow-sm"
                      >
                        Sim, Excluir
                      </button>
                  </div>
              </div>
          </Modal>
      )}
    </div>
  );
};
