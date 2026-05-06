import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowRight, Bolt, ShieldCheck, Sparkles } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      // Allow any defined user to login instantly for the demo
      navigate('/dashboard');
    } else {
      setError('Please enter both username and password.');
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-950 p-4 font-sans text-slate-100">
      <div className="relative grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/55 shadow-2xl shadow-black/30 backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr]">
        <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-10 right-10 h-52 w-52 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative overflow-hidden border-b border-white/10 p-8 lg:border-b-0 lg:border-r lg:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">
            <Sparkles size={13} />
            Smart Grid Control
          </div>

          <div className="mt-8 max-w-xl">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-500 shadow-lg shadow-cyan-500/20">
              <Bolt size={30} className="text-white" />
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Intelligent Energy Scheduling System
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-slate-300 sm:text-base">
              Sign in to monitor workload shifts, carbon-aware decisions, and live cost telemetry from one view.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <Activity size={18} className="text-cyan-300" />
                <p className="mt-3 text-sm font-semibold text-white">Live telemetry</p>
                <p className="mt-1 text-xs text-slate-400">Track load, cost, and renewable usage in real time.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <ShieldCheck size={18} className="text-emerald-300" />
                <p className="mt-3 text-sm font-semibold text-white">Safer operations</p>
                <p className="mt-1 text-xs text-slate-400">Reduce peak spikes with planned scheduling windows.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <ArrowRight size={18} className="text-sky-300" />
                <p className="mt-3 text-sm font-semibold text-white">Fast access</p>
                <p className="mt-1 text-xs text-slate-400">Enter any credentials to open the demo dashboard.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative p-8 lg:p-10">
          <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/55 p-6 shadow-xl shadow-black/20">
            <div className="mb-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Secure access</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Welcome back</h2>
              <p className="mt-2 text-sm text-slate-400">Use your demo credentials to continue into the control center.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Admin"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 transition focus:border-cyan-400/50 focus:bg-slate-900/80 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 transition focus:border-cyan-400/50 focus:bg-slate-900/80 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/20 active:translate-y-0"
              >
                Enter Dashboard
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
