import { AlertTriangle, X } from 'lucide-react';
import { useAlerts } from '../../utils/AlertContext';

export default function GlobalAlertBar() {
  const { alerts, dismissAlert } = useAlerts();
  const active = alerts[0];

  if (!active) return null;

  const barClass =
    active.level === 'critical'
      ? 'border-red-500/40 bg-red-500/15 text-red-100'
      : 'border-amber-500/40 bg-amber-500/15 text-amber-100';

  return (
    <div className={`border-b px-4 py-2 text-sm ${barClass}`}>
      <div className="mx-auto flex max-w-7xl items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <AlertTriangle size={16} className="mt-0.5" />
          <div>
            <p className="font-semibold">{active.title}</p>
            <p className="text-xs opacity-90">{active.description}</p>
            <p className="text-xs font-medium opacity-95">Suggested action: {active.action}</p>
          </div>
        </div>
        <button
          onClick={() => dismissAlert(active.id)}
          className="rounded-md border border-white/20 bg-white/10 p-1 hover:bg-white/20"
          aria-label="Dismiss alert"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
