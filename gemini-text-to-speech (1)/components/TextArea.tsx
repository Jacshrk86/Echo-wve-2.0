import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  isSSML: boolean;
}

const TextArea: React.FC<TextAreaProps> = ({ isSSML, ...props }) => {
  const characterCount = props.value?.toString().length || 0;

  return (
    <div>
        <div className="flex justify-between items-center mb-1">
            <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {isSSML ? 'Enter SSML Markup' : 'Enter Text to Synthesize'}
            </label>
            <span className="text-xs text-gray-500 dark:text-gray-400" aria-live="polite">
                {characterCount} characters
            </span>
        </div>
        <textarea
            id="text-input"
            rows={6}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white font-mono"
            {...props}
        />
    </div>
  );
};

export default TextArea;