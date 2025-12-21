
import React, { useState } from 'react';
import { Student, Course, PaymentStatus, CalendarEvent } from '../types';
import { LogoutIcon, BankIcon, BellIcon, WhatsAppIcon, CloseIcon } from './icons';

interface ParentPortalProps {
  student: Student;
  course: Course | undefined;
  events: CalendarEvent[];
  schoolPixKey: string;
  onLogout: () => void;
}

export const ParentPortal: React.FC<ParentPortalProps> = ({ student, course, events, schoolPixKey, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'financial' | 'communications'>('financial');
  const [showPixModal, setShowPixModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);

  const handleCopyPix = () => {
    navigator.clipboard.writeText(schoolPixKey);
    alert('Chave PIX (CNPJ) copiada! Cole no aplicativo do seu banco para realizar o pagamento.');
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
          <button onClick={onLogout} title="Sair do Portal" className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors">
            <LogoutIcon className="w-5 h-5 text-white" />
          </button>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex justify-between mt-8 bg-white/10 p-1 rounded-xl backdrop-blur-sm">
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
        
        {/* TAB FINANCEIRO */}
        {activeTab === 'financial' && (
          <div className="space-y-6 animate-fade-in">
             <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-start mb-4">
                    <BankIcon className="w-6 h-6 text-brand-primary mt-1 mr-3 flex-shrink-0" />
                    <div>
                        <h3 className="font-bold text-gray-800 text-lg">Mensalidade Escolar</h3>
                        <p className="text-sm text-gray-500 mt-1">Valor do curso: <strong className="text-gray-900">{course?.tuitionFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></p>
                    </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-sm font-medium text-gray-600">Status do Pagamento</span>
                    <span className={`px-3 py-1 rounded-lg text-sm font-bold ${getStatusColor(student.paymentStatus)}`}>
                        {student.paymentStatus}
                    </span>
                </div>
             </div>

             {student.paymentStatus !== PaymentStatus.Paid && (
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Botão PIX */}
                    <button 
                        onClick={() => setShowPixModal(true)}
                        className="bg-brand-primary text-white p-4 rounded-xl font-bold shadow-lg shadow-brand-primary/20 hover:brightness-110 active:scale-95 transition-all flex flex-col items-center justify-center gap-2"
                    >
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                        </svg>
                        <span>Pagar com PIX</span>
                        <span className="text-[10px] opacity-80 font-normal">Chave CNPJ</span>
                    </button>

                    {/* Botão Cartão */}
                    <button 
                        onClick={() => setShowCardModal(true)}
                        className="bg-brand-secondary text-white p-4 rounded-xl font-bold shadow-lg shadow-brand-secondary/20 hover:brightness-110 active:scale-95 transition-all flex flex-col items-center justify-center gap-2"
                    >
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <span>Cartão de Crédito</span>
                        <span className="text-[10px] opacity-80 font-normal">Até 12x no Portal</span>
                    </button>
               </div>
             )}

             <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-4">Histórico de Mensalidades</h3>
                <div className="space-y-3">
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
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                 <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <BellIcon className="w-5 h-5 mr-2 text-brand-primary"/>
                    Quadro de Avisos
                 </h3>
                 
                 {events.length === 0 ? (
                   <p className="text-gray-500 text-sm italic">Sem avisos ou eventos agendados no momento.</p>
                 ) : (
                   <div className="space-y-3">
                     {events.slice(0, 5).map(evt => (
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
                  className="block bg-[#25D366] text-white p-4 rounded-xl font-bold shadow-md hover:bg-[#128C7E] transition-all flex items-center justify-center active:scale-95"
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
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
           <div className="bg-white rounded-3xl w-full max-w-sm p-8 relative animate-modal-in shadow-2xl">
              <button onClick={() => setShowPixModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 p-1">
                <CloseIcon />
              </button>
              
              <div className="text-center">
                 <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-2">Pagamento via PIX</h3>
                 <p className="text-sm text-gray-600 mb-6 italic">Utilize a chave CNPJ abaixo para realizar a transferência no seu banco.</p>
                 
                 <div className="bg-white border-2 border-brand-primary/20 p-4 rounded-2xl mb-6 shadow-inner">
                    <p className="text-[10px] text-brand-primary font-bold uppercase tracking-wider mb-2">Chave PIX (CNPJ)</p>
                    <p className="text-lg font-mono font-bold text-gray-800 select-all tracking-tight">{schoolPixKey}</p>
                 </div>

                 <button 
                  onClick={handleCopyPix}
                  className="w-full bg-brand-primary text-white py-4 rounded-xl font-bold hover:brightness-110 transition-all shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2"
                 >
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                   Copiar Chave CNPJ
                 </button>
                 
                 <p className="text-[10px] text-gray-400 mt-4">Após o pagamento, o sistema processará a baixa em até 24h úteis.</p>
              </div>
           </div>
        </div>
      )}

      {/* CARD MODAL (Simulado) */}
      {showCardModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
           <div className="bg-white rounded-3xl w-full max-w-sm p-8 relative animate-modal-in shadow-2xl">
              <button onClick={() => setShowCardModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 p-1">
                <CloseIcon />
              </button>
              
              <div className="text-center">
                 <div className="w-16 h-16 bg-brand-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-brand-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-2">Cartão de Crédito</h3>
                 <p className="text-sm text-gray-600 mb-6">Pague em até 12x com segurança. Você será redirecionado para o ambiente de pagamento.</p>
                 
                 <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Valor da Mensalidade:</span>
                        <span className="font-bold text-gray-800">{course?.tuitionFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Taxa de Processamento:</span>
                        <span className="font-bold text-green-600">R$ 0,00</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold text-lg">
                        <span className="text-gray-800">Total:</span>
                        <span className="text-brand-primary">{course?.tuitionFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    </div>
                 </div>

                 <button 
                  onClick={() => {
                    alert('Redirecionando para o Checkout Seguro...');
                    setShowCardModal(false);
                  }}
                  className="w-full bg-brand-secondary text-white py-4 rounded-xl font-bold hover:brightness-110 transition-all shadow-lg shadow-brand-secondary/20"
                 >
                   Prosseguir para Pagamento
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
