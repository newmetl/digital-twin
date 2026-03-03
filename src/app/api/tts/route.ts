import { NextRequest } from 'next/server';
import { elevenlabs, VOICE_ID, TTS_MODEL } from '@/lib/elevenlabs';

export async function POST(request: NextRequest) {
  try {
    const { text }: { text: string } = await request.json();

    if (!text || text.trim().length === 0) {
      return new Response('Kein Text übergeben', { status: 400 });
    }

    const audioStream = await elevenlabs.textToSpeech.convert(VOICE_ID, {
      text: text.trim(),
      modelId: TTS_MODEL,
      voiceSettings: {
        stability: 0.5,
        similarityBoost: 0.75,
      },
    });

    // ReadableStream zu Buffer konvertieren
    const arrayBuffer = await new Response(audioStream).arrayBuffer();
    const audioBuffer = Buffer.from(arrayBuffer);

    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString(),
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('TTS API Fehler:', error);
    return new Response('TTS Fehler', { status: 500 });
  }
}
