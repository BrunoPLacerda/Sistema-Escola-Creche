
import React, { useState } from 'react';
import { Teacher } from '../types';
import { Modal } from './Modal';
import { EditIcon, DeleteIcon, AddIcon } from './icons';

interface TeacherManagementProps {
  teachers: Teacher[];
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
}

const TeacherForm: React.FC<{
  teacher: Partial<Teacher> | null;
  onSave: (teacher: Omit<Teacher, 'id'> | Teacher) => void;
  onCancel: () => void;
}> = ({ teacher, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Teacher>>(
    teacher || { name: '', dob: '', phone: '', address: '' }
  );
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Teacher);
  };

  return (
     <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
            <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
                <input type="date" name="dob" id="dob" value={formData.dob || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"/>
            </div>
            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefone</label>
                <input type="tel" name="phone" id="phone" value={formData.phone || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"/>
            </div>
        </div>
        <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Endereço</label>
            <input type="text" name="address" id="address" value={formData.address || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"/>
        </div>
        <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-secondary transition-colors">Salvar</button>
        </div>
    </form>
  );
};

export const TeacherManagement: React.FC<TeacherManagementProps> = ({ teachers, setTeachers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);

  const handleAdd = () => {
    setEditingTeacher(null);
    setIsModalOpen(true);
  };
  
  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (teacher: Teacher) => {
    setTeacherToDelete(teacher);
  };
  
  const confirmDelete = () => {
    if (teacherToDelete) {
        setTeachers(prev => prev.filter(t => t.id !== teacherToDelete.id));
        setTeacherToDelete(null);
    }
  };
  
  const handleSave = (teacherData: Omit<Teacher, 'id'> | Teacher) => {
    if ('id' in teacherData) {
      // Editing
      setTeachers(prev => prev.map(t => t.id === teacherData.id ? teacherData : t));
    } else {
      // Adding
      setTeachers(prev => [...prev, { ...teacherData, id: `tchr-${Date.now()}` }]);
    }
    setIsModalOpen(false);
    setEditingTeacher(null);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-700">Lista de Professores</h3>
            <button onClick={handleAdd} className="flex items-center px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-transform transform hover:scale-105 shadow-md">
                <AddIcon />
                <span className="ml-2">Adicionar Professor</span>
            </button>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Nome</th>
                        <th scope="col" className="px-6 py-3">Data de Nascimento</th>
                        <th scope="col" className="px-6 py-3">Telefone</th>
                        <th scope="col" className="px-6 py-3">Endereço</th>
                        <th scope="col" className="px-6 py-3 text-center">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {teachers.map(teacher => (
                        <tr key={teacher.id} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{teacher.name}</td>
                            <td className="px-6 py-4">{new Date(teacher.dob).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                            <td className="px-6 py-4">{teacher.phone}</td>
                            <td className="px-6 py-4">{teacher.address}</td>
                            <td className="px-6 py-4 text-center">
                                <button onClick={() => handleEdit(teacher)} className="font-medium text-brand-primary hover:underline mr-4 p-1 rounded-full hover:bg-brand-light">
                                    <EditIcon />
                                </button>
                                <button onClick={() => handleDeleteClick(teacher)} className="font-medium text-red-600 hover:underline p-1 rounded-full hover:bg-red-100">
                                    <DeleteIcon />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {teachers.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Nenhum professor cadastrado.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      
      {/* Modal de Formulário (Adicionar/Editar) */}
      {isModalOpen && (
          <Modal title={editingTeacher ? 'Editar Professor' : 'Adicionar Professor'} onClose={() => setIsModalOpen(false)}>
              <TeacherForm 
                teacher={editingTeacher}
                onSave={handleSave}
                onCancel={() => setIsModalOpen(false)}
              />
          </Modal>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {teacherToDelete && (
          <Modal title="Confirmar Exclusão" onClose={() => setTeacherToDelete(null)}>
              <div className="text-center p-4">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                      <DeleteIcon className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-xl leading-6 font-semibold text-gray-900 mb-2">Excluir Professor?</h3>
                  <div className="mt-2 mb-6">
                      <p className="text-sm text-gray-500">
                          Tem certeza que deseja excluir o registro de <b>{teacherToDelete.name}</b>? <br/>Esta ação não pode ser desfeita.
                      </p>
                  </div>
                  <div className="flex justify-center space-x-4">
                      <button 
                        onClick={() => setTeacherToDelete(null)} 
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
