'use client';

import { useCallback, useRef, useState } from 'react';
import { Message } from '@/types/chat';

interface MessageBubbleProps {
  message: Message;
}

/** Markdown-Formatierung entfernen, Emojis und Zeilenumbrüche behalten */
function stripMarkdown(text: string): string {
  return text
    // Headings: ### Text → Text
    .replace(/^#{1,6}\s+/gm, '')
    // Bold: **text** oder __text__
    .replace(/\*\*(.*?)\*\*/gs, '$1')
    .replace(/__(.*?)__/gs, '$1')
    // Italic: *text* oder _text_
    .replace(/\*(.*?)\*/gs, '$1')
    .replace(/_(.*?)_/gs, '$1')
    // Inline code: `code`
    .replace(/`([^`]+)`/g, '$1')
    // Code blocks: ```code```
    .replace(/```[\s\S]*?```/g, '')
    // Links: [text](url) → text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Horizontale Linie: --- oder ***
    .replace(/^[-*]{3,}\s*$/gm, '')
    // Unordered list bullets: - item oder * item → item
    .replace(/^(\s*)[*-]\s+/gm, '$1')
    // Mehrfache Leerzeilen auf max. eine reduzieren
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const [audioState, setAudioState] = useState<'idle' | 'loading' | 'playing' | 'error'>('idle');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const displayContent = isUser ? message.content : stripMarkdown(message.content);

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
        body: JSON.stringify({ text: displayContent }),
      });

      if (!response.ok) throw new Error('TTS Fehler');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => { setAudioState('idle'); URL.revokeObjectURL(url); };
      audio.onerror = () => { setAudioState('error'); URL.revokeObjectURL(url); };

      await audio.play();
      setAudioState('playing');
    } catch {
      setAudioState('error');
    }
  }, [audioState, displayContent]);

  if (isUser) {
    return (
      <div className="flex items-end justify-end gap-3 mb-4">
        {/* Nachricht */}
        <div
          className="max-w-[75%] rounded-2xl rounded-br-sm px-4 py-3"
          style={{
            background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(123,47,255,0.15))',
            border: '1px solid rgba(0,212,255,0.2)',
          }}
        >
          <p className="text-white text-sm leading-relaxed">{displayContent}</p>
        </div>
        {/* User-Avatar */}
        <div
          className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center"
          style={{
            background: 'rgba(123,47,255,0.2)',
            border: '1px solid rgba(123,47,255,0.35)',
          }}
        >
          <span className="text-xs font-bold" style={{ color: '#a78bfa' }}>Du</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-3 mb-4">
      {/* WG-Avatar */}
      <div className="w-8 h-8 rounded-full flex-shrink-0 p-0.5" style={{ background: 'linear-gradient(135deg, #00d4ff, #7b2fff)' }}>
        <div className="w-full h-full rounded-full flex items-center justify-center" style={{ background: '#12121a' }}>
          <span className="text-xs font-bold" style={{ color: '#00d4ff' }}>WG</span>
        </div>
      </div>

      {/* Nachricht */}
      <div
        className="max-w-[75%] rounded-2xl rounded-bl-sm px-4 py-3"
        style={{ background: '#1a1a2e', border: '1px solid #1e1e30' }}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#a0a0b0' }}>
          {displayContent}
        </p>

        {/* Audio-Button */}
        <div className="mt-2">
          <button
            onClick={playAudio}
            disabled={audioState === 'loading' || audioState === 'error'}
            className="flex items-center gap-1.5 text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ color: '#5a5a7a' }}
            onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.color = '#00d4ff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#5a5a7a'; }}
          >
            {audioState === 'loading' && (
              <>
                <span className="w-3 h-3 rounded-full border-2 animate-spin" style={{ borderColor: 'rgba(0,212,255,0.3)', borderTopColor: '#00d4ff' }} />
                <span>Lädt...</span>
              </>
            )}
            {audioState === 'playing' && (
              <>
                <span className="flex gap-0.5 items-end h-3">
                  {[1, 3, 2, 3, 1].map((h, i) => (
                    <span key={i} className="w-0.5 rounded animate-waveform" style={{ height: `${h * 4}px`, background: '#00d4ff', animationDelay: `${i * 0.1}s` }} />
                  ))}
                </span>
                <span style={{ color: '#00d4ff' }}>Stoppen</span>
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
            {audioState === 'error' && <span style={{ color: '#f87171' }}>Fehler beim Abspielen</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
