import React from 'react';

interface VoiceStyleInputsProps {
  tone: string;
  onToneChange: (value: string) => void;
  intention: string;
  onIntentionChange: (value: string) => void;
  characteristics: string;
  onCharacteristicsChange: (value: string) => void;
  disabled: boolean;
}

const VoiceStyleInputs: React.FC<VoiceStyleInputsProps> = ({
  tone,
  onToneChange,
  intention,
  onIntentionChange,
  characteristics,
  onCharacteristicsChange,
  disabled,
}) => {
  const commonInputClasses = `shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ${disabled ? 'bg-gray-100 dark:bg-gray-800 opacity-70 cursor-not-allowed' : ''}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <label htmlFor="voice-tone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Voice Tone
        </label>
        <input
          type="text"
          id="voice-tone"
          value={tone}
          onChange={(e) => onToneChange(e.target.value)}
          disabled={disabled}
          placeholder="e.g., cheerful, sad"
          className={commonInputClasses}
          title={disabled ? 'Disabled when SSML is active' : 'Describe the emotional tone'}
        />
      </div>
      <div>
        <label htmlFor="voice-intention" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Speaking Intention
        </label>
        <input
          type="text"
          id="voice-intention"
          value={intention}
          onChange={(e) => onIntentionChange(e.target.value)}
          disabled={disabled}
          placeholder="e.g., to persuade"
          className={commonInputClasses}
           title={disabled ? 'Disabled when SSML is active' : 'Describe the purpose of the speech'}
        />
      </div>
      <div>
        <label htmlFor="voice-characteristics" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Voice Characteristics
        </label>
        <input
          type="text"
          id="voice-characteristics"
          value={characteristics}
          onChange={(e) => onCharacteristicsChange(e.target.value)}
          disabled={disabled}
          placeholder="e.g., warm, raspy"
          className={commonInputClasses}
           title={disabled ? 'Disabled when SSML is active' : 'Describe the quality of the voice'}
        />
      </div>
    </div>
  );
};

export default VoiceStyleInputs;