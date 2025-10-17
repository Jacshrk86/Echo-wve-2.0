import React from 'react';
import { VoiceOption } from '../types';

interface VoiceSelectorProps {
  voices: VoiceOption[];
  selectedVoice: VoiceOption;
  onSelectVoice: (voice: VoiceOption) => void;
}

const VoiceSelector: React.FC<VoiceSelectorProps> = ({ voices, selectedVoice, onSelectVoice }) => {
  return (
    <div>
      <label htmlFor="voice-selector" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Voice
      </label>
      <select
        id="voice-selector"
        value={selectedVoice.name}
        onChange={(e) => {
          const voice = voices.find((v) => v.name === e.target.value);
          if (voice) {
            onSelectVoice(voice);
          }
        }}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
      >
        {voices.map((voice) => (
          <option key={voice.name} value={voice.name}>
            {voice.displayName} ({voice.gender})
          </option>
        ))}
      </select>
    </div>
  );
};

export default VoiceSelector;
