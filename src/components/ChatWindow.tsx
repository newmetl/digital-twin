'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Message } from '@/types/chat';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

const CALENDLY_URL = 'https://calendly.com/wojtek-gorecki/60-minuten-gesprach';

const SUGGESTED_QUESTIONS = [
  'Was unterscheidet dich von einem klassischen Product Owner?',
  'Wie verändert KI die Produktentwicklung konkret?',
  'Wie hast du deine Website in 4 Stunden gebaut?',
  'Wie können wir zusammenarbeiten?',
];

const INITIAL_MESSAGE: Message = {
  id: 'initial',
  role: 'assistant',
  content:
    'Hallo! Ich bin der digitale Zwilling von Wojtek Gorecki. Stell mir deine Fragen zu KI, Product Ownership oder der Zukunft der Produktentwicklung – ich antworte dir direkt. Was möchtest du wissen?',
  timestamp: new Date(),
};

interface ChatWindowProps {
  chatRef?: React.RefObject<HTMLDivElement | null>;
}

export default function ChatWindow({ chatRef }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [hasReplied, setHasReplied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || isLoading) return;

      setError(null);
      setShowSuggestions(false);

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: trimmed,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      setIsLoading(true);

      try {
        const history = [...messages, userMessage]
          .filter((m) => m.id !== 'initial')
          .map((m) => ({ role: m.role, content: m.content }));

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history }),
        });

        const data = await response.json();

        if (!response.ok || data.error) {
          throw new Error(data.error || 'Unbekannter Fehler');
        }

        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.text,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setHasReplied(true);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Es ist ein Fehler aufgetreten.'
        );
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div ref={chatRef} className="max-w-3xl mx-auto px-4 pb-8">
      <div
        className="rounded-2xl border overflow-hidden backdrop-blur-xl"
        style={{
          borderColor: '#1e1e30',
          background: 'rgba(18,18,26,0.8)',
          boxShadow: '0 0 50px rgba(0,212,255,0.05)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-5 py-4 border-b"
          style={{ borderColor: '#1e1e30', background: '#12121a' }}
        >
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ background: 'rgba(239,68,68,0.6)' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: 'rgba(234,179,8,0.6)' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: 'rgba(34,197,94,0.6)' }} />
          </div>
          <span className="text-xs ml-2" style={{ color: '#5a5a7a', fontFamily: 'monospace' }}>
            wojtek.gorecki — digitaler_zwilling
          </span>
          <div className="ml-auto flex items-center gap-1.5 text-xs" style={{ color: '#34d399', fontFamily: 'monospace' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-online-pulse" />
            live
          </div>
        </div>

        {/* Transparenz-Banner */}
        <div
          className="flex items-center gap-2 px-5 py-2 border-b text-xs"
          style={{
            borderColor: '#1e1e30',
            background: 'rgba(0,212,255,0.03)',
            color: '#5a5a7a',
            fontFamily: 'monospace',
          }}
        >
          <svg className="w-3 h-3 flex-shrink-0" style={{ color: '#00d4ff', opacity: 0.5 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span>Wojtek liest alle Gespräche mit – so kann er direkt dort anknüpfen, wenn ihr euch persönlich austauscht.</span>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto px-5 py-5 space-y-1">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {/* Schnellfragen – inline im Chat, vor der ersten Nachricht */}
          {showSuggestions && (
            <div className="pt-2 pb-1">
              <p
                className="text-xs mb-3 pl-11"
                style={{ color: '#5a5a7a', fontFamily: 'monospace' }}
              >
                Oder wähle eine Frage:
              </p>
              <div className="flex flex-col gap-2 pl-11">
                {SUGGESTED_QUESTIONS.map((question) => (
                  <button
                    key={question}
                    onClick={() => sendMessage(question)}
                    disabled={isLoading}
                    className="text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      border: '1px solid rgba(0,212,255,0.2)',
                      background: 'rgba(0,212,255,0.04)',
                      color: '#a0a0b0',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0,212,255,0.5)';
                      e.currentTarget.style.background = 'rgba(0,212,255,0.08)';
                      e.currentTarget.style.color = '#00d4ff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0,212,255,0.2)';
                      e.currentTarget.style.background = 'rgba(0,212,255,0.04)';
                      e.currentTarget.style.color = '#a0a0b0';
                    }}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isLoading && <TypingIndicator />}
          {error && (
            <div className="text-red-400 text-xs text-center py-2 font-mono">
              ⚠ {error}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t px-4 py-4" style={{ borderColor: '#1e1e30', background: '#12121a' }}>
          <div className="flex gap-3 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Schreib eine Nachricht... (Enter zum Senden)"
              disabled={isLoading}
              rows={1}
              className="flex-1 resize-none rounded-xl px-4 py-3 text-white text-sm
                disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 overflow-y-auto"
              style={{
                minHeight: '44px',
                maxHeight: '128px',
                background: '#0a0a0f',
                border: '1px solid #1e1e30',
                outline: 'none',
                color: '#ffffff',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0,212,255,0.5)';
                e.currentTarget.style.boxShadow = '0 0 15px rgba(0,212,255,0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#1e1e30';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
              }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={isLoading || !input.trim()}
              className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center
                disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              style={{
                background: 'rgba(0,212,255,0.1)',
                border: '1px solid rgba(0,212,255,0.3)',
                color: '#00d4ff',
              }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.background = 'rgba(0,212,255,0.2)';
                  e.currentTarget.style.borderColor = '#00d4ff';
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(0,212,255,0.2)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0,212,255,0.1)';
                e.currentTarget.style.borderColor = 'rgba(0,212,255,0.3)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {isLoading ? (
                <span
                  className="w-4 h-4 rounded-full border-2 animate-spin"
                  style={{ borderColor: 'rgba(0,212,255,0.3)', borderTopColor: '#00d4ff' }}
                />
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
          <p className="text-xs mt-2 text-center" style={{ color: '#5a5a7a', fontFamily: 'monospace' }}>
            Enter senden · Shift+Enter neue Zeile
          </p>
        </div>
      </div>

      {/* Calendly CTA */}
      <div
        className="mt-4 rounded-xl border px-5 py-4 flex items-center justify-between gap-4 transition-all duration-500"
        style={{
          borderColor: 'rgba(123,47,255,0.3)',
          background: 'rgba(123,47,255,0.05)',
          opacity: hasReplied ? 1 : 0.4,
        }}
      >
        <div>
          <p className="text-white text-sm font-semibold mb-0.5">Lieber persönlich reden?</p>
          <p className="text-xs" style={{ color: '#a0a0b0' }}>
            Buch dir 60 Minuten mit Wojtek – direkt und unkompliziert.
          </p>
        </div>
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
          style={{
            background: 'rgba(123,47,255,0.15)',
            border: '1px solid rgba(123,47,255,0.4)',
            color: '#a78bfa',
            textDecoration: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(123,47,255,0.25)';
            e.currentTarget.style.borderColor = '#7b2fff';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(123,47,255,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(123,47,255,0.15)';
            e.currentTarget.style.borderColor = 'rgba(123,47,255,0.4)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Termin buchen
        </a>
      </div>
    </div>
  );
}
