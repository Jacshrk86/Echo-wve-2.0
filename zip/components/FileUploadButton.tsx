import React, { useRef } from 'react';
// FIX: Added .tsx extension to fix module resolution error.
import { UploadIcon } from './Icons.tsx';

interface FileUploadButtonProps {
  onTextUpload: (text: string) => void;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({ onTextUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        onTextUpload(text);
      };
      reader.readAsText(file);
    }
    // Reset file input to allow uploading the same file again
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".txt"
      />
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-500 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <UploadIcon className="w-5 h-5 mr-2" />
        Upload Text File
      </button>
    </>
  );
};

export default FileUploadButton;