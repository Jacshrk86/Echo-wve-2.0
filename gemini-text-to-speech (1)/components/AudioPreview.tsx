import React, { useState, useEffect, useRef } from 'react';
// FIX: Added .tsx extension to fix module resolution error.
import { PlayIcon, PauseIcon } from './Icons.tsx';

// Helper functions from Gemini API documentation to handle raw PCM audio
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


interface AudioPreviewProps {
  audioData: string;
}

const AudioPreview: React.FC<AudioPreviewProps> = ({ audioData }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    // Ensure AudioContext is available (runs only once)
    if (!audioContextRef.current) {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
            audioContextRef.current = new AudioContext({ sampleRate: 24000 });
        } else {
            console.error('Web Audio API is not supported in this browser.');
        }
    }

    let isMounted = true;
    const processAudio = async () => {
        if (audioData && audioContextRef.current) {
            try {
                const decodedBytes = decode(audioData);
                const buffer = await decodeAudioData(decodedBytes, audioContextRef.current, 24000, 1);
                if (isMounted) {
                    audioBufferRef.current = buffer;
                }
            } catch (error) {
                console.error("Error decoding audio data:", error);
            }
        }
    };
    processAudio();

    return () => {
        isMounted = false;
        if (sourceRef.current) {
            sourceRef.current.stop();
        }
    };
  }, [audioData]);

  const togglePlay = () => {
    if (!audioBufferRef.current || !audioContextRef.current) return;

    if (isPlaying) {
      if (sourceRef.current) {
        sourceRef.current.stop();
      }
      setIsPlaying(false);
    } else {
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBufferRef.current;
      source.connect(audioContextRef.current.destination);
      source.start();
      source.onended = () => {
        setIsPlaying(false);
        sourceRef.current = null;
      };
      sourceRef.current = source;
      setIsPlaying(true);
    }
  };

  return (
    <div className="flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
      <button
        onClick={togglePlay}
        disabled={!audioBufferRef.current}
        className="p-3 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 dark:focus:ring-offset-gray-700"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
      </button>
      <span className="ml-4 text-gray-700 dark:text-gray-300">
        {audioBufferRef.current ? `Audio ready (${audioBufferRef.current.duration.toFixed(2)}s)` : 'Processing audio...'}
      </span>
    </div>
  );
};

export default AudioPreview;