import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 mt-auto">
      <div className="container mx-auto px-4 py-4 text-center text-gray-500 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} Echo Wave. All rights reserved.</p>
        <p className="text-sm mt-1">
          Powered by Google Gemini API.
        </p>
      </div>
    </footer>
  );
};

export default Footer;