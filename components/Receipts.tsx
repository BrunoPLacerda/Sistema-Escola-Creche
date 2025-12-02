import React, { useState, useRef, useEffect } from 'react';
import { Student, Course } from '../types';
import { ReceiptIcon } from './icons';

interface ReceiptsProps {
  students: Student[];
  courses: Course[];
}

export const Receipts: React.FC<ReceiptsProps> = ({ students, courses }) => {
  // State for form fields
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [payerName, setPayerName] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [amountInWords, setAmountInWords] = useState('');
  const [referenceMonth, setReferenceMonth] = useState('novembro');
  const [referenceYear, setReferenceYear] = useState(new Date().getFullYear().toString());
  const [studentName, setStudentName] = useState('');
  const [courseName, setCourseName] = useState('');
  const [shift, setShift] = useState('integral'); // turno
  const [day, setDay] = useState(new Date().getDate().toString().padStart(2, '0'));
  
  const receiptRef = useRef<HTMLDivElement>(null);

  // When student is selected, auto-fill some data
  const handleStudentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sId = e.target.value;
    setSelectedStudentId(sId);
    
    const student = students.find(s => s.id === sId);
    if (student) {
      setStudentName(student.name);
      setPayerName(student.name); // Default to student, user can change to parent
      
      const course = courses.find(c => c.id === student.enrolledCourseId);
      if (course) {
        setCourseName(course.name);
        setAmount(course.tuitionFee.toFixed(2));
      }
    } else {
      setStudentName('');
      setPayerName('');
      setAmount('');
      setCourseName('');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const months = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];

  return (
    <div className="animate-fade-in flex flex-col lg:flex-row gap-6">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #receipt-area, #receipt-area * {
            visibility: visible;
          }
          #receipt-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 40px;
            background: white;
            border: none;
            display: flex;
            flex-direction: column;
            justify-content: center; /* Centraliza verticalmente na folha se desejar, ou 'flex-start' */
          }
          .no-print {
            display: none !important;
          }
          /* Ajuste para garantir que o background das inputs/divs apareça se necessário, 
             embora aqui estejamos usando texto puro para impressão */
          -webkit-print-color-adjust: exact;
        }
      `}</style>

      {/* Configuration Form */}
      <div className="w-full lg:w-1/3 bg-white p-6 rounded-xl shadow-lg h-fit no-print overflow-y-auto max-h-[90vh]">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Dados do Recibo</h3>
        
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Selecione o Aluno (Preenchimento Automático)</label>
            <select 
              value={selectedStudentId} 
              onChange={handleStudentChange}
              className="mt-1 block w-full p-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary text-sm"
            >
              <option value="">Selecione...</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div className="border-t pt-4 mt-4">
             <h4 className="text-sm font-bold text-gray-600 mb-3 uppercase">Campos do Recibo</h4>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Recebemos de (Pagador)</label>
            <input 
              type="text" 
              value={payerName} 
              onChange={(e) => setPayerName(e.target.value)}
              className="mt-1 block w-full p-2 bg-white text-gray-900 border border-gray-300 rounded-md text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Valor (R$)</label>
                <input 
                type="text" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1.100,00"
                className="mt-1 block w-full p-2 bg-white text-gray-900 border border-gray-300 rounded-md text-sm"
                />
            </div>
            <div>
                 <label className="block text-sm font-medium text-gray-700">Ano</label>
                 <input 
                  type="text"
                  value={referenceYear}
                  onChange={(e) => setReferenceYear(e.target.value)}
                  className="mt-1 block w-full p-2 bg-white text-gray-900 border border-gray-300 rounded-md text-sm"
                 />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Valor por Extenso</label>
            <input 
              type="text" 
              value={amountInWords} 
              onChange={(e) => setAmountInWords(e.target.value)}
              placeholder="Ex: Um mil e cem reais"
              className="mt-1 block w-full p-2 bg-white text-gray-900 border border-gray-300 rounded-md text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-700">Mês de Referência</label>
                <select 
                    value={referenceMonth} 
                    onChange={(e) => setReferenceMonth(e.target.value)}
                    className="mt-1 block w-full p-2 bg-white text-gray-900 border border-gray-300 rounded-md text-sm"
                >
                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Dia (Data Assinatura)</label>
                <input 
                  type="text"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  className="mt-1 block w-full p-2 bg-white text-gray-900 border border-gray-300 rounded-md text-sm"
                />
             </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nome do Aluno</label>
            <input 
              type="text" 
              value={studentName} 
              onChange={(e) => setStudentName(e.target.value)}
              className="mt-1 block w-full p-2 bg-white text-gray-900 border border-gray-300 rounded-md text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-700">Turma / Curso</label>
                <input 
                  type="text" 
                  value={courseName} 
                  onChange={(e) => setCourseName(e.target.value)}
                  className="mt-1 block w-full p-2 bg-white text-gray-900 border border-gray-300 rounded-md text-sm"
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Turno</label>
                <select 
                    value={shift} 
                    onChange={(e) => setShift(e.target.value)}
                    className="mt-1 block w-full p-2 bg-white text-gray-900 border border-gray-300 rounded-md text-sm"
                >
                    <option value="matutino">Matutino</option>
                    <option value="vespertino">Vespertino</option>
                    <option value="integral">Integral</option>
                </select>
             </div>
          </div>

          <button 
            onClick={handlePrint}
            className="w-full flex items-center justify-center mt-6 py-3 px-4 bg-brand-primary text-white rounded-lg hover:bg-brand-dark transition-colors shadow-md font-medium"
          >
            <ReceiptIcon className="mr-2" />
            Imprimir Recibo
          </button>
        </form>
      </div>

      {/* Receipt Preview Area */}
      <div className="w-full lg:w-2/3 bg-gray-200 p-8 rounded-xl flex justify-center items-start overflow-auto">
        <div 
            id="receipt-area"
            ref={receiptRef}
            className="bg-white p-12 w-full max-w-[850px] shadow-lg text-black font-sans relative"
            style={{ minHeight: '1000px' }} // Altura aproximada A4
        >
            {/* Header */}
            <div className="flex flex-col items-center text-center mb-12">
                {/* Logo Placeholder - Girafa */}
                 <div className="mb-4 opacity-80">
                    <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M70 85H30V70C30 65 35 60 40 60V40C35 40 30 35 30 25C30 15 40 5 50 5C60 5 70 15 70 25C70 35 65 40 60 40V60C65 60 70 65 70 70V85Z" fill="#E58E73" />
                        <circle cx="45" cy="20" r="3" fill="#FFF"/>
                        <circle cx="55" cy="20" r="3" fill="#FFF"/>
                        <path d="M40 30 Q50 35 60 30" stroke="#FFF" strokeWidth="2" fill="none"/>
                        <circle cx="40" cy="50" r="4" fill="#C96E55"/>
                        <circle cx="60" cy="70" r="5" fill="#C96E55"/>
                    </svg>
                </div>

                <h1 className="text-xl font-bold tracking-widest text-gray-900 mb-1">C E B E</h1>
                <h2 className="text-lg font-bold text-gray-900 mb-2">CENTRO DE EDUCAÇÃO BRINCANDO E EDUCANDO</h2>
                <p className="text-xs font-bold text-gray-800 mb-2">CNPJ-42.882.025/0001-06</p>
                
                <div className="text-sm text-gray-800 font-semibold space-y-1">
                    <p>EDUCAÇÃO INFANTIL BRINCANDO E EDUCANDO LTDA.</p>
                    <p>Rua Carlos de Lacerda, 285 – Centro</p>
                    <p>Campos dos Goytacazes – RJ</p>
                    <p>CEP 28010-241</p>
                    <p className="mt-2">Tel.: (22) 999 323451</p>
                </div>
            </div>

            {/* Title */}
            <div className="text-center mb-10">
                <h3 className="text-lg font-bold text-gray-900 uppercase underline decoration-2 underline-offset-4">
                    RECIBO DE PAGAMENTO DE MENSALIDADE ESCOLAR
                </h3>
            </div>

            {/* Body */}
            <div className="text-lg leading-loose text-justify text-gray-900 px-4">
                <p>
                    Recebemos do Sr(a) <span className="font-handwriting font-bold px-2 inline-block border-b border-gray-800 min-w-[300px] text-center">{payerName}</span> a
                    importância de R$ <span className="font-handwriting font-bold px-2 inline-block border-b border-gray-800 min-w-[100px] text-center">{amount}</span> (<span className="font-handwriting font-bold px-2 inline-block border-b border-gray-800 min-w-[300px] text-center">{amountInWords}</span>),
                    referente ao pagamento da mensalidade escolar do mês de <span className="font-handwriting font-bold px-2 inline-block border-b border-gray-800 min-w-[150px] text-center">{referenceMonth}</span>
                    do aluno(a) <span className="font-handwriting font-bold px-2 inline-block border-b border-gray-800 min-w-[350px] text-center">{studentName}</span>
                    que está matriculado
                    (a) na turma do <span className="font-handwriting font-bold px-2 inline-block border-b border-gray-800 min-w-[150px] text-center">{courseName}</span> no turno <span className="font-handwriting font-bold px-2 inline-block border-b border-gray-800 min-w-[100px] text-center">{shift}</span> do ano de <span className="font-handwriting font-bold px-2 inline-block border-b border-gray-800 min-w-[60px] text-center">{referenceYear}</span>.
                </p>
            </div>

            {/* Date */}
            <div className="mt-16 text-center text-lg text-gray-900">
                <p>
                    Campos dos Goytacazes <span className="font-handwriting font-bold px-2 border-b border-gray-800">{day}</span> de <span className="font-handwriting font-bold px-2 border-b border-gray-800">{referenceMonth}</span> de <span className="font-handwriting font-bold px-2 border-b border-gray-800">{referenceYear}</span>.
                </p>
            </div>

            {/* Signature Area */}
            <div className="mt-24 flex justify-center">
                <div className="text-center">
                     {/* Fake Signature */}
                    <div className="font-handwriting text-3xl mb-1 text-blue-900 -rotate-2 relative top-4">Verônica M. A. Gomes</div>
                    <div className="w-80 border-t border-gray-800 mb-2"></div>
                    <p className="font-bold text-sm text-gray-800 uppercase">Administrativo</p>
                </div>
            </div>

            {/* Footer Left Box */}
            <div className="absolute bottom-12 left-12 border-2 border-gray-800 p-2 text-center w-64 hidden print:block">
                <p className="text-lg font-bold border-b border-gray-800 mb-1">42.882.025/0001-06</p>
                <p className="text-xs font-bold leading-tight">EDUCAÇÃO INFANTIL BRINCANDO E EDUCANDO LTDA.</p>
                <p className="text-[10px] mt-2 leading-tight">
                    RUA CARLOS DE LACERDA, 285<br/>
                    CENTRO - CEP 28010-241
                </p>
                <div className="mt-2 border-t border-gray-800 pt-1">
                     <p className="text-xs font-bold">CAMPOS DOS GOYTACAZES-RJ</p>
                </div>
            </div>

            {/* Visual Helper for "Handwriting" font simulation without external dependency */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&display=swap');
                .font-handwriting {
                    font-family: 'Caveat', cursive, 'Comic Sans MS', sans-serif;
                    color: #1e3a8a; /* Azul caneta */
                }
            `}</style>
        </div>
      </div>
    </div>
  );
};