import React from 'react';
// FIX: Added .tsx extension to fix module resolution error.
import { SoundWaveIcon } from './Icons.tsx';
import ThemeSwitcher from './ThemeSwitcher.tsx';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <SoundWaveIcon className="w-8 h-8 text-indigo-500" />
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Echo Wave
          </h1>
        </div>
        <ThemeSwitcher />
      </div>
    </header>
  );
};

export default Header;