import React from 'react';
import { LanguageOption } from '../types';

interface LanguageSelectorProps {
  languages: LanguageOption[];
  selectedLanguage: LanguageOption;
  onSelectLanguage: (language: LanguageOption) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ languages, selectedLanguage, onSelectLanguage }) => {
  return (
    <div>
      <label htmlFor="language-selector" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Language
      </label>
      <select
        id="language-selector"
        value={selectedLanguage.code}
        onChange={(e) => {
          const lang = languages.find((l) => l.code === e.target.value);
          if (lang) {
            onSelectLanguage(lang);
          }
        }}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.displayName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
