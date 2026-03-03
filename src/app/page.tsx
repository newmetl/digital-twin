'use client';

import { useRef, useState } from 'react';
import HeroSection from '@/components/HeroSection';
import SuggestedQuestions from '@/components/SuggestedQuestions';
import ChatWindow from '@/components/ChatWindow';

export default function Home() {
  const chatRef = useRef<HTMLDivElement>(null);
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);

  const scrollToChat = () => {
    chatRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSuggestedQuestion = (question: string) => {
    setPendingQuestion(question);
    scrollToChat();
  };

  return (
    <main className="relative z-10 min-h-screen">
      {/* Hintergrund-Glow oben */}
      <div
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-10"
        style={{
          background: 'radial-gradient(ellipse, rgba(0,212,255,0.4) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      <div className="max-w-4xl mx-auto">
        <HeroSection onCtaClick={scrollToChat} />

        <SuggestedQuestions
          onSelect={handleSuggestedQuestion}
          disabled={false}
        />

        {/* Trennlinie */}
        <div className="flex items-center gap-4 px-4 mb-8 max-w-3xl mx-auto">
          <div
            className="flex-1 h-px"
            style={{ background: 'linear-gradient(to right, transparent, #1e1e30, transparent)' }}
          />
          <span
            className="text-xs tracking-widest uppercase"
            style={{ color: '#5a5a7a', fontFamily: 'var(--font-space-mono, monospace)' }}
          >
            Chat
          </span>
          <div
            className="flex-1 h-px"
            style={{ background: 'linear-gradient(to right, transparent, #1e1e30, transparent)' }}
          />
        </div>

        <ChatWindow
          pendingQuestion={pendingQuestion}
          onQuestionConsumed={() => setPendingQuestion(null)}
          chatRef={chatRef}
        />
      </div>

      {/* Footer */}
      <footer
        className="text-center py-8 text-xs"
        style={{
          color: '#5a5a7a',
          fontFamily: 'var(--font-space-mono, monospace)',
        }}
      >
        <p>
          © {new Date().getFullYear()} Wojtek Gorecki ·{' '}
          <span style={{ color: 'rgba(0,212,255,0.6)' }}>Digitaler Zwilling</span>
          {' · '}powered by{' '}
          <span style={{ color: 'rgba(123,47,255,0.6)' }}>Claude AI</span>
        </p>
      </footer>
    </main>
  );
}
