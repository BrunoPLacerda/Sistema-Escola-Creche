
import React, { useState, useMemo, useRef } from 'react';
import { Student, Course } from '../types';
import { WhatsAppIcon, PaperClipIcon, CloseIcon } from './icons';

interface CommunicationsProps {
  students: Student[];
  courses: Course[];
}

export const Communications: React.FC<CommunicationsProps> = ({ students, courses }) => {
  const [message, setMessage] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('all');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredStudents = useMemo(() => {
    if (selectedCourseId === 'all') return students;
    return students.filter(student => student.enrolledCourseId === selectedCourseId);
  }, [students, selectedCourseId]);

  const handleSendWhatsApp = (course: Course | undefined, msg: string) => {
    const groupLink = course?.whatsappGroupLink;

    if (!groupLink) {
        alert("Este curso não possui um link de grupo WhatsApp cadastrado.");
        return;
    }

    // Copy message to clipboard
    navigator.clipboard.writeText(msg).then(() => {
        // Open the group link
        window.open(groupLink, '_blank');
        alert("Mensagem copiada para a área de transferência! Cole-a no grupo do WhatsApp.");
    }).catch(err => {
        console.error('Erro ao copiar texto: ', err);
        window.open(groupLink, '_blank');
        alert("Não foi possível copiar a mensagem automaticamente. O link do grupo foi aberto.");
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Group students by course for display/sending
  const courseGroups = useMemo(() => {
      const groups: { course: Course, studentsCount: number }[] = [];
      
      const relevantCourses = selectedCourseId === 'all' 
        ? courses 
        : courses.filter(c => c.id === selectedCourseId);

      relevantCourses.forEach(course => {
          const count = students.filter(s => s.enrolledCourseId === course.id).length;
          groups.push({ course, studentsCount: count });
      });

      return groups;
  }, [courses, students, selectedCourseId]);


  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Nova Mensagem</h3>
        
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar Destinatários (Curso)</label>
            <select 
              value={selectedCourseId} 
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full md:w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary bg-white text-gray-900"
            >
              <option value="all">Todos os Cursos</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mensagem</label>
            <div className="border border-gray-300 rounded-lg p-2 focus-within:ring-2 focus-within:ring-brand-primary focus-within:border-brand-primary bg-white">
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Digite aqui seu comunicado..."
                rows={4}
                className="w-full p-1 border-none focus:ring-0 resize-none outline-none bg-white text-gray-900"
              ></textarea>
              
              <div className="border-t border-gray-100 pt-2 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/*,.pdf,.doc,.docx,.txt"
                  />
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center text-sm text-gray-500 hover:text-brand-primary transition-colors px-2 py-1 rounded hover:bg-gray-100"
                  >
                    <PaperClipIcon className="mr-1" /> 
                    <span className="hidden sm:inline">Anexar arquivo ou imagem</span>
                    <span className="sm:hidden">Anexar</span>
                  </button>

                  {selectedFile && (
                    <div className="flex items-center bg-brand-light text-brand-dark px-3 py-1 rounded-full text-xs animate-fade-in">
                      <span className="truncate max-w-[150px] font-medium">{selectedFile.name}</span>
                      <button 
                        onClick={handleRemoveFile} 
                        className="ml-2 text-gray-500 hover:text-red-500 focus:outline-none"
                        title="Remover anexo"
                      >
                        <CloseIcon className="w-3 h-3"/>
                      </button>
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-400 italic">
                   {/* Placeholder for char count or other status */}
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Escreva sua mensagem. Ao clicar em enviar, o texto será copiado e o grupo do WhatsApp será aberto.
              {selectedFile && <span className="text-orange-500 ml-1"> (Nota: O anexo deve ser enviado manualmente no grupo)</span>}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Grupos de Curso</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Curso / Turma</th>
                <th className="px-6 py-3">Alunos Matriculados</th>
                <th className="px-6 py-3">Link do Grupo</th>
                <th className="px-6 py-3 text-center">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {courseGroups.map(({ course, studentsCount }) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{course.name}</td>
                    <td className="px-6 py-4">{studentsCount} alunos</td>
                    <td className="px-6 py-4 text-gray-600 truncate max-w-xs">
                        {course.whatsappGroupLink ? (
                            <a href={course.whatsappGroupLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                {course.whatsappGroupLink}
                            </a>
                        ) : (
                            <span className="text-gray-400 italic">Não cadastrado</span>
                        )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => handleSendWhatsApp(course, message)}
                        disabled={(!message.trim() && !selectedFile) || !course.whatsappGroupLink}
                        className={`inline-flex items-center px-3 py-2 rounded-lg text-white font-medium transition-colors ${((!message.trim() && !selectedFile) || !course.whatsappGroupLink) ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#25D366] hover:bg-[#128C7E]'}`}
                        title={!course.whatsappGroupLink ? "Link do grupo não cadastrado" : "Copiar mensagem e abrir grupo"}
                      >
                        <WhatsAppIcon className="mr-2" />
                        Enviar para Grupo
                      </button>
                    </td>
                  </tr>
              ))}
              {courseGroups.length === 0 && (
                 <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">Nenhum curso encontrado.</td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
