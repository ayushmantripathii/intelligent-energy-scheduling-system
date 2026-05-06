import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import ChartCard from '../components/cards/ChartCard';
import StatCard from '../components/cards/StatCard';
import { renewableOverview, solarData, windData, monthlyRenewable } from '../data/renewableData';
import { Sun, Wind, Leaf, TreePine, Gauge, BatteryCharging } from 'lucide-react';

function GaugeChart({ value, max = 100, label, color = '#22C55E' }) {
  const pct = (value / max) * 100;
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (pct / 100) * circumference * 0.75;

  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="110" viewBox="0 0 140 110">
        <circle cx="70" cy="70" r="45" fill="none" stroke="#e2e8f0" strokeWidth="12"
          strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
          strokeLinecap="round" transform="rotate(135 70 70)" className="dark:stroke-slate-700" />
        <circle cx="70" cy="70" r="45" fill="none" stroke={color} strokeWidth="12"
          strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
          strokeDashoffset={offset} strokeLinecap="round" transform="rotate(135 70 70)"
          style={{ transition: 'stroke-dashoffset 1s ease' }} />
        <text x="70" y="65" textAnchor="middle" className="fill-slate-800 dark:fill-white text-2xl font-bold" style={{ fontSize: '24px', fontWeight: 700 }}>
          {value}%
        </text>
        <text x="70" y="85" textAnchor="middle" className="fill-slate-500 dark:fill-slate-400" style={{ fontSize: '10px' }}>
          {label}
        </text>
      </svg>
    </div>
  );
}

export default function RenewableEnergy() {
  const { totalRenewable, solarContribution, windContribution, sustainabilityScore, carbonSaved, treesEquivalent, totalCapacity, currentGeneration } = renewableOverview;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Renewable Energy Integration</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Solar & wind energy contribution and sustainability metrics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Solar Contribution" value={`${solarContribution}`} unit="%" icon={Sun} color="amber" />
        <StatCard title="Wind Contribution" value={`${windContribution}`} unit="%" icon={Wind} color="blue" />
        <StatCard title="Total Capacity" value={totalCapacity} icon={BatteryCharging} color="green" />
        <StatCard title="Current Generation" value={currentGeneration} icon={Gauge} color="cyan" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xs border border-slate-200/80 dark:border-slate-700/50 p-5 flex flex-col items-center">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-3">Renewable Percentage</h3>
          <GaugeChart value={totalRenewable} label="of total energy" color="#22C55E" />
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xs border border-slate-200/80 dark:border-slate-700/50 p-5 flex flex-col items-center">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-3">Sustainability Score</h3>
          <GaugeChart value={sustainabilityScore} label="out of 100" color="#3B82F6" />
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xs border border-slate-200/80 dark:border-slate-700/50 p-5 flex flex-col items-center">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-3">Environmental Impact</h3>
          <div className="flex flex-col items-center gap-3 mt-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-500/15 rounded-lg flex items-center justify-center">
                <Leaf size={20} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-800 dark:text-white">{carbonSaved}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">CO₂ Saved</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/15 rounded-lg flex items-center justify-center">
                <TreePine size={20} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-800 dark:text-white">{treesEquivalent}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Trees Equivalent</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Solar Energy Generation" subtitle="Today's solar output (kW)">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={solarData}>
                <defs>
                  <linearGradient id="colorSolarRen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }} formatter={(v) => `${v} kW`} />
                <Area type="monotone" dataKey="generation" stroke="#F59E0B" fill="url(#colorSolarRen)" strokeWidth={2.5} name="Solar (kW)" animationDuration={800} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Wind Energy Generation" subtitle="Today's wind output (kW)">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={windData}>
                <defs>
                  <linearGradient id="colorWindRen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} domain={[0, 200]} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }} formatter={(v) => `${v} kW`} />
                <Area type="monotone" dataKey="generation" stroke="#3B82F6" fill="url(#colorWindRen)" strokeWidth={2.5} name="Wind (kW)" animationDuration={800} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Monthly Renewable Energy Generation" subtitle="6-month trend (kWh)">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRenewable}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }} formatter={(v) => `${v.toLocaleString()} kWh`} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="solar" name="Solar" fill="#F59E0B" radius={[4, 4, 0, 0]} animationDuration={800} />
              <Bar dataKey="wind" name="Wind" fill="#3B82F6" radius={[4, 4, 0, 0]} animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
}
