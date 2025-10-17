import React, { useState, useEffect, useRef } from 'react';
// FIX: Added .tsx extension to fix module resolution issue.
import { MicIcon } from './Icons.tsx';

// Define interfaces for the Web Speech API to avoid TypeScript errors
// and provide better type safety.
interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: {
    transcript: string;
  };
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  start(): void;
  stop(): void;
}

interface DictationButtonProps {
  onDictation: (text: string) => void;
}


const DictationButton: React.FC<DictationButtonProps> = ({ onDictation }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  // A ref to prevent triggering stop recognition if it was never started.
  const recognitionStartedRef = useRef(false);

  const isSupported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const startRecognition = () => {
    if (isListening || !recognitionRef.current) return;
    try {
      recognitionRef.current.start();
      recognitionStartedRef.current = true;
      setIsListening(true);
    } catch (err) {
      // This can happen if start() is called while it's already running.
      console.error("Speech recognition could not be started.", err);
      setIsListening(false);
      recognitionStartedRef.current = false;
    }
  };

  const stopRecognition = () => {
    if (!recognitionStartedRef.current || !recognitionRef.current) return;
    // stop() will trigger the onend event, which handles state cleanup.
    recognitionRef.current.stop();
  };

  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognitionImpl = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognitionImpl();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        onDictation(finalTranscript.trim());
      }
    };
    
    // Fired when the service is disconnected for any reason.
    recognition.onend = () => {
        setIsListening(false);
        recognitionStartedRef.current = false;
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        recognitionStartedRef.current = false;
    };

    recognitionRef.current = recognition;

    // Cleanup when the component unmounts.
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onend = null; // prevent state updates on unmounted component
        recognitionRef.current.stop();
      }
    };
  }, [onDictation, isSupported]);
  
  // Combine mouse and touch events
  const handlePress = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); // Prevent double events on touch devices
    startRecognition();
  };

  const handleRelease = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    stopRecognition();
  };
  
  if (!isSupported) {
      return (
        <button
          type="button"
          disabled
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-500 shadow-sm text-sm font-medium rounded-md text-gray-400 bg-gray-100 dark:bg-gray-800 dark:text-gray-500 cursor-not-allowed"
          title="Speech recognition is not supported in your browser. Try using Chrome or Edge."
        >
          <MicIcon className="w-5 h-5 mr-2" />
          Dictation Unavailable
        </button>
      );
  }

  return (
    <button
      type="button"
      onMouseDown={handlePress}
      onMouseUp={handleRelease}
      onMouseLeave={handleRelease} // Stop if mouse leaves the button while pressed
      onTouchStart={handlePress}
      onTouchEnd={handleRelease}
      className={`select-none inline-flex items-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
        isListening
          ? 'border-red-500 text-red-500 bg-white hover:bg-red-50 dark:bg-gray-700 dark:text-red-400 dark:border-red-400'
          : 'border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
      }`}
    >
      {isListening ? (
        <>
          <MicIcon className="w-5 h-5 mr-2 animate-pulse-icon" />
          Listening...
        </>
      ) : (
        <>
          <MicIcon className="w-5 h-5 mr-2" />
          Hold to Dictate
        </>
      )}
    </button>
  );
};

export default DictationButton;