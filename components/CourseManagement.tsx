
import React, { useState } from 'react';
import { Course } from '../types';
import { Modal } from './Modal';
import { EditIcon, DeleteIcon, AddIcon } from './icons';

interface CourseManagementProps {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
}

const CourseForm: React.FC<{
  course: Partial<Course> | null;
  onSave: (course: Omit<Course, 'id'> | Course) => void;
  onCancel: () => void;
}> = ({ course, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Course>>(
    course || { name: '', description: '', duration: '', tuitionFee: 0, whatsappGroupLink: '' }
  );
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? parseFloat(value) : value 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Course);
  };

  return (
     <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome do Curso</label>
            <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"/>
        </div>
        <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
            <textarea name="description" id="description" value={formData.description || ''} onChange={handleChange} required rows={3} className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duração</label>
                <input type="text" name="duration" id="duration" value={formData.duration || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"/>
            </div>
            <div>
                <label htmlFor="tuitionFee" className="block text-sm font-medium text-gray-700">Valor da Mensalidade (R$)</label>
                <input type="number" name="tuitionFee" id="tuitionFee" value={formData.tuitionFee || ''} onChange={handleChange} required step="0.01" className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"/>
            </div>
        </div>
        <div>
            <label htmlFor="whatsappGroupLink" className="block text-sm font-medium text-gray-700">Link do Grupo WhatsApp</label>
            <input type="url" name="whatsappGroupLink" id="whatsappGroupLink" value={formData.whatsappGroupLink || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm" placeholder="https://chat.whatsapp.com/..."/>
        </div>
        <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-secondary transition-colors">Salvar</button>
        </div>
    </form>
  );
};

export const CourseManagement: React.FC<CourseManagementProps> = ({ courses, setCourses }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  const handleAdd = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };
  
  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (course: Course) => {
    setCourseToDelete(course);
  };

  const confirmDelete = () => {
    if (courseToDelete) {
        setCourses(prev => prev.filter(c => c.id !== courseToDelete.id));
        setCourseToDelete(null);
    }
  };
  
  const handleSave = (courseData: Omit<Course, 'id'> | Course) => {
    if ('id' in courseData) {
      setCourses(prev => prev.map(c => c.id === courseData.id ? courseData : c));
    } else {
      setCourses(prev => [...prev, { ...courseData, id: `crs-${Date.now()}` }]);
    }
    setIsModalOpen(false);
    setEditingCourse(null);
  };
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-700">Lista de Cursos</h3>
            <button onClick={handleAdd} className="flex items-center px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-transform transform hover:scale-105 shadow-md">
                <AddIcon />
                <span className="ml-2">Adicionar Curso</span>
            </button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Nome do Curso</th>
                        <th scope="col" className="px-6 py-3">Duração</th>
                        <th scope="col" className="px-6 py-3">Mensalidade</th>
                        <th scope="col" className="px-6 py-3 text-center">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map(course => (
                        <tr key={course.id} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{course.name}</td>
                            <td className="px-6 py-4">{course.duration}</td>
                            <td className="px-6 py-4 font-semibold text-gray-800">{course.tuitionFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                            <td className="px-6 py-4 text-center">
                                <button onClick={() => handleEdit(course)} className="font-medium text-brand-primary hover:underline mr-4 p-1 rounded-full hover:bg-brand-light">
                                    <EditIcon />
                                </button>
                                <button onClick={() => handleDeleteClick(course)} className="font-medium text-red-600 hover:underline p-1 rounded-full hover:bg-red-100">
                                    <DeleteIcon />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      
      {isModalOpen && (
          <Modal title={editingCourse ? 'Editar Curso' : 'Adicionar Curso'} onClose={() => setIsModalOpen(false)}>
              <CourseForm 
                course={editingCourse}
                onSave={handleSave}
                onCancel={() => setIsModalOpen(false)}
              />
          </Modal>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {courseToDelete && (
          <Modal title="Confirmar Exclusão" onClose={() => setCourseToDelete(null)}>
              <div className="text-center p-4">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                      <DeleteIcon className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-xl leading-6 font-semibold text-gray-900 mb-2">Excluir Curso?</h3>
                  <div className="mt-2 mb-6">
                      <p className="text-sm text-gray-500">
                          Tem certeza que deseja excluir o curso <b>{courseToDelete.name}</b>? <br/>Esta ação não pode ser desfeita.
                      </p>
                  </div>
                  <div className="flex justify-center space-x-4">
                      <button 
                        onClick={() => setCourseToDelete(null)} 
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
