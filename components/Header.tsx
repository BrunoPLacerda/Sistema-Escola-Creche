
import React from 'react';
import { MenuIcon } from './icons';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md">
      <button onClick={onMenuClick} className="text-gray-500 focus:outline-none lg:hidden">
        <MenuIcon />
      </button>
      <h2 className="text-xl md:text-2xl font-semibold text-gray-700">{title}</h2>
      <div className="w-8"></div>
    </header>
  );
};
