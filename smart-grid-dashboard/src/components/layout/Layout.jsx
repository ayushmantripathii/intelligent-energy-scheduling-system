import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import GlobalAlertBar from '../alerts/GlobalAlertBar';
import GlobalAlertToasts from '../alerts/GlobalAlertToasts';

export default function Layout() {
  const location = useLocation();
  const pageTitle = {
    '/dashboard': 'Dashboard',
    '/prediction': 'Energy Prediction',
    '/scheduler': 'Workload Scheduler',
    '/cost': 'Cost Optimizer',
    '/renewable': 'Renewable Utilization',
    '/simulation': 'Simulation Lab',
    '/reports': 'Reports',
    '/settings': 'Settings',
  }[location.pathname] || 'Smart Grid Control Center';

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-24 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
      <GlobalAlertBar />
      <GlobalAlertToasts />
      <div className="relative md:flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md md:px-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Live workspace</p>
              <h2 className="mt-1 text-lg font-semibold text-white">{pageTitle}</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-300">
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-300">Telemetry synced</span>
              <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-sky-300">Alerts active</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
          </div>
          <div key={location.pathname} className="page-transition">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
