export default function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 mb-4">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-violet-600 p-0.5 flex-shrink-0">
        <div className="w-full h-full rounded-full bg-bg-surface flex items-center justify-center">
          <span className="text-xs font-bold text-accent-cyan">WG</span>
        </div>
      </div>

      {/* Dots */}
      <div className="bg-bg-surface-2 border border-border-primary rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex gap-1.5 items-center h-4">
          <span className="w-2 h-2 rounded-full bg-accent-cyan/60 animate-typing [animation-delay:0ms]" />
          <span className="w-2 h-2 rounded-full bg-accent-cyan/60 animate-typing [animation-delay:200ms]" />
          <span className="w-2 h-2 rounded-full bg-accent-cyan/60 animate-typing [animation-delay:400ms]" />
        </div>
      </div>
    </div>
  );
}
