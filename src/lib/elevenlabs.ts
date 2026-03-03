import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

export const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

// Ersetze dies mit deiner geklonten Stimmen-ID aus dem ElevenLabs Dashboard
export const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'pNInz6obpgDQGcFmaJgB';

// eleven_multilingual_v2 unterstützt Deutsch optimal
export const TTS_MODEL = 'eleven_multilingual_v2';
