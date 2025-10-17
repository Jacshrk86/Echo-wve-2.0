import React from 'react';

interface SSMLToggleProps {
  isEnabled: boolean;
  onToggle: (isEnabled: boolean) => void;
}

const SSMLToggle: React.FC<SSMLToggleProps> = ({ isEnabled, onToggle }) => {
  return (
    <div className="flex items-center">
      <input
        id="ssml-toggle"
        type="checkbox"
        checked={isEnabled}
        onChange={(e) => onToggle(e.target.checked)}
        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
      />
      <label htmlFor="ssml-toggle" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
        Enable SSML (Speech Synthesis Markup Language)
      </label>
    </div>
  );
};

export default SSMLToggle;
