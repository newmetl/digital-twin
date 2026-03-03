'use client';

import { useCallback, useRef, useState } from 'react';
import { Message } from '@/types/chat';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const [audioState, setAudioState] = useState<'idle' | 'loading' | 'playing' | 'error'>('idle');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = useCallback(async () => {
    if (audioState === 'playing') {
      audioRef.current?.pause();
      setAudioState('idle');
      return;
    }

    setAudioState('loading');

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message.content }),
      });

      if (!response.ok) throw new Error('TTS Fehler');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        setAudioState('idle');
        URL.revokeObjectURL(url);
      };

      audio.onerror = () => {
        setAudioState('error');
        URL.revokeObjectURL(url);
      };

      await audio.play();
      setAudioState('playing');
    } catch {
      setAudioState('error');
    }
  }, [audioState, message.content]);

  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[75%] bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-accent-cyan/20 rounded-2xl rounded-br-sm px-4 py-3">
          <p className="text-white text-sm leading-relaxed">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-3 mb-4">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-violet-600 p-0.5 flex-shrink-0">
        <div className="w-full h-full rounded-full bg-bg-surface flex items-center justify-center">
          <span className="text-xs font-bold text-accent-cyan">WG</span>
        </div>
      </div>

      {/* Nachricht */}
      <div className="max-w-[75%] bg-bg-surface-2 border border-border-primary rounded-2xl rounded-bl-sm px-4 py-3">
        <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>

        {/* Audio-Button */}
        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={playAudio}
            disabled={audioState === 'loading' || audioState === 'error'}
            title={audioState === 'playing' ? 'Stoppen' : 'Vorlesen'}
            className="flex items-center gap-1.5 text-xs text-text-muted hover:text-accent-cyan
              transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {audioState === 'loading' && (
              <>
                <span className="w-3 h-3 border border-accent-cyan/50 border-t-accent-cyan rounded-full animate-spin" />
                <span>Lädt...</span>
              </>
            )}
            {audioState === 'playing' && (
              <>
                {/* Waveform Animation */}
                <span className="flex gap-0.5 items-end h-3">
                  <span className="w-0.5 bg-accent-cyan rounded animate-[waveform_0.8s_ease-in-out_infinite] h-1" />
                  <span className="w-0.5 bg-accent-cyan rounded animate-[waveform_0.8s_ease-in-out_infinite_0.1s] h-3" />
                  <span className="w-0.5 bg-accent-cyan rounded animate-[waveform_0.8s_ease-in-out_infinite_0.2s] h-2" />
                  <span className="w-0.5 bg-accent-cyan rounded animate-[waveform_0.8s_ease-in-out_infinite_0.3s] h-3" />
                  <span className="w-0.5 bg-accent-cyan rounded animate-[waveform_0.8s_ease-in-out_infinite_0.15s] h-1" />
                </span>
                <span className="text-accent-cyan">Stoppen</span>
              </>
            )}
            {audioState === 'idle' && (
              <>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                </svg>
                <span>Vorlesen</span>
              </>
            )}
            {audioState === 'error' && (
              <span className="text-red-400">Fehler beim Abspielen</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
