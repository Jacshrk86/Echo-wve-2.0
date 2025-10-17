export interface VoiceOption {
  name: string;
  displayName: string;
  gender: string;
}

export interface LanguageOption {
  code: string;
  displayName: string;
}

export interface Preset {
  id: string;
  name: string;
  voiceName: string;
  languageCode: string;
  tone: string;
  intention: string;
  characteristics: string;
  pitch: number;
  speed: number;
}
