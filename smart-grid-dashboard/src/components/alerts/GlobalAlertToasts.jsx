import { AlertTriangle, X } from 'lucide-react';
import { useAlerts } from '../../utils/AlertContext';

export default function GlobalAlertToasts() {
  const { alerts, dismissAlert } = useAlerts();

  return (
    <div className="pointer-events-none fixed right-4 top-16 z-50 flex w-full max-w-sm flex-col gap-2">
      {alerts.slice(0, 3).map((alert) => (
        <div
          key={alert.id}
          className={`pointer-events-auto rounded-xl border p-3 shadow-lg backdrop-blur-sm transition-all duration-300 ${
            alert.level === 'critical'
              ? 'border-red-500/40 bg-red-950/70 text-red-100'
              : 'border-amber-500/40 bg-amber-950/70 text-amber-100'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="mt-0.5" />
              <div>
                <p className="text-sm font-semibold">{alert.title}</p>
                <p className="text-xs opacity-90">{alert.description}</p>
                <p className="text-xs font-medium">Action: {alert.action}</p>
              </div>
            </div>
            <button
              onClick={() => dismissAlert(alert.id)}
              className="rounded-md border border-white/20 bg-white/10 p-1 hover:bg-white/20"
              aria-label="Dismiss alert"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
