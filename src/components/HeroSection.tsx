'use client';

import Image from 'next/image';
import { useState } from 'react';

interface HeroSectionProps {
  onCtaClick: () => void;
}

export default function HeroSection({ onCtaClick }: HeroSectionProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <section className="flex flex-col items-center text-center py-16 px-4">
      {/* Avatar */}
      <div className="relative mb-6">
        {/* Äußerer Glow-Ring */}
        <div
          className="w-44 h-44 rounded-full p-0.5 animate-pulse-glow"
          style={{
            background: 'linear-gradient(135deg, #00d4ff, #7b2fff)',
          }}
        >
          {/* Innerer Kreis mit Foto */}
          <div className="w-full h-full rounded-full overflow-hidden bg-bg-surface">
            {!imgError ? (
              <Image
                src="/avatar.jpg"
                alt="Wojtek Gorecki"
                width={176}
                height={176}
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center center' }}
                priority
                onError={() => setImgError(true)}
              />
            ) : (
              /* Fallback: Initialen */
              <div className="w-full h-full flex items-center justify-center">
                <span
                  className="text-4xl font-bold"
                  style={{
                    color: '#00d4ff',
                    fontFamily: 'var(--font-space-mono, monospace)',
                  }}
                >
                  WG
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Online-Indikator */}
        <div className="absolute bottom-2 right-2">
          <span
            className="w-4 h-4 rounded-full bg-emerald-400 block animate-online-pulse"
            style={{ boxShadow: '0 0 8px rgba(52,211,153,0.9), 0 0 16px rgba(52,211,153,0.4)' }}
          />
        </div>
      </div>

      {/* Status */}
      <div
        className="flex items-center gap-2 mb-4 text-sm"
        style={{ color: '#34d399', fontFamily: 'var(--font-space-mono, monospace)' }}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-online-pulse" />
        <span>Online – Bereit für deine Fragen</span>
      </div>

      {/* Name & Titel */}
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
        Wojtek Gorecki
      </h1>
      <p
        className="mb-6 tracking-widest uppercase text-sm"
        style={{ color: '#00d4ff', fontFamily: 'var(--font-space-mono, monospace)' }}
      >
        KI-gestützter Product Owner
      </p>

      {/* Beschreibung */}
      <p
        className="max-w-lg text-base md:text-lg leading-relaxed mb-8"
        style={{ color: '#a0a0b0' }}
      >
        Ich stehe dir digital zur Verfügung – stelle mir deine Fragen zu{' '}
        <span style={{ color: '#00d4ff' }}>KI</span>,{' '}
        <span style={{ color: '#7b2fff' }}>Product Ownership</span> und der Zukunft der
        Produktentwicklung. Mein digitaler Zwilling antwortet mit meiner Stimme.
      </p>

      {/* CTA Button */}
      <button
        onClick={onCtaClick}
        className="group relative px-8 py-4 rounded-lg font-semibold text-base transition-all duration-300
          focus:outline-none"
        style={{
          background: 'linear-gradient(135deg, rgba(0,212,255,0.08), rgba(123,47,255,0.08))',
          border: '1px solid rgba(0,212,255,0.4)',
          color: '#00d4ff',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = '#00d4ff';
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            '0 0 30px rgba(0,212,255,0.2)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,212,255,0.4)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
        }}
      >
        <span className="flex items-center gap-3">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: '#00d4ff' }}
          />
          Gespräch starten
          <svg
            className="w-4 h-4 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </span>
      </button>
    </section>
  );
}
