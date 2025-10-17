import { GoogleGenAI, Modality } from "@google/genai";

export async function generateSpeech(
  text: string, 
  voiceName: string, 
  language: string, 
  isSSML: boolean,
  voiceTone: string,
  speakingIntention: string,
  voiceCharacteristics: string,
  pitch: number,
  speed: number
): Promise<string> {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  let textToSynthesize = text;

  // Prepend instructions if not using SSML and if any style is provided.
  if (!isSSML) {
    const instructions: string[] = [];
    if (voiceTone.trim()) instructions.push(`a tone that is ${voiceTone.trim()}`);
    if (speakingIntention.trim()) instructions.push(`an intention to ${speakingIntention.trim()}`);
    if (voiceCharacteristics.trim()) instructions.push(`voice characteristics that are ${voiceCharacteristics.trim()}`);
    
    // Map pitch value to a descriptor. Only add if it's not the default.
    if (pitch < 0.85) instructions.push('a very low pitch');
    else if (pitch < 0.95) instructions.push('a low pitch');
    else if (pitch > 1.15) instructions.push('a very high pitch');
    else if (pitch > 1.05) instructions.push('a high pitch');

    // Map speed value to a descriptor. Only add if it's not the default.
    if (speed < 0.85) instructions.push('a very slow speaking rate');
    else if (speed < 0.95) instructions.push('a slow speaking rate');
    else if (speed > 1.15) instructions.push('a very fast speaking rate');
    else if (speed > 1.05) instructions.push('a fast speaking rate');


    if (instructions.length > 0) {
      // Use a format that is clear for the model to understand.
      const prefix = `Speak with ${instructions.join(' and ')}. The text to say is: `;
      textToSynthesize = prefix + text;
    }
  }

  // If SSML is enabled, use original text and wrap in <speak> tags if needed.
  // Instructions are ignored for SSML.
  const processedText = isSSML && !text.trim().startsWith('<speak>') 
    ? `<speak>${text}</speak>` 
    : textToSynthesize;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: processedText }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (base64Audio) {
      return base64Audio;
    } else {
      throw new Error("No audio data received from API. The model may have deemed the input unsafe.");
    }
  } catch (error) {
    console.error("Error generating speech:", error);
    if (error instanceof Error && error.message.includes('400')) {
        throw new Error("Invalid request. Please check your input text (and SSML markup) and try again.");
    }
    throw new Error("Failed to generate speech. Please check your input and API configuration.");
  }
}
