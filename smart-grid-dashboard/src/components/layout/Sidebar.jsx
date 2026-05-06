import {
  Bolt,
  CalendarClock,
  FileText,
  Gauge,
  LineChart,
  Leaf,
  Settings,
  ShieldCheck,
  WalletCards,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: Gauge },
  { to: '/prediction', label: 'Energy Prediction', icon: Bolt },
  { to: '/scheduler', label: 'Workload Scheduler', icon: CalendarClock },
  { to: '/cost', label: 'Cost Optimizer', icon: WalletCards },
  { to: '/renewable', label: 'Renewable Utilization', icon: Leaf },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="md:sticky md:top-0 md:h-screen md:w-72 border-b md:border-b-0 md:border-r border-white/10 bg-slate-950/70 backdrop-blur-md">
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-500 shadow-lg shadow-cyan-500/20">
            <LineChart size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">Smart Grid DC</h1>
            <p className="mt-1 text-xs text-slate-400">Intelligent Energy Scheduling</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/10 p-3">
            <p className="text-[10px] uppercase tracking-[0.14em] text-emerald-300">Grid health</p>
            <p className="mt-1 text-base font-semibold text-white">96.2%</p>
          </div>
          <div className="rounded-2xl border border-sky-500/15 bg-sky-500/10 p-3">
            <p className="text-[10px] uppercase tracking-[0.14em] text-sky-300">Response time</p>
            <p className="mt-1 text-base font-semibold text-white">1.2s</p>
          </div>
        </div>
      </div>

      <nav className="flex gap-2 overflow-x-auto px-3 py-4 md:block md:space-y-2 md:overflow-x-visible">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex min-w-max items-center gap-3 rounded-2xl border px-3 py-2.5 text-sm transition ${
                isActive
                  ? 'border-cyan-400/25 bg-cyan-400/10 text-cyan-200 shadow-lg shadow-cyan-500/10'
                  : 'border-transparent text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon size={16} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mx-3 mt-4 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300 md:mx-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
          <ShieldCheck size={14} className="text-emerald-300" />
          Protected Operations
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Forecast loads, shift heavy jobs, and protect uptime with a clearer operational view.
        </p>
      </div>
    </aside>
  );
}
