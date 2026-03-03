'use client';

interface HeroSectionProps {
  onCtaClick: () => void;
}

export default function HeroSection({ onCtaClick }: HeroSectionProps) {
  return (
    <section className="flex flex-col items-center text-center py-16 px-4">
      {/* Avatar */}
      <div className="relative mb-6">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400 to-violet-600 p-0.5 animate-pulse-glow">
          <div className="w-full h-full rounded-full bg-bg-surface flex items-center justify-center">
            <span className="text-4xl font-bold text-accent-cyan font-mono tracking-wider">
              WG
            </span>
          </div>
        </div>
        {/* Online-Indikator */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 block animate-online-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 mb-4 text-emerald-400 text-sm font-mono">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-online-pulse" />
        <span>Online – Bereit für deine Fragen</span>
      </div>

      {/* Name & Titel */}
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
        Wojtek Gorecki
      </h1>
      <p className="text-accent-cyan text-lg font-mono mb-6 tracking-widest uppercase text-sm">
        KI-gestützter Product Owner
      </p>

      {/* Beschreibung / CTA-Text */}
      <p className="text-text-secondary max-w-lg text-base md:text-lg leading-relaxed mb-8">
        Ich stehe dir digital zur Verfügung – stelle mir deine Fragen zu{' '}
        <span className="text-accent-cyan">KI</span>,{' '}
        <span className="text-accent-violet">Product Ownership</span> und der Zukunft der
        Produktentwicklung. Mein digitaler Zwilling antwortet mit meiner Stimme.
      </p>

      {/* CTA Button */}
      <button
        onClick={onCtaClick}
        className="group relative px-8 py-4 rounded-lg font-semibold text-base transition-all duration-300
          bg-gradient-to-r from-cyan-500/10 to-violet-500/10
          border border-accent-cyan/40 text-accent-cyan
          hover:border-accent-cyan hover:bg-accent-cyan/10
          hover:shadow-[0_0_30px_rgba(0,212,255,0.2)]
          focus:outline-none focus:ring-2 focus:ring-accent-cyan/50"
      >
        <span className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-accent-cyan group-hover:animate-ping" />
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
