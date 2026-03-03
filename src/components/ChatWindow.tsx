'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Message } from '@/types/chat';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

const INITIAL_MESSAGE: Message = {
  id: 'initial',
  role: 'assistant',
  content:
    'Hallo! Ich bin der digitale Zwilling von Wojtek Gorecki. Stell mir deine Fragen zu KI, Product Ownership oder der Zukunft der Produktentwicklung – ich antworte dir direkt. Was möchtest du wissen?',
  timestamp: new Date(),
};

interface ChatWindowProps {
  pendingQuestion?: string | null;
  onQuestionConsumed?: () => void;
  chatRef?: React.RefObject<HTMLDivElement | null>;
}

export default function ChatWindow({
  pendingQuestion,
  onQuestionConsumed,
  chatRef,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  // Externes Senden via SuggestedQuestions
  useEffect(() => {
    if (pendingQuestion) {
      sendMessage(pendingQuestion);
      onQuestionConsumed?.();
    }
  }, [pendingQuestion, sendMessage, onQuestionConsumed]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div
      ref={chatRef}
      className="max-w-3xl mx-auto px-4 pb-12"
    >
      <div
        className="rounded-2xl border border-border-primary overflow-hidden
          bg-bg-surface/80 backdrop-blur-xl
          shadow-[0_0_50px_rgba(0,212,255,0.05)]"
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border-primary bg-bg-surface">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/60" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <span className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
          <span className="text-text-muted text-xs font-mono ml-2">
            wojtek.gorecki — digitaler_zwilling
          </span>
          <div className="ml-auto flex items-center gap-1.5 text-emerald-400 text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-online-pulse" />
            live
          </div>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto px-5 py-5 space-y-1 scrollbar-thin">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isLoading && <TypingIndicator />}
          {error && (
            <div className="text-red-400 text-xs text-center py-2 font-mono">
              ⚠ {error}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border-primary px-4 py-4 bg-bg-surface">
          <div className="flex gap-3 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Schreib eine Nachricht... (Enter zum Senden)"
              disabled={isLoading}
              rows={1}
              className="flex-1 resize-none bg-bg-primary border border-border-primary rounded-xl px-4 py-3
                text-white text-sm placeholder-text-muted
                focus:outline-none focus:border-accent-cyan/50 focus:shadow-[0_0_15px_rgba(0,212,255,0.1)]
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200 max-h-32 overflow-y-auto"
              style={{ minHeight: '44px' }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
              }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={isLoading || !input.trim()}
              className="flex-shrink-0 w-11 h-11 rounded-xl bg-accent-cyan/10 border border-accent-cyan/30
                flex items-center justify-center text-accent-cyan
                hover:bg-accent-cyan/20 hover:border-accent-cyan
                hover:shadow-[0_0_15px_rgba(0,212,255,0.2)]
                disabled:opacity-30 disabled:cursor-not-allowed
                transition-all duration-200"
            >
              {isLoading ? (
                <span className="w-4 h-4 border border-accent-cyan/40 border-t-accent-cyan rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
          <p className="text-text-muted text-xs mt-2 text-center font-mono">
            Enter senden · Shift+Enter neue Zeile
          </p>
        </div>
      </div>
    </div>
  );
}
