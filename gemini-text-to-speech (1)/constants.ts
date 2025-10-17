import type { VoiceOption, LanguageOption } from './types';

export const VOICES: VoiceOption[] = [
  { name: 'Kore', displayName: 'Kore', gender: 'Female' },
  { name: 'Puck', displayName: 'Puck', gender: 'Male' },
  { name: 'Charon', displayName: 'Charon', gender: 'Male' },
  { name: 'Fenrir', displayName: 'Fenrir', gender: 'Male' },
  { name: 'Zephyr', displayName: 'Zephyr', gender: 'Female' },
];

export const LANGUAGES: LanguageOption[] = [
    { code: 'en-US', displayName: 'English (US)' },
    { code: 'en-GB', displayName: 'English (UK)' },
    { code: 'es-ES', displayName: 'Spanish' },
    { code: 'fr-FR', displayName: 'French' },
    { code: 'de-DE', displayName: 'German' },
    { code: 'it-IT', displayName: 'Italian' },
    { code: 'ja-JP', displayName: 'Japanese' },
    { code: 'ko-KR', displayName: 'Korean' },
    { code: 'pt-BR', displayName: 'Portuguese' },
];
