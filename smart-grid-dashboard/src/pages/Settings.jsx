import { useState } from 'react';

export default function Settings() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-semibold">Settings</h2>
        <p className="text-sm text-slate-400">Basic simulation preferences.</p>
      </div>

      <div className="card space-y-4">
        <label className="flex items-center justify-between rounded-lg border border-slate-800 px-3 py-2">
          <span>Auto refresh dashboard every 10s</span>
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={() => setAutoRefresh((prev) => !prev)}
          />
        </label>

        <label className="flex items-center justify-between rounded-lg border border-slate-800 px-3 py-2">
          <span>Peak load notifications</span>
          <input
            type="checkbox"
            checked={notifications}
            onChange={() => setNotifications((prev) => !prev)}
          />
        </label>
      </div>
    </div>
  );
}
