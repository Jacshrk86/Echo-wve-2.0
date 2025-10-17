import React from 'react';
// FIX: Added .tsx extension to fix module resolution error.
import { PlayIcon, LoadingIcon } from './Icons.tsx';

interface PlayButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

const PlayButton: React.FC<PlayButtonProps> = ({ onClick, isLoading }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed dark:focus:ring-offset-gray-800"
    >
      {isLoading ? (
        <>
          <LoadingIcon className="w-5 h-5 mr-2" />
          Generating...
        </>
      ) : (
        <>
          <PlayIcon className="w-5 h-5 mr-2" />
          Generate Speech
        </>
      )}
    </button>
  );
};

export default PlayButton;