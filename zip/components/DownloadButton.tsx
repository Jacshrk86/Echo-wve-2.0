import React from 'react';
// FIX: Added .tsx extension to fix module resolution error.
import { DownloadIcon } from './Icons.tsx';

interface DownloadButtonProps {
  audioData: string;
}

// Helper function to create a WAV file from raw PCM data
const createWavFile = (base64Pcm: string): Blob => {
  const sampleRate = 24000;
  const numChannels = 1;
  const bitsPerSample = 16;

  const binaryString = atob(base64Pcm);
  const len = binaryString.length;
  const pcmData = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    pcmData[i] = binaryString.charCodeAt(i);
  }

  const wavHeader = new ArrayBuffer(44);
  const view = new DataView(wavHeader);
  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };
  
  const pcmDataLength = pcmData.byteLength;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const byteRate = sampleRate * blockAlign;

  writeString(0, 'RIFF'); // ChunkID
  view.setUint32(4, 36 + pcmDataLength, true); // ChunkSize
  writeString(8, 'WAVE'); // Format
  writeString(12, 'fmt '); // Subchunk1ID
  view.setUint32(16, 16, true); // Subchunk1Size
  view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
  view.setUint16(22, numChannels, true); // NumChannels
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, byteRate, true); // ByteRate
  view.setUint16(32, blockAlign, true); // BlockAlign
  view.setUint16(34, bitsPerSample, true); // BitsPerSample
  writeString(36, 'data'); // Subchunk2ID
  view.setUint32(40, pcmDataLength, true); // Subchunk2Size

  const wavData = new Uint8Array(44 + pcmData.byteLength);
  wavData.set(new Uint8Array(wavHeader), 0);
  wavData.set(pcmData, 44);

  return new Blob([wavData], { type: 'audio/wav' });
};


const DownloadButton: React.FC<DownloadButtonProps> = ({ audioData }) => {
  const handleDownload = () => {
    const wavBlob = createWavFile(audioData);
    const url = URL.createObjectURL(wavBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'speech.wav';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-500 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <DownloadIcon className="w-5 h-5 mr-2" />
      Download Audio
    </button>
  );
};

export default DownloadButton;