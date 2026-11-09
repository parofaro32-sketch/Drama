import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onBack: () => void;
}

export function BackButton({ onBack }: BackButtonProps) {
  return (
    <button
      onClick={onBack}
      className="inline-flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
    >
      <ArrowLeft size={16} /> Back
    </button>
  );
}
