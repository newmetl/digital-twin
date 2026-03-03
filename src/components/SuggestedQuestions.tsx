'use client';

const SUGGESTED_QUESTIONS = [
  'Was unterscheidet dich von einem klassischen Product Owner?',
  'Wie verändert KI die Produktentwicklung konkret?',
  'Wie hast du deine Website in 4 Stunden gebaut?',
  'Wie können wir zusammenarbeiten?',
];

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
  disabled?: boolean;
}

export default function SuggestedQuestions({ onSelect, disabled }: SuggestedQuestionsProps) {
  return (
    <div className="px-4 mb-6">
      <p className="text-text-muted text-xs font-mono uppercase tracking-widest mb-3 text-center">
        Schnellfragen
      </p>
      <div className="flex flex-wrap gap-2 justify-center max-w-3xl mx-auto">
        {SUGGESTED_QUESTIONS.map((question) => (
          <button
            key={question}
            onClick={() => onSelect(question)}
            disabled={disabled}
            className="px-4 py-2 rounded-lg text-sm text-text-secondary border border-border-primary
              bg-bg-surface hover:border-accent-cyan/50 hover:text-accent-cyan
              hover:bg-accent-cyan/5 transition-all duration-200
              disabled:opacity-40 disabled:cursor-not-allowed
              focus:outline-none focus:ring-1 focus:ring-accent-cyan/30"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}
