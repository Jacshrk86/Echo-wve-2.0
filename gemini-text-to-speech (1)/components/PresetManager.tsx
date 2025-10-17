import React from 'react';
import type { Preset } from '../types.ts';
import { SaveIcon, TrashIcon } from './Icons.tsx';

interface PresetManagerProps {
  presets: Preset[];
  onSelectPreset: (presetId: string) => void;
  onSavePreset: (presetName: string) => void;
  onDeletePreset: (presetId:string) => void;
  selectedPresetId: string | null;
}

const PresetManager: React.FC<PresetManagerProps> = ({ 
    presets, 
    onSelectPreset, 
    onSavePreset,
    onDeletePreset,
    selectedPresetId
}) => {
  
  const handleSave = () => {
    const name = prompt("Enter a name for this preset:");
    if (name && name.trim()) {
      onSavePreset(name.trim());
    }
  };

  const handleDelete = () => {
    if (selectedPresetId && confirm('Are you sure you want to delete this preset?')) {
        onDeletePreset(selectedPresetId);
    }
  };

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
        <label htmlFor="preset-selector" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Voice Presets
        </label>
        <div className="flex items-center gap-2">
            <select
                id="preset-selector"
                value={selectedPresetId ?? ''}
                onChange={(e) => onSelectPreset(e.target.value)}
                className="flex-grow block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            >
                <option value="">-- Load or Save --</option>
                {presets.map((preset) => (
                    <option key={preset.id} value={preset.id}>
                        {preset.name}
                    </option>
                ))}
            </select>
            <button
                onClick={handleSave}
                className="p-2 border border-gray-300 dark:border-gray-500 shadow-sm rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                title="Save current settings as a new preset"
            >
                <SaveIcon className="w-5 h-5" />
            </button>
            {selectedPresetId && (
                <button
                    onClick={handleDelete}
                    className="p-2 border border-red-500 shadow-sm rounded-md text-red-500 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-gray-700 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-900/20"
                    title="Delete selected preset"
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
            )}
        </div>
    </div>
  );
};

export default PresetManager;
