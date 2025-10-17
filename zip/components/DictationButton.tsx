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

// --- Constants for Silence Detection ---
// Duration of silence in milliseconds before stopping dictation.
const SILENCE_DURATION_MS = 2000;
// AnalyserNode FFT size for audio processing.
const FFT_SIZE = 256;
// Threshold for silence detection based on average volume. Lower is more sensitive.
const SILENCE_THRESHOLD = 5;


const DictationButton: React.FC<DictationButtonProps> = ({ onDictation }) => {
  const [isDictating, setIsDictating] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Refs for Web Audio API based silence detection
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const isSupported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  // This function is the single source of truth for stopping all processes.
  const stopDictation = () => {
    // Stop the SpeechRecognition service
    if (recognitionRef.current) {
        // Use a try-catch as stop() can throw if already stopped.
        try { recognitionRef.current.stop(); } catch (e) { /* ignore */ }
    }

    // Stop the audio analysis loop
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Clear any pending silence timer
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    // Release the microphone and audio resources
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
        audioContextRef.current = null;
    }

    // Update the UI state
    setIsDictating(false);
  };

  const startDictation = async () => {
    if (!recognitionRef.current) return;
    
    setIsDictating(true);
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;

        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = FFT_SIZE;
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const monitorAudio = () => {
            analyser.getByteTimeDomainData(dataArray);
            
            // Calculate average volume from the audio data
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
                sum += Math.abs(dataArray[i] - 128); // 128 is the zero-point for Uint8Array
            }
            const averageVolume = sum / dataArray.length;

            if (averageVolume > SILENCE_THRESHOLD) {
                // User is speaking, so clear any existing silence timer.
                if (silenceTimerRef.current) {
                    clearTimeout(silenceTimerRef.current);
                    silenceTimerRef.current = null;
                }
            } else {
                // Silence detected. Start a timer to stop dictation if it's not already running.
                if (!silenceTimerRef.current) {
                    silenceTimerRef.current = setTimeout(stopDictation, SILENCE_DURATION_MS);
                }
            }
            // Continue monitoring on the next animation frame.
            animationFrameRef.current = requestAnimationFrame(monitorAudio);
        };
        monitorAudio();

        recognitionRef.current.start();

    } catch (err) {
      console.error("Error starting dictation:", err);
      alert("Could not start dictation. Please ensure microphone permissions are granted.");
      stopDictation(); // Clean up resources if something went wrong
    }
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
    
    // If the service ends for any reason (e.g., browser timeout), ensure we clean up.
    recognition.onend = () => {
        stopDictation();
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        stopDictation();
    };

    recognitionRef.current = recognition;

    // Cleanup when the component unmounts.
    return () => {
      stopDictation();
    };
  }, [onDictation, isSupported]);

  const toggleDictation = () => {
    if (isDictating) {
      stopDictation();
    } else {
      startDictation();
    }
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
      onClick={toggleDictation}
      className={`inline-flex items-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
        isDictating
          ? 'border-red-500 text-red-500 bg-white hover:bg-red-50 dark:bg-gray-700 dark:text-red-400 dark:border-red-400'
          : 'border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
      }`}
    >
      {isDictating ? (
        <>
          <MicIcon className="w-5 h-5 mr-2 animate-pulse-icon" />
          Listening...
        </>
      ) : (
        <>
          <MicIcon className="w-5 h-5 mr-2" />
          Start Dictation
        </>
      )}
    </button>
  );
};

export default DictationButton;