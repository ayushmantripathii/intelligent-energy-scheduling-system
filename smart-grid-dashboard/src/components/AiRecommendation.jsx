import { Sparkles } from 'lucide-react';

export default function AiRecommendation({ message }) {
  if (!message) return null;

  return (
    <div className="mb-6 flex items-start gap-3 rounded-xl border border-purple-500/30 bg-purple-500/10 p-4 text-purple-200 shadow-md">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
        <Sparkles size={16} />
      </div>
      <div>
        <h4 className="text-sm font-bold text-purple-400">AI Suggestion</h4>
        <p className="mt-1 text-sm">{message}</p>
      </div>
    </div>
  );
}
