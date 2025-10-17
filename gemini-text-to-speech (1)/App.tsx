import React, { useState, useEffect } from 'react';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import VoiceSelector from './components/VoiceSelector.tsx';
import LanguageSelector from './components/LanguageSelector.tsx';
import TextArea from './components/TextArea.tsx';
import PlayButton from './components/PlayButton.tsx';
import AudioPreview from './components/AudioPreview.tsx';
import DownloadButton from './components/DownloadButton.tsx';
import FileUploadButton from './components/FileUploadButton.tsx';
import DictationButton from './components/DictationButton.tsx';
import SSMLToggle from './components/SSMLToggle.tsx';
import VoiceStyleInputs from './components/VoiceStyleInputs.tsx';
import Toast from './components/Toast.tsx';
import PresetManager from './components/PresetManager.tsx';
import { VOICES, LANGUAGES } from './constants.ts';
import type { VoiceOption, LanguageOption, Preset } from './types.ts';
import { generateSpeech } from './services/geminiService.ts';

type ToastMessage = {
  id: number;
  type: 'loading' | 'success' | 'error';
  message: string;
};

const PRESETS_STORAGE_KEY = 'echoWave-presets';

const App: React.FC = () => {
  const [text, setText] = useState("Hi there! Type anything in this box, and I will read it aloud for you. Go ahead, give it a try!");
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption>(VOICES[0]);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>(LANGUAGES[0]);
  const [isSSML, setIsSSML] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioData, setAudioData] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Voice style state
  const [voiceTone, setVoiceTone] = useState('');
  const [speakingIntention, setSpeakingIntention] = useState('');
  const [voiceCharacteristics, setVoiceCharacteristics] = useState('');
  const [pitch, setPitch] = useState(1.0);
  const [speed, setSpeed] = useState(1.0);
  
  // Preset state
  const [presets, setPresets] = useState<Preset[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  // Load presets from localStorage on initial render
  useEffect(() => {
    try {
      const storedPresets = localStorage.getItem(PRESETS_STORAGE_KEY);
      if (storedPresets) {
        setPresets(JSON.parse(storedPresets));
      }
    } catch (error) {
      console.error("Failed to load presets from localStorage", error);
    }
  }, []);

  // Effect to persist presets whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(presets));
    } catch (error) {
      console.error("Failed to save presets to localStorage", error);
    }
  }, [presets]);

  // Clear toast after a delay
  useEffect(() => {
    if (toast && toast.type !== 'loading') {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (type: 'loading' | 'success' | 'error', message: string) => {
    setToast({ id: Date.now(), type, message });
  };

  const handleGenerateSpeech = async () => {
    if (!text.trim()) {
      showToast('error', 'Please enter some text to synthesize.');
      return;
    }
    setIsLoading(true);
    setAudioData(null);
    showToast('loading', 'Generating speech, please wait...');
    
    try {
      const data = await generateSpeech(text, selectedVoice.name, selectedLanguage.code, isSSML, voiceTone, speakingIntention, voiceCharacteristics, pitch, speed);
      setAudioData(data);
      showToast('success', 'Speech generated successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      showToast('error', `Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
      // If it was a loading toast, clear it on finish (unless an error/success replaced it)
      if (toast?.type === 'loading') {
        setToast(null);
      }
    }
  };

  const handleTextUpload = (uploadedText: string) => {
    setText(uploadedText);
  };
  
  const handleDictation = (dictatedText: string) => {
    setText(prev => prev ? `${prev} ${dictatedText}`.trim() : dictatedText);
  }

  const handleSavePreset = (presetName: string) => {
    const newPreset: Preset = {
        id: Date.now().toString(),
        name: presetName,
        voiceName: selectedVoice.name,
        languageCode: selectedLanguage.code,
        tone: voiceTone,
        intention: speakingIntention,
        characteristics: voiceCharacteristics,
        pitch: pitch,
        speed: speed,
    };
    const updatedPresets = [...presets, newPreset];
    setPresets(updatedPresets);
    setSelectedPresetId(newPreset.id);
    showToast('success', `Preset "${presetName}" saved!`);
  };

  const handleLoadPreset = (presetId: string) => {
    if (!presetId) {
        setSelectedPresetId(null);
        return;
    }
    const preset = presets.find(p => p.id === presetId);
    if (preset) {
        const voice = VOICES.find(v => v.name === preset.voiceName) || VOICES[0];
        const language = LANGUAGES.find(l => l.code === preset.languageCode) || LANGUAGES[0];
        setSelectedVoice(voice);
        setSelectedLanguage(language);
        setVoiceTone(preset.tone);
        setSpeakingIntention(preset.intention);
        setVoiceCharacteristics(preset.characteristics);
        setPitch(preset.pitch);
        setSpeed(preset.speed);
        setSelectedPresetId(preset.id);
        showToast('success', `Preset "${preset.name}" loaded!`);
    }
  };

  const handleDeletePreset = (presetId: string) => {
      setPresets(presets.filter(p => p.id !== presetId));
      setSelectedPresetId(null);
      showToast('success', 'Preset deleted.');
  };

  return (
    <div className="flex flex-col min-h-screen text-gray-900 dark:text-gray-100 font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8 space-y-6">
            <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-200">
              AI-Powered Voice Synthesis
            </h2>
            
            <TextArea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={isSSML ? '<speak>Enter your SSML here...</speak>' : "Enter text here..."}
              disabled={isLoading}
              isSSML={isSSML}
            />
            
            <SSMLToggle isEnabled={isSSML} onToggle={setIsSSML} />

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex-grow flex justify-start">
                  <PlayButton onClick={handleGenerateSpeech} isLoading={isLoading} />
              </div>
              <div className="flex items-center space-x-2">
                <FileUploadButton onTextUpload={handleTextUpload} />
                <DictationButton onDictation={handleDictation} />
              </div>
            </div>
            
            {audioData && !isLoading && (
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-medium text-center">Audio Preview</h3>
                <AudioPreview audioData={audioData} />
                <div className="text-center">
                  <DownloadButton audioData={audioData} />
                </div>
              </div>
            )}
            
            {/* --- Voice Configuration Section --- */}
            <div className="space-y-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-200">
                Voice Configuration
              </h3>

              <PresetManager
                  presets={presets}
                  selectedPresetId={selectedPresetId}
                  onSelectPreset={handleLoadPreset}
                  onSavePreset={handleSavePreset}
                  onDeletePreset={handleDeletePreset}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <VoiceSelector
                  voices={VOICES}
                  selectedVoice={selectedVoice}
                  onSelectVoice={(v) => { setSelectedVoice(v); setSelectedPresetId(null); }}
                />
                <LanguageSelector
                  languages={LANGUAGES}
                  selectedLanguage={selectedLanguage}
                  onSelectLanguage={(l) => { setSelectedLanguage(l); setSelectedPresetId(null); }}
                />
              </div>

              <VoiceStyleInputs
                  tone={voiceTone}
                  onToneChange={(v) => { setVoiceTone(v); setSelectedPresetId(null); }}
                  intention={speakingIntention}
                  onIntentionChange={(v) => { setSpeakingIntention(v); setSelectedPresetId(null); }}
                  characteristics={voiceCharacteristics}
                  onCharacteristicsChange={(v) => { setVoiceCharacteristics(v); setSelectedPresetId(null); }}
                  pitch={pitch}
                  onPitchChange={(v) => { setPitch(v); setSelectedPresetId(null); }}
                  speed={speed}
                  onSpeedChange={(v) => { setSpeed(v); setSelectedPresetId(null); }}
                  disabled={isLoading || isSSML}
              />
               {isSSML && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 -mt-4">
                      Voice style controls are disabled when SSML is active. Use SSML tags for advanced control.
                  </p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default App;