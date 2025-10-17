import React from 'react';

interface VoiceStyleInputsProps {
  tone: string;
  onToneChange: (value: string) => void;
  intention: string;
  onIntentionChange: (value: string) => void;
  characteristics: string;
  onCharacteristicsChange: (value: string) => void;
  pitch: number;
  onPitchChange: (value: number) => void;
  speed: number;
  onSpeedChange: (value: number) => void;
  disabled: boolean;
}

const VoiceStyleInputs: React.FC<VoiceStyleInputsProps> = ({
  tone,
  onToneChange,
  intention,
  onIntentionChange,
  characteristics,
  onCharacteristicsChange,
  pitch,
  onPitchChange,
  speed,
  onSpeedChange,
  disabled,
}) => {
  const commonInputClasses = `shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ${disabled ? 'bg-gray-100 dark:bg-gray-800 opacity-70 cursor-not-allowed' : ''}`;
  const commonSliderClasses = `w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`;

  return (
    <div className="space-y-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
                <label htmlFor="pitch-slider" className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <span>Pitch</span>
                    <span>{pitch.toFixed(2)}</span>
                </label>
                <input
                    type="range"
                    id="pitch-slider"
                    min="0.5"
                    max="1.5"
                    step="0.01"
                    value={pitch}
                    onChange={(e) => onPitchChange(parseFloat(e.target.value))}
                    disabled={disabled}
                    className={commonSliderClasses}
                    title={disabled ? 'Disabled when SSML is active' : 'Adjust the speaking pitch'}
                />
            </div>
             <div>
                <label htmlFor="speed-slider" className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <span>Speed</span>
                    <span>{speed.toFixed(2)}x</span>
                </label>
                <input
                    type="range"
                    id="speed-slider"
                    min="0.5"
                    max="1.5"
                    step="0.01"
                    value={speed}
                    onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
                    disabled={disabled}
                    className={commonSliderClasses}
                    title={disabled ? 'Disabled when SSML is active' : 'Adjust the speaking speed'}
                />
            </div>
        </div>
    </div>
  );
};

export default VoiceStyleInputs;
