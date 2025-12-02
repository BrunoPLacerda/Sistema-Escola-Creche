
import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon } from './icons';

interface LoginProps {
  onLogin: () => void;
}

type ViewState = 'login' | 'register' | 'forgot_password';

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [view, setView] = useState<ViewState>('login');
  
  // Login State
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  
  // Register State
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCpf, setRegCpf] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Recovery State
  const [recoveryEmail, setRecoveryEmail] = useState('');

  // Common State
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      // 1. Verifica credenciais hardcoded (admin)
      if (cpf === '123.456.789-00' && password === '123456') {
        onLogin();
        setIsLoading(false);
        return;
      }

      // 2. Verifica usuários cadastrados no LocalStorage
      const storedUsers = localStorage.getItem('cebe_users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      
      const foundUser = users.find((u: any) => u.cpf === cpf && u.password === password);

      if (foundUser) {
        onLogin();
      } else {
        setError('CPF ou senha inválidos. Tente novamente.');
      }
      setIsLoading(false);
    }, 800);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      // Recupera usuários existentes
      const storedUsers = localStorage.getItem('cebe_users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      // Verifica se CPF já existe
      if (users.find((u: any) => u.cpf === regCpf)) {
          setError('Este CPF já possui cadastro.');
          setIsLoading(false);
          return;
      }

      // Salva novo usuário
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
      
      // Reset form
      setRegName(''); setRegPhone(''); setRegCpf(''); setRegEmail(''); setRegPassword('');
      
      // Opcional: Já preencher o CPF no login para facilitar
      setCpf(regCpf);
      
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {/* CSS Override for Autofill Background */}
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active{
            -webkit-box-shadow: 0 0 0 30px white inset !important;
            -webkit-text-fill-color: black !important;
        }
      `}</style>
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden animate-fade-in">
        <div className="bg-brand-primary p-6 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m-9-5.747h18m-18 0a9 9 0 0118 0m-18 0a9 9 0 0018 0"></path>
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">Sistema de Gestão</h2>
            <p className="text-brand-light mt-1">
                {view === 'login' && 'Acesse sua conta para continuar'}
                {view === 'register' && 'Preencha os dados para se cadastrar'}
                {view === 'forgot_password' && 'Recupere seu acesso'}
            </p>
        </div>

        <div className="p-8">
            {successMsg && (
                <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-r">
                    <p className="text-sm text-green-700">{successMsg}</p>
                </div>
            )}

            {/* LOGIN VIEW */}
            {view === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">CPF</label>
                        <input 
                            type="text" 
                            id="cpf" 
                            value={cpf}
                            onChange={(e) => handleCpfChange(e, setCpf)}
                            required 
                            maxLength={14}
                            className="mt-1 block w-full px-4 py-2 bg-white text-black border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all"
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
                            className="block w-full px-4 py-2 bg-white text-black border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all pr-10"
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

                    <div className="flex items-center justify-end">
                    <button type="button" onClick={() => switchView('forgot_password')} className="text-sm font-medium text-brand-primary hover:text-brand-dark transition-colors">
                        Esqueceu a senha?
                    </button>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-brand-primary hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Entrando...' : 'Entrar'}
                    </button>

                    <div className="mt-6 text-center pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                            Ainda não tem acesso?{' '}
                            <button type="button" onClick={() => switchView('register')} className="font-medium text-brand-primary hover:text-brand-dark transition-colors">
                                Cadastre-se
                            </button>
                        </p>
                    </div>
                </form>
            )}

            {/* REGISTER VIEW */}
            {view === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="regName" className="block text-sm font-medium text-gray-700">Nome Completo</label>
                        <input 
                            type="text" 
                            id="regName" 
                            value={regName}
                            onChange={(e) => setRegName(e.target.value)}
                            required 
                            className="mt-1 block w-full px-4 py-2 bg-white text-black border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all"
                            placeholder="Seu nome"
                        />
                    </div>
                    <div>
                        <label htmlFor="regPhone" className="block text-sm font-medium text-gray-700">Telefone Celular</label>
                        <input 
                            type="tel" 
                            id="regPhone" 
                            value={regPhone}
                            onChange={handlePhoneChange}
                            required 
                            maxLength={15}
                            className="mt-1 block w-full px-4 py-2 bg-white text-black border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all"
                            placeholder="(00) 00000-0000"
                        />
                    </div>
                    <div>
                        <label htmlFor="regCpf" className="block text-sm font-medium text-gray-700">CPF</label>
                        <input 
                            type="text" 
                            id="regCpf" 
                            value={regCpf}
                            onChange={(e) => handleCpfChange(e, setRegCpf)}
                            required 
                            maxLength={14}
                            className="mt-1 block w-full px-4 py-2 bg-white text-black border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all"
                            placeholder="000.000.000-00"
                        />
                    </div>
                    <div>
                        <label htmlFor="regEmail" className="block text-sm font-medium text-gray-700">Email</label>
                        <input 
                            type="email" 
                            id="regEmail" 
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            required 
                            className="mt-1 block w-full px-4 py-2 bg-white text-black border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all"
                            placeholder="seu@email.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="regPassword" className="block text-sm font-medium text-gray-700">Senha</label>
                        <div className="relative mt-1">
                        <input 
                            type={showPassword ? 'text' : 'password'} 
                            id="regPassword" 
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            required 
                            className="block w-full px-4 py-2 bg-white text-black border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all pr-10"
                            placeholder="Crie uma senha"
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
                    
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-brand-primary hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors mt-4"
                    >
                        {isLoading ? 'Cadastrando...' : 'Finalizar Cadastro'}
                    </button>
                    
                    <button 
                        type="button"
                        onClick={() => switchView('login')}
                        className="w-full text-center text-sm font-medium text-gray-600 hover:text-gray-900 mt-2"
                    >
                        Voltar para Login
                    </button>
                </form>
            )}

            {/* FORGOT PASSWORD VIEW */}
            {view === 'forgot_password' && (
                <form onSubmit={handleRecoverySubmit} className="space-y-6">
                    <p className="text-sm text-gray-600 mb-4">
                        Insira o endereço de email associado à sua conta e enviaremos um link para redefinir sua senha.
                    </p>
                    <div>
                        <label htmlFor="recoveryEmail" className="block text-sm font-medium text-gray-700">Email Cadastrado</label>
                        <input 
                            type="email" 
                            id="recoveryEmail" 
                            value={recoveryEmail}
                            onChange={(e) => setRecoveryEmail(e.target.value)}
                            required 
                            className="mt-1 block w-full px-4 py-2 bg-white text-black border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all"
                            placeholder="seu@email.com"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-brand-primary hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors"
                    >
                        {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                    </button>

                    <button 
                        type="button"
                        onClick={() => switchView('login')}
                        className="w-full text-center text-sm font-medium text-gray-600 hover:text-gray-900 mt-4"
                    >
                        Voltar para Login
                    </button>
                </form>
            )}

        </div>
      </div>
    </div>
  );
};
