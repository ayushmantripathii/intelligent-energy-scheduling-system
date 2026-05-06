import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatCard({ title, value, unit, change, trend, icon: Icon, color = 'green' }) {
  const colors = {
    green: 'from-green-500 to-emerald-600',
    blue: 'from-blue-500 to-indigo-600',
    amber: 'from-amber-500 to-orange-600',
    red: 'from-red-500 to-rose-600',
    purple: 'from-purple-500 to-violet-600',
    cyan: 'from-cyan-500 to-teal-600',
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up'
    ? (title?.toLowerCase().includes('price') || title?.toLowerCase().includes('load')
        ? 'text-red-500' : 'text-green-500')
    : trend === 'down'
      ? (title?.toLowerCase().includes('price') || title?.toLowerCase().includes('load')
          ? 'text-green-500' : 'text-red-500')
      : 'text-slate-400';

  return (
    <div className="rounded-2xl p-4 shadow-xl shadow-black/20 border border-slate-700/60 bg-gradient-to-br from-slate-900/85 to-slate-900/60 backdrop-blur-md hover:-translate-y-0.5 hover:shadow-cyan-500/10 hover:border-cyan-400/35 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <h3 className="text-2xl font-bold text-white metric-glow">{value}</h3>
            {unit && <span className="text-sm text-slate-400">{unit}</span>}
          </div>
          {change && (
            <div className={`flex items-center gap-1 mt-1.5 text-xs font-medium ${trendColor}`}>
              <TrendIcon size={13} />
              <span>{change} from last period</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center shadow-lg shadow-black/20 group-hover:scale-105 transition-transform duration-200`}>
            <Icon size={18} className="text-white" />
          </div>
        )}
      </div>
    </div>
  );
}
