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
import { VOICES, LANGUAGES } from './constants.ts';
import type { VoiceOption, LanguageOption } from './types.ts';
import { generateSpeech } from './services/geminiService.ts';

type ToastMessage = {
  id: number;
  type: 'loading' | 'success' | 'error';
  message: string;
};

const App: React.FC = () => {
  const [text, setText] = useState("Hi there! Type anything in this box, and I will read it aloud for you. Go ahead, give it a try!");
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption>(VOICES[0]);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>(LANGUAGES[0]);
  const [isSSML, setIsSSML] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioData, setAudioData] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [voiceTone, setVoiceTone] = useState('');
  const [speakingIntention, setSpeakingIntention] = useState('');
  const [voiceCharacteristics, setVoiceCharacteristics] = useState('');

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
      const data = await generateSpeech(text, selectedVoice.name, selectedLanguage.code, isSSML, voiceTone, speakingIntention, voiceCharacteristics);
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

  return (
    <div className="flex flex-col min-h-screen text-gray-900 dark:text-gray-100 font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8 space-y-6">
            <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-200">
              AI-Powered Voice Synthesis
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <VoiceSelector
                voices={VOICES}
                selectedVoice={selectedVoice}
                onSelectVoice={setSelectedVoice}
              />
              <LanguageSelector
                languages={LANGUAGES}
                selectedLanguage={selectedLanguage}
                onSelectLanguage={setSelectedLanguage}
              />
            </div>

            <VoiceStyleInputs
                tone={voiceTone}
                onToneChange={setVoiceTone}
                intention={speakingIntention}
                onIntentionChange={setSpeakingIntention}
                characteristics={voiceCharacteristics}
                onCharacteristicsChange={setVoiceCharacteristics}
                disabled={isLoading || isSSML}
            />
             {isSSML && (
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-4">
                    Voice style controls are disabled when SSML is active. Use SSML tags for advanced control.
                </p>
            )}


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
              <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-center">Audio Preview</h3>
                <AudioPreview audioData={audioData} />
                <div className="text-center">
                  <DownloadButton audioData={audioData} />
                </div>
              </div>
            )}
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