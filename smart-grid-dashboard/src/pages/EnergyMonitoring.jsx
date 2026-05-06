import { useState, useEffect, useCallback } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import ChartCard from '../components/cards/ChartCard';
import StatCard from '../components/cards/StatCard';
import StatusBadge from '../components/cards/StatusBadge';
import { clusterEnergyData, realtimeEnergyData } from '../data/energyData';
import { Activity, Zap, Server, Gauge, RefreshCw } from 'lucide-react';

function jitter(data, keys, range = 0.04) {
  return data.map(item => {
    const copy = { ...item };
    keys.forEach(k => {
      if (typeof copy[k] === 'number') {
        copy[k] = Math.round(copy[k] * (1 + (Math.random() - 0.5) * range));
      }
    });
    return copy;
  });
}

export default function EnergyMonitoring() {
  const [dateRange, setDateRange] = useState('today');
  const [realtimeData, setRealtimeData] = useState(realtimeEnergyData);
  const [clusters, setClusters] = useState(clusterEnergyData);

  const refreshData = useCallback(() => {
    setRealtimeData(jitter(realtimeEnergyData, ['consumption', 'renewable', 'grid'], 0.05));
    setClusters(prev => prev.map(c => ({
      ...c,
      load: Math.min(100, Math.max(10, c.load + Math.round((Math.random() - 0.5) * 6))),
    })));
  }, []);

  useEffect(() => {
    const interval = setInterval(refreshData, 10000);
    return () => clearInterval(interval);
  }, [refreshData]);

  useEffect(() => {
    const handler = () => refreshData();
    window.addEventListener('dashboard-refresh', handler);
    return () => window.removeEventListener('dashboard-refresh', handler);
  }, [refreshData]);

  const totalConsumption = clusters.reduce((sum, c) => sum + c.consumption, 0);
  const avgLoad = Math.round(clusters.reduce((sum, c) => sum + c.load, 0) / clusters.length);
  const activeCount = clusters.filter(c => c.status === 'Normal' || c.status === 'Warning').length;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Energy Monitoring</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Real-time energy consumption across server clusters</p>
        </div>
        <select
          value={dateRange}
          onChange={e => setDateRange(e.target.value)}
          className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Consumption" value={totalConsumption.toLocaleString()} unit="kWh" icon={Zap} color="green" />
        <StatCard title="Average Load" value={`${avgLoad}`} unit="%" icon={Gauge} color="blue" />
        <StatCard title="Active Clusters" value={`${activeCount}/${clusters.length}`} icon={Server} color="cyan" />
        <StatCard title="Peak Usage" value="1,350" unit="kWh" icon={Activity} color="amber" />
      </div>

      <ChartCard
        title="Real-time Energy Consumption"
        subtitle="Live monitoring of energy sources (kWh)"
        action={
          <button onClick={refreshData} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" title="Refresh">
            <RefreshCw size={14} />
          </button>
        }
      >
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={realtimeData}>
              <defs>
                <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorRenewable" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
              <Area type="monotone" dataKey="consumption" stroke="#22C55E" fill="url(#colorConsumption)" strokeWidth={2.5} name="Total" animationDuration={800} />
              <Area type="monotone" dataKey="renewable" stroke="#F59E0B" fill="url(#colorRenewable)" strokeWidth={2} name="Renewable" animationDuration={800} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xs border border-slate-200/80 dark:border-slate-700/50 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-700/50">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-white">Server Cluster Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                <th className="px-5 py-3">Cluster</th>
                <th className="px-5 py-3">Consumption</th>
                <th className="px-5 py-3">Load</th>
                <th className="px-5 py-3">Efficiency</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {clusters.map((cluster, i) => (
                <tr key={i} className="text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-5 py-2.5 font-medium">{cluster.name}</td>
                  <td className="px-5 py-2.5">{cluster.consumption} kWh</td>
                  <td className="px-5 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden max-w-[100px]">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${cluster.load > 85 ? 'bg-red-500' : cluster.load > 70 ? 'bg-amber-500' : 'bg-green-500'}`}
                          style={{ width: `${cluster.load}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium w-8">{cluster.load}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-2.5">{cluster.efficiency}%</td>
                  <td className="px-5 py-2.5"><StatusBadge status={cluster.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
