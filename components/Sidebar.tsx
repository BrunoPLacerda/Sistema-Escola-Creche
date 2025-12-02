
import React from 'react';
import { Page } from '../types';
import { DashboardIcon, StudentsIcon, CoursesIcon, CloseIcon, BankIcon, BellIcon, ReportIcon, TeachersIcon, CalendarIcon, LogoutIcon, ReceiptIcon } from './icons';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  onLogout: () => void;
}

const NavItem: React.FC<{
  page: Page;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  setOpen: (isOpen: boolean) => void;
  icon: React.ReactNode;
  label: string;
}> = ({ page, currentPage, setCurrentPage, setOpen, icon, label }) => {
  const isActive = currentPage === page;
  return (
    <li
      onClick={() => {
        setCurrentPage(page);
        setOpen(false);
      }}
      className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors duration-200 ${
        isActive
          ? 'bg-brand-primary text-white shadow-lg'
          : 'text-gray-600 hover:bg-brand-light hover:text-brand-dark'
      }`}
    >
      {icon}
      <span className="ml-3 font-medium">{label}</span>
    </li>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, isOpen, setOpen, onLogout }) => {
  const sidebarClasses = `
    fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
    lg:relative lg:translate-x-0 lg:shadow-none flex flex-col justify-between
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  `;

  return (
    <>
      <div className={sidebarClasses}>
        <div>
            <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:justify-center">
            <h1 className="text-2xl font-bold text-brand-primary">Gestão Escolar</h1>
            <button onClick={() => setOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-800">
                <CloseIcon />
            </button>
            </div>
            <nav className="p-4">
            <ul>
                <NavItem page="dashboard" currentPage={currentPage} setCurrentPage={setCurrentPage} setOpen={setOpen} icon={<DashboardIcon />} label="Painel" />
                <NavItem page="students" currentPage={currentPage} setCurrentPage={setCurrentPage} setOpen={setOpen} icon={<StudentsIcon />} label="Alunos" />
                <NavItem page="teachers" currentPage={currentPage} setCurrentPage={setCurrentPage} setOpen={setOpen} icon={<TeachersIcon />} label="Professores" />
                <NavItem page="courses" currentPage={currentPage} setCurrentPage={setCurrentPage} setOpen={setOpen} icon={<CoursesIcon />} label="Cursos" />
                <NavItem page="calendar" currentPage={currentPage} setCurrentPage={setCurrentPage} setOpen={setOpen} icon={<CalendarIcon />} label="Calendário" />
                <NavItem page="financial" currentPage={currentPage} setCurrentPage={setCurrentPage} setOpen={setOpen} icon={<BankIcon />} label="Financeiro" />
                 <NavItem page="receipts" currentPage={currentPage} setCurrentPage={setCurrentPage} setOpen={setOpen} icon={<ReceiptIcon />} label="Recibos" />
                <NavItem page="communications" currentPage={currentPage} setCurrentPage={setCurrentPage} setOpen={setOpen} icon={<BellIcon />} label="Comunicados" />
                <NavItem page="reports" currentPage={currentPage} setCurrentPage={setCurrentPage} setOpen={setOpen} icon={<ReportIcon />} label="Relatórios" />
            </ul>
            </nav>
        </div>
        <div className="p-4 border-t border-gray-200">
            <button 
                onClick={onLogout}
                className="flex items-center w-full p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200"
            >
                <LogoutIcon />
                <span className="ml-3 font-medium">Sair</span>
            </button>
        </div>
      </div>
       {isOpen && <div onClick={() => setOpen(false)} className="fixed inset-0 bg-black opacity-50 z-20 lg:hidden"></div>}
    </>
  );
};
