
import React, { useState } from 'react';
import { Student, Course, PaymentStatus, CalendarEvent } from '../types';
import { LogoutIcon, BankIcon, ReportIcon, BellIcon, WhatsAppIcon, CloseIcon } from './icons';

interface ParentPortalProps {
  student: Student;
  course: Course | undefined;
  events: CalendarEvent[];
  schoolPixKey: string;
  onLogout: () => void;
}

export const ParentPortal: React.FC<ParentPortalProps> = ({ student, course, events, schoolPixKey, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'academic' | 'financial' | 'communications'>('academic');
  const [showPixModal, setShowPixModal] = useState(false);

  const handleCopyPix = () => {
    navigator.clipboard.writeText(schoolPixKey);
    alert('Chave PIX copiada! Cole no aplicativo do seu banco.');
  };

  const getStatusColor = (status: PaymentStatus) => {
    switch(status) {
      case PaymentStatus.Paid: return 'text-green-600 bg-green-100';
      case PaymentStatus.Pending: return 'text-orange-600 bg-orange-100';
      case PaymentStatus.Overdue: return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans pb-20">
      {/* Header Mobile-Friendly */}
      <header className="bg-brand-primary text-white p-6 shadow-lg rounded-b-3xl relative z-10">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-brand-light text-sm font-medium opacity-90">Olá, {student.guardianName}</p>
            <h1 className="text-2xl font-bold mt-1">{student.name}</h1>
            <p className="text-sm mt-1 opacity-80">{course?.name || 'Curso não identificado'}</p>
          </div>
          <button onClick={onLogout} className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors">
            <LogoutIcon className="w-5 h-5 text-white" />
          </button>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex justify-between mt-8 bg-white/10 p-1 rounded-xl backdrop-blur-sm">
          <button 
            onClick={() => setActiveTab('academic')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'academic' ? 'bg-white text-brand-primary shadow-sm' : 'text-white hover:bg-white/10'}`}
          >
            Acadêmico
          </button>
          <button 
            onClick={() => setActiveTab('financial')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'financial' ? 'bg-white text-brand-primary shadow-sm' : 'text-white hover:bg-white/10'}`}
          >
            Financeiro
          </button>
           <button 
            onClick={() => setActiveTab('communications')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'communications' ? 'bg-white text-brand-primary shadow-sm' : 'text-white hover:bg-white/10'}`}
          >
            Avisos
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 md:p-6 max-w-4xl mx-auto -mt-4 pt-8">
        
        {/* TAB ACADÊMICO */}
        {activeTab === 'academic' && (
          <div className="space-y-4 animate-fade-in">
             {/* Frequência Geral Card */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
               <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <ReportIcon className="w-5 h-5 mr-2 text-brand-secondary"/>
                  Desempenho Geral
               </h3>
               {(!student.academicRecords || student.academicRecords.length === 0) ? (
                 <p className="text-gray-500 text-sm">Nenhuma nota lançada ainda.</p>
               ) : (
                 <div className="space-y-4 mt-4">
                    {student.academicRecords.map((record, idx) => (
                      <div key={idx} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                         <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-gray-700">{record.subject}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${record.attendance >= 75 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              Freq: {record.attendance}%
                            </span>
                         </div>
                         <div className="grid grid-cols-4 gap-2 text-center text-sm">
                            <div className="bg-gray-50 rounded p-1">
                              <span className="block text-[10px] text-gray-400">1º Bim</span>
                              <span className="font-semibold">{record.grade1 ?? '-'}</span>
                            </div>
                            <div className="bg-gray-50 rounded p-1">
                              <span className="block text-[10px] text-gray-400">2º Bim</span>
                              <span className="font-semibold">{record.grade2 ?? '-'}</span>
                            </div>
                            <div className="bg-gray-50 rounded p-1">
                              <span className="block text-[10px] text-gray-400">3º Bim</span>
                              <span className="font-semibold">{record.grade3 ?? '-'}</span>
                            </div>
                            <div className="bg-gray-50 rounded p-1">
                              <span className="block text-[10px] text-gray-400">4º Bim</span>
                              <span className="font-semibold">{record.grade4 ?? '-'}</span>
                            </div>
                         </div>
                         {record.observations && (
                           <p className="text-xs text-gray-500 mt-2 italic bg-yellow-50 p-2 rounded">
                             Obs: {record.observations}
                           </p>
                         )}
                      </div>
                    ))}
                 </div>
               )}
            </div>
          </div>
        )}

        {/* TAB FINANCEIRO */}
        {activeTab === 'financial' && (
          <div className="space-y-4 animate-fade-in">
             <div className="bg-brand-secondary/10 p-4 rounded-xl border border-brand-secondary/20 flex items-start">
                <BankIcon className="w-6 h-6 text-brand-secondary mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-brand-secondary">Mensalidade Atual</h3>
                  <p className="text-sm text-gray-600 mt-1">Valor do curso: <strong className="text-gray-900">{course?.tuitionFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></p>
                  <div className="mt-3">
                    <span className={`inline-block px-3 py-1 rounded-lg text-sm font-bold ${getStatusColor(student.paymentStatus)}`}>
                      Status: {student.paymentStatus}
                    </span>
                  </div>
                </div>
             </div>

             {student.paymentStatus !== PaymentStatus.Paid && (
               <button 
                  onClick={() => setShowPixModal(true)}
                  className="w-full bg-brand-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-brand-primary/30 active:scale-95 transition-transform flex items-center justify-center"
               >
                  <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  Pagar com PIX
               </button>
             )}

             <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-4">Histórico Recente</h3>
                <div className="space-y-3">
                   {/* Mock History */}
                   <div className="flex justify-between items-center py-2 border-b border-gray-50">
                      <div>
                        <p className="font-medium text-gray-800">Mensalidade Outubro</p>
                        <p className="text-xs text-gray-400">Vencimento: 10/10/2024</p>
                      </div>
                      <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">Pago</span>
                   </div>
                   <div className="flex justify-between items-center py-2 border-b border-gray-50">
                      <div>
                        <p className="font-medium text-gray-800">Mensalidade Setembro</p>
                        <p className="text-xs text-gray-400">Vencimento: 10/09/2024</p>
                      </div>
                      <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">Pago</span>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* TAB COMUNICADOS */}
        {activeTab === 'communications' && (
           <div className="space-y-4 animate-fade-in">
              {/* Eventos Próximos */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                 <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <BellIcon className="w-5 h-5 mr-2 text-brand-primary"/>
                    Quadro de Avisos
                 </h3>
                 
                 {events.length === 0 ? (
                   <p className="text-gray-500 text-sm">Sem avisos no momento.</p>
                 ) : (
                   <div className="space-y-3">
                     {events.slice(0, 4).map(evt => (
                       <div key={evt.id} className="bg-gray-50 p-3 rounded-lg border-l-4 border-brand-primary">
                          <p className="font-bold text-gray-800 text-sm">{evt.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{new Date(evt.date).toLocaleDateString('pt-BR')} - {evt.type === 'exam' ? 'Avaliação' : evt.type === 'holiday' ? 'Feriado' : 'Evento'}</p>
                          {evt.description && <p className="text-xs text-gray-600 mt-2">{evt.description}</p>}
                       </div>
                     ))}
                   </div>
                 )}
              </div>

              {course?.whatsappGroupLink && (
                <a 
                  href={course.whatsappGroupLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block bg-[#25D366] text-white p-4 rounded-xl font-bold shadow-md hover:bg-[#128C7E] transition-colors flex items-center justify-center"
                >
                   <WhatsAppIcon className="mr-2" />
                   Entrar no Grupo da Turma
                </a>
              )}
           </div>
        )}

      </main>

      {/* PIX MODAL */}
      {showPixModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl w-full max-w-sm p-6 relative animate-modal-in">
              <button onClick={() => setShowPixModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <CloseIcon />
              </button>
              
              <div className="text-center">
                 <h3 className="text-xl font-bold text-gray-900 mb-2">Pagamento via PIX</h3>
                 <p className="text-sm text-gray-600 mb-6">Escaneie o QR Code ou copie a chave abaixo para realizar o pagamento.</p>
                 
                 <div className="bg-gray-100 w-48 h-48 mx-auto rounded-lg mb-6 flex items-center justify-center border-2 border-dashed border-gray-300">
                    <span className="text-gray-400 text-xs">QR Code Simulado</span>
                 </div>

                 <div className="bg-gray-50 p-3 rounded-lg mb-4 break-all">
                    <p className="text-xs text-gray-500 mb-1">Chave PIX (CNPJ/Aleatória)</p>
                    <p className="text-sm font-mono font-bold text-gray-800 select-all">{schoolPixKey}</p>
                 </div>

                 <button 
                  onClick={handleCopyPix}
                  className="w-full bg-brand-secondary text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                 >
                   Copiar Chave PIX
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
