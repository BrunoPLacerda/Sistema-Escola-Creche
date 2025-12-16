
import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon, StudentsIcon, DashboardIcon } from './icons';
import { UserRole, Student } from '../types';

interface LoginProps {
  onLogin: (role: UserRole, linkedStudentId?: string) => void;
  students: Student[];
}

type ViewState = 'login' | 'register' | 'forgot_password' | 'guardian_register';
type LoginTab = 'guardian' | 'admin';

export const Login: React.FC<LoginProps> = ({ onLogin, students }) => {
  const [view, setView] = useState<ViewState>('login');
  const [activeTab, setActiveTab] = useState<LoginTab>('guardian');
  
  // Login State
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  
  // Register State (Admin only)
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCpf, setRegCpf] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Guardian First Access State
  const [gRegCpf, setGRegCpf] = useState('');
  const [gRegEmail, setGRegEmail] = useState('');
  const [gRegPassword, setGRegPassword] = useState('');
  const [gRegConfirmPassword, setGRegConfirmPassword] = useState('');

  // Recovery State
  const [recoveryEmail, setRecoveryEmail] = useState('');

  // Common State
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Helper: Remove non-digits for comparison
  const cleanCpf = (value: string) => value.replace(/\D/g, '');

  // Mask Functions
  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  // Handlers
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    setter(formatCPF(e.target.value));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegPhone(formatPhone(e.target.value));
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      // LÓGICA PARA ADMINISTRADOR
      if (activeTab === 'admin') {
          // 1. Verifica Admin (Hardcoded)
          if (cleanCpf(cpf) === '12345678900' && password === '123456') {
            onLogin('admin');
            setIsLoading(false);
            return;
          }

          // 2. Verifica Admin (LocalStorage)
          const storedUsers = localStorage.getItem('cebe_users');
          const users = storedUsers ? JSON.parse(storedUsers) : [];
          const foundAdmin = users.find((u: any) => cleanCpf(u.cpf) === cleanCpf(cpf) && u.password === password);

          if (foundAdmin) {
            onLogin('admin');
            setIsLoading(false);
            return;
          }
          
          setError('Credenciais administrativas inválidas.');
      } 
      // LÓGICA PARA RESPONSÁVEL (PAIS)
      else {
          // 1. Verifica se existe cadastro de senha personalizado (LocalStorage)
          const storedGuardians = localStorage.getItem('cebe_guardians');
          const guardians = storedGuardians ? JSON.parse(storedGuardians) : [];
          
          // Busca usando cleanCpf para garantir compatibilidade
          const registeredGuardian = guardians.find((g: any) => cleanCpf(g.cpf) === cleanCpf(cpf));
          const foundStudent = students.find(s => cleanCpf(s.guardianCpf) === cleanCpf(cpf));
          
          if (foundStudent) {
              let isAuthenticated = false;

              // Se o usuário já criou senha, usa a senha criada
              if (registeredGuardian) {
                  if (registeredGuardian.password === password) {
                      isAuthenticated = true;
                  } else {
                      setError('Senha incorreta.');
                      setIsLoading(false);
                      return;
                  }
              } 
              // Fallback para senha padrão (caso não tenha criado senha ainda)
              else {
                  const defaultPass = cleanCpf(cpf).substring(0, 6);
                  if (password === '123456' || password === defaultPass) {
                      isAuthenticated = true;
                  } else {
                     setError(`Senha incorreta. Se for seu primeiro acesso, clique em "Criar Senha".`);
                     setIsLoading(false);
                     return;
                  }
              }

              if (isAuthenticated) {
                  onLogin('guardian', foundStudent.id);
                  setIsLoading(false);
                  return;
              }
          } else {
              setError('CPF do responsável não encontrado na base de alunos.');
          }
      }

      if (!error) setError('Acesso negado. Verifique seus dados.'); // Fallback error
      setIsLoading(false);
    }, 800);
  };

  // Cadastro de Admin (Existente)
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const storedUsers = localStorage.getItem('cebe_users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      if (users.find((u: any) => cleanCpf(u.cpf) === cleanCpf(regCpf))) {
          setError('Este CPF já possui cadastro administrativo.');
          setIsLoading(false);
          return;
      }

      const newUser = {
          name: regName,
          phone: regPhone,
          cpf: regCpf,
          email: regEmail,
          password: regPassword
      };

      users.push(newUser);
      localStorage.setItem('cebe_users', JSON.stringify(users));

      setIsLoading(false);
      setSuccessMsg('Cadastro realizado com sucesso! Faça login.');
      
      setRegName(''); setRegPhone(''); setRegCpf(''); setRegEmail(''); setRegPassword('');
      setCpf(regCpf);
      setView('login');
    }, 1000);
  };

  // NOVO: Cadastro de Senha do Responsável (Primeiro Acesso)
  const handleGuardianRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (gRegPassword !== gRegConfirmPassword) {
        setError('As senhas não conferem.');
        setIsLoading(false);
        return;
    }

    setTimeout(() => {
        // 1. Verifica se o CPF existe na base da escola (Passada via props) - COMPARAÇÃO ROBUSTA (Apenas Números)
        const isRegisteredByAdmin = students.some(s => cleanCpf(s.guardianCpf) === cleanCpf(gRegCpf));

        if (!isRegisteredByAdmin) {
            setError('CPF não identificado. Por favor, procure a administração para verificação.');
            setIsLoading(false);
            return;
        }

        // 2. Verifica se já possui senha criada
        const storedGuardians = localStorage.getItem('cebe_guardians');
        const guardians = storedGuardians ? JSON.parse(storedGuardians) : [];
        
        const existingIndex = guardians.findIndex((g: any) => cleanCpf(g.cpf) === cleanCpf(gRegCpf));

        const newGuardianCreds = {
            cpf: gRegCpf,
            email: gRegEmail,
            password: gRegPassword
        };

        if (existingIndex >= 0) {
            // Atualiza senha existente
            guardians[existingIndex] = newGuardianCreds;
        } else {
            // Cria novo registro
            guardians.push(newGuardianCreds);
        }

        localStorage.setItem('cebe_guardians', JSON.stringify(guardians));

        setIsLoading(false);
        setSuccessMsg('Senha criada com sucesso! Você já pode acessar o portal.');
        
        // Limpa campos e volta pro login
        setGRegCpf(''); setGRegEmail(''); setGRegPassword(''); setGRegConfirmPassword('');
        setCpf(gRegCpf); // Preenche o CPF no login automaticamente
        setView('login');
    }, 1000);
  };

  const handleRecoverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg(`Instruções de recuperação enviadas para ${recoveryEmail}`);
      setRecoveryEmail('');
      setTimeout(() => {
          setSuccessMsg('');
          setView('login');
      }, 3000);
    }, 1000);
  };

  const switchView = (newView: ViewState) => {
    setView(newView);
    setError('');
    setSuccessMsg('');
    setShowPassword(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-light to-gray-200 p-4 font-sans">
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active{
            -webkit-box-shadow: 0 0 0 30px white inset !important;
            -webkit-text-fill-color: black !important;
        }
      `}</style>
      
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in relative">
        
        {/* LOGO HEADER */}
        <div className="bg-white p-6 pb-2 text-center border-b border-gray-100">
             <div className="flex justify-center mb-2">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center">
                   <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M70 85H30V70C30 65 35 60 40 60V40C35 40 30 35 30 25C30 15 40 5 50 5C60 5 70 15 70 25C70 35 65 40 60 40V60C65 60 70 65 70 70V85Z" fill="#5DA463" />
                        <circle cx="45" cy="20" r="3" fill="#FFF"/>
                        <circle cx="55" cy="20" r="3" fill="#FFF"/>
                   </svg>
                </div>
             </div>
             <h2 className="text-xl font-bold text-gray-800">Portal CEBE</h2>
             <p className="text-xs text-gray-500 uppercase tracking-wide">Sistema de Gestão Escolar</p>
        </div>

        {/* VIEW LOGIN: TABS */}
        {view === 'login' && (
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => { setActiveTab('guardian'); setError(''); setCpf(''); setPassword(''); }}
              className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center transition-colors ${
                activeTab === 'guardian' 
                  ? 'text-brand-secondary border-b-2 border-brand-secondary bg-orange-50/50' 
                  : 'text-gray-500 hover:text-gray-700 bg-gray-50'
              }`}
            >
              <StudentsIcon className="w-5 h-5 mr-2" />
              Área da Família
            </button>
            <button
              onClick={() => { setActiveTab('admin'); setError(''); setCpf(''); setPassword(''); }}
              className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center transition-colors ${
                activeTab === 'admin' 
                  ? 'text-brand-primary border-b-2 border-brand-primary bg-green-50/50' 
                  : 'text-gray-500 hover:text-gray-700 bg-gray-50'
              }`}
            >
              <DashboardIcon className="w-5 h-5 mr-2" />
              Administração
            </button>
          </div>
        )}

        {/* VIEW REGISTER HEADER (ADMIN) */}
        {view === 'register' && (
           <div className="bg-brand-primary p-4 text-white text-center">
              <h3 className="font-bold">Novo Cadastro Administrativo</h3>
           </div>
        )}

        {/* VIEW GUARDIAN REGISTER HEADER */}
        {view === 'guardian_register' && (
           <div className="bg-brand-secondary p-4 text-white text-center">
              <h3 className="font-bold">Primeiro Acesso - Responsável</h3>
              <p className="text-xs opacity-90">Crie sua senha para acessar o portal</p>
           </div>
        )}

        {/* VIEW RECOVERY HEADER */}
        {view === 'forgot_password' && (
           <div className="bg-gray-700 p-4 text-white text-center">
              <h3 className="font-bold">Recuperar Acesso</h3>
           </div>
        )}

        <div className="p-8 pt-6">
            {successMsg && (
                <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-r animate-fade-in">
                    <p className="text-sm text-green-700">{successMsg}</p>
                </div>
            )}

            {/* LOGIN FORM */}
            {view === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-5">
                    
                    <div className="text-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800">
                           {activeTab === 'guardian' ? 'Bem-vindo, Responsável!' : 'Acesso Restrito'}
                        </h3>
                        <p className="text-sm text-gray-500">
                           {activeTab === 'guardian' 
                              ? 'Digite seu CPF para acompanhar o aluno.' 
                              : 'Entre com suas credenciais institucionais.'}
                        </p>
                    </div>

                    <div>
                        <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">CPF</label>
                        <input 
                            type="text" 
                            id="cpf" 
                            value={cpf}
                            onChange={(e) => handleCpfChange(e, setCpf)}
                            required 
                            maxLength={14}
                            className={`mt-1 block w-full px-4 py-3 bg-white text-black border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all ${activeTab === 'guardian' ? 'focus:ring-brand-secondary border-brand-secondary/30' : 'focus:ring-brand-primary border-brand-primary/30'} border-gray-300`}
                            placeholder="000.000.000-00"
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
                        <div className="relative mt-1">
                        <input 
                            type={showPassword ? 'text' : 'password'} 
                            id="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                            className={`block w-full px-4 py-3 bg-white text-black border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all pr-10 ${activeTab === 'guardian' ? 'focus:ring-brand-secondary border-brand-secondary/30' : 'focus:ring-brand-primary border-brand-primary/30'} border-gray-300`}
                            placeholder="••••••"
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                            {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                        </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                         {activeTab === 'guardian' ? (
                            <button type="button" onClick={() => switchView('guardian_register')} className="text-sm font-bold text-brand-secondary hover:underline">
                                Primeiro acesso? Criar Senha
                            </button>
                         ) : <div></div>}

                        <button type="button" onClick={() => switchView('forgot_password')} className="text-sm font-medium text-gray-500 hover:text-gray-800 hover:underline transition-colors">
                            Esqueceu a senha?
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r flex items-start mt-2">
                            <svg className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                           activeTab === 'guardian' 
                             ? 'bg-brand-secondary hover:bg-orange-600 focus:ring-brand-secondary' 
                             : 'bg-brand-primary hover:bg-brand-dark focus:ring-brand-primary'
                        }`}
                    >
                        {isLoading ? 'Autenticando...' : activeTab === 'guardian' ? 'Acessar Portal do Aluno' : 'Acessar Painel Admin'}
                    </button>

                    {/* Footer Links - Only for Admin Tab */}
                    {activeTab === 'admin' && (
                      <div className="mt-6 text-center pt-4 border-t border-gray-100">
                          <p className="text-sm text-gray-600">
                              Não possui acesso?{' '}
                              <button type="button" onClick={() => switchView('register')} className="font-bold text-brand-primary hover:text-brand-dark transition-colors">
                                  Cadastrar Equipe
                              </button>
                          </p>
                      </div>
                    )}
                </form>
            )}

            {/* REGISTER FORM (ADMIN ONLY) */}
            {view === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    <div className="bg-yellow-50 p-2 text-xs text-yellow-700 rounded mb-2 border border-yellow-200">
                        Área restrita para novos administradores e professores.
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
                        <input type="text" value={regName} onChange={(e) => setRegName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Telefone</label>
                        <input type="tel" value={regPhone} onChange={handlePhoneChange} required maxLength={15} className="mt-1 block w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">CPF</label>
                        <input type="text" value={regCpf} onChange={(e) => handleCpfChange(e, setRegCpf)} required maxLength={14} className="mt-1 block w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Senha</label>
                        <input type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary" />
                    </div>
                    
                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <button type="submit" disabled={isLoading} className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-dark focus:outline-none">
                        {isLoading ? 'Cadastrando...' : 'Finalizar Cadastro'}
                    </button>
                    
                    <button type="button" onClick={() => switchView('login')} className="w-full text-center text-sm font-medium text-gray-600 hover:text-gray-900 mt-2">
                        Voltar
                    </button>
                </form>
            )}

            {/* GUARDIAN REGISTER FORM (PRIMEIRO ACESSO) */}
            {view === 'guardian_register' && (
                <form onSubmit={handleGuardianRegisterSubmit} className="space-y-4">
                    <p className="text-sm text-gray-600 text-center mb-4">Confirme seu CPF para criar sua senha de acesso.</p>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">CPF do Responsável</label>
                        <input 
                            type="text" 
                            value={gRegCpf} 
                            onChange={(e) => handleCpfChange(e, setGRegCpf)} 
                            required 
                            maxLength={14} 
                            className="mt-1 block w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-md shadow-sm focus:ring-brand-secondary focus:border-brand-secondary" 
                            placeholder="000.000.000-00"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email para Contato</label>
                        <input 
                            type="email" 
                            value={gRegEmail} 
                            onChange={(e) => setGRegEmail(e.target.value)} 
                            required 
                            className="mt-1 block w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-md shadow-sm focus:ring-brand-secondary focus:border-brand-secondary" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Crie uma Senha</label>
                        <input 
                            type="password" 
                            value={gRegPassword} 
                            onChange={(e) => setGRegPassword(e.target.value)} 
                            required 
                            className="mt-1 block w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-md shadow-sm focus:ring-brand-secondary focus:border-brand-secondary" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Confirme a Senha</label>
                        <input 
                            type="password" 
                            value={gRegConfirmPassword} 
                            onChange={(e) => setGRegConfirmPassword(e.target.value)} 
                            required 
                            className="mt-1 block w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-md shadow-sm focus:ring-brand-secondary focus:border-brand-secondary" 
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r flex items-start">
                            <svg className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <button type="submit" disabled={isLoading} className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-secondary hover:bg-orange-600 focus:outline-none">
                        {isLoading ? 'Verificando...' : 'Cadastrar Senha'}
                    </button>
                    
                    <button type="button" onClick={() => switchView('login')} className="w-full text-center text-sm font-medium text-gray-600 hover:text-gray-900 mt-2">
                        Voltar para Login
                    </button>
                </form>
            )}

            {/* FORGOT PASSWORD FORM */}
            {view === 'forgot_password' && (
                <form onSubmit={handleRecoverySubmit} className="space-y-6">
                    <p className="text-sm text-gray-600">Informe seu e-mail para receber as instruções de redefinição.</p>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email Cadastrado</label>
                        <input type="email" value={recoveryEmail} onChange={(e) => setRecoveryEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-md shadow-sm focus:ring-brand-secondary focus:border-brand-secondary" />
                    </div>

                    <button type="submit" disabled={isLoading} className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none">
                        {isLoading ? 'Enviando...' : 'Enviar Link'}
                    </button>

                    <button type="button" onClick={() => switchView('login')} className="w-full text-center text-sm font-medium text-gray-600 hover:text-gray-900 mt-4">
                        Voltar
                    </button>
                </form>
            )}

        </div>
      </div>
    </div>
  );
};
