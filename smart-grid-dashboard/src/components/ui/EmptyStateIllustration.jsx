import { Sparkles } from 'lucide-react';

export default function EmptyStateIllustration({
  title = 'Nothing to show yet',
  description = 'Data will appear here once available.',
}) {
  return (
    <div className="premium-empty-state">
      <div className="premium-empty-icon-wrap">
        <Sparkles size={28} className="text-cyan-300" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-100">{title}</h3>
      <p className="mt-1 max-w-sm text-center text-sm text-slate-400">{description}</p>
    </div>
  );
}
