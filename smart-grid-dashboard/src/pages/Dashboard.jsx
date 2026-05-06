import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  BellRing,
  IndianRupee,
  Leaf,
  RefreshCw,
  X,
  TrendingUp,
  Zap,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useAlerts } from '../utils/AlertContext';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';

const randomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function CountUpValue({ value, prefix = '', suffix = '', decimals = 0 }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 900;
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = value * eased;
      setDisplay(start);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [value]);

  return (
    <span>
      {prefix}
      {display.toLocaleString('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

export default function Dashboard() {
  const { alerts, dismissAlert, evaluateTriggers } = useAlerts();
  const [isLoading, setIsLoading] = useState(false);

  const [metrics, setMetrics] = useState({
    totalEnergy: 12850,
    currentCost: 86540,
    renewableUsage: 42,
    carbonEmission: 5890,
    currentPrice: 7.4,
    load: 78,
  });

  const [energyTrend, setEnergyTrend] = useState([
    { time: '08:00', energy: 980 },
    { time: '10:00', energy: 1120 },
    { time: '12:00', energy: 1260 },
    { time: '14:00', energy: 1180 },
    { time: '16:00', energy: 1340 },
    { time: '18:00', energy: 1420 },
    { time: '20:00', energy: 1370 },
  ]);

  const [costBySlot, setCostBySlot] = useState([
    { slot: 'Morning', cost: 18500 },
    { slot: 'Afternoon', cost: 24500 },
    { slot: 'Night', cost: 16200 },
  ]);

  const recentTasks = useMemo(
    () => [
      { task: 'Database Backup', slot: 'Night', cost: 1200, status: 'Scheduled' },
      { task: 'Batch Analytics', slot: 'Afternoon', cost: 1850, status: 'Running' },
      { task: 'Cooling Cycle B', slot: 'Morning', cost: 980, status: 'Completed' },
      { task: 'Container Sync', slot: 'Night', cost: 740, status: 'Scheduled' },
      { task: 'ML Training Job', slot: 'Afternoon', cost: 2290, status: 'Delayed' },
    ],
    [],
  );

  const refreshData = () => {
    setIsLoading(true);

    const nextPrice = Number((Math.random() * 3 + 5.2).toFixed(2));
    const nextRenewable = randomInRange(24, 76);
    const nextEnergy = randomInRange(11800, 14900);
    const nextCost = Number((nextEnergy * nextPrice).toFixed(0));
    const nextLoad = randomInRange(58, 96);
    const gridEnergy = nextEnergy * (1 - nextRenewable / 100);
    const renewableEnergy = nextEnergy * (nextRenewable / 100);
    const nextCarbon = Number((gridEnergy * 0.9 + renewableEnergy * 0.1).toFixed(0));

    setTimeout(() => {
      setMetrics({
        totalEnergy: nextEnergy,
        currentCost: nextCost,
        renewableUsage: nextRenewable,
        carbonEmission: nextCarbon,
        currentPrice: nextPrice,
        load: nextLoad,
      });

      setEnergyTrend((prev) => prev.map((point) => ({ ...point, energy: randomInRange(900, 1550) })));
      setCostBySlot([
        { slot: 'Morning', cost: randomInRange(14000, 22000) },
        { slot: 'Afternoon', cost: randomInRange(19000, 28000) },
        { slot: 'Night', cost: randomInRange(12000, 20000) },
      ]);
      setIsLoading(false);
    }, 600);
  };

  const gridStatus = useMemo(() => {
    if (metrics.currentPrice >= 8 || metrics.renewableUsage < 28) return 'Critical';
    if (metrics.currentPrice >= 7 || metrics.renewableUsage < 40) return 'Peak';
    return 'Stable';
  }, [metrics.currentPrice, metrics.renewableUsage]);

  const insights = useMemo(() => {
    const list = [];
    if (metrics.currentPrice > 7) list.push('Shift 2 workloads to night → save ₹500');
    if (metrics.renewableUsage < 45) list.push('Renewable usage low → increase to reduce emissions');
    if (list.length === 0) list.push('Current workload mix is optimized for both cost and carbon.');
    return list;
  }, [metrics.currentPrice, metrics.renewableUsage]);

  const snapshotCards = useMemo(
    () => [
      {
        label: 'Live price trend',
        value: `₹${metrics.currentPrice.toFixed(2)}/kWh`,
        detail: gridStatus === 'Stable' ? 'Comfortable operating window' : 'Monitor the next peak window',
      },
      {
        label: 'Green mix',
        value: `${metrics.renewableUsage}% renewable`,
        detail: metrics.renewableUsage >= 50 ? 'Healthy renewable contribution' : 'Opportunity to shift more load',
      },
      {
        label: 'Demand pressure',
        value: `${metrics.load}% load`,
        detail: metrics.load >= 85 ? 'High pressure on the grid' : 'Headroom available for scheduling',
      },
    ],
    [gridStatus, metrics.currentPrice, metrics.load, metrics.renewableUsage],
  );

  useEffect(() => {
    evaluateTriggers({
      cost: metrics.currentCost,
      renewable: metrics.renewableUsage,
      load: metrics.load,
    });
  }, [evaluateTriggers, metrics.currentCost, metrics.renewableUsage, metrics.load]);

  const glassClass = 'rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl shadow-black/20';

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <div className={`${glassClass} p-5`}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200/70">Operations overview</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Smart Grid DC Control Center</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Real-time visibility for cost, load, renewable usage, and automated actions across the data center.
              </p>
            </div>
            <button
              onClick={refreshData}
              className="inline-flex items-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:-translate-y-0.5 hover:bg-cyan-400/15"
            >
              <RefreshCw size={16} />
              Refresh Telemetry
            </button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {snapshotCards.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">{item.label}</p>
                <p className="mt-2 text-lg font-semibold text-white">{item.value}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={`${glassClass} p-5`}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Operational notes</p>
          <div className="mt-3 space-y-3">
            <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/10 p-4">
              <p className="text-sm font-semibold text-emerald-200">Current grid state</p>
              <p className="mt-2 text-sm leading-6 text-emerald-100/90">
                {gridStatus === 'Stable'
                  ? 'System is balanced. You have room to schedule heavier jobs without a penalty spike.'
                  : gridStatus === 'Peak'
                    ? 'Demand is approaching the caution zone. Consider shifting batch jobs to later windows.'
                    : 'Grid conditions are critical. Freeze non-essential workloads until the next refresh.'}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <p className="text-sm font-semibold text-white">Actionable cue</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{insights[0]}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className={`${glassClass} p-4 transition hover:-translate-y-1`}>
          <p className="text-xs uppercase tracking-wide text-slate-400">Total Energy Consumption</p>
          {isLoading ? <LoadingSkeleton className="mt-2 h-8 w-44" /> : <p className="mt-2 text-2xl font-bold text-white"><CountUpValue value={metrics.totalEnergy} suffix=" kWh" /></p>}
          <Zap size={18} className="mt-3 text-blue-400" />
        </div>
        <div className={`${glassClass} p-4 transition hover:-translate-y-1`}>
          <p className="text-xs uppercase tracking-wide text-slate-400">Current Cost</p>
          {isLoading ? <LoadingSkeleton className="mt-2 h-8 w-40" /> : <p className="mt-2 text-2xl font-bold text-red-300"><CountUpValue value={metrics.currentCost} prefix="₹" /></p>}
          <IndianRupee size={18} className="mt-3 text-red-400" />
        </div>
        <div className={`${glassClass} p-4 transition hover:-translate-y-1`}>
          <p className="text-xs uppercase tracking-wide text-slate-400">Renewable Usage</p>
          {isLoading ? <LoadingSkeleton className="mt-2 h-8 w-28" /> : <p className="mt-2 text-2xl font-bold text-emerald-300"><CountUpValue value={metrics.renewableUsage} suffix="%" /></p>}
          <Leaf size={18} className="mt-3 text-emerald-400" />
        </div>
        <div className={`${glassClass} p-4 transition hover:-translate-y-1`}>
          <p className="text-xs uppercase tracking-wide text-slate-400">Carbon Emission</p>
          {isLoading ? <LoadingSkeleton className="mt-2 h-8 w-44" /> : <p className="mt-2 text-2xl font-bold text-orange-300"><CountUpValue value={metrics.carbonEmission} suffix=" kg CO2" /></p>}
          <TrendingUp size={18} className="mt-3 text-orange-400" />
        </div>
      </div>

      <div className={`${glassClass} p-4`}>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${gridStatus === 'Stable' ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300' : gridStatus === 'Peak' ? 'border-amber-500/40 bg-amber-500/15 text-amber-300' : 'border-red-500/40 bg-red-500/15 text-red-300'}`}>
            Grid Status: {gridStatus}
          </span>
          <span className="rounded-full border border-blue-500/40 bg-blue-500/15 px-3 py-1 text-xs font-semibold text-blue-300">
            Current Price: ₹{metrics.currentPrice}/kWh
          </span>
          <span className="rounded-full border border-green-500/40 bg-green-500/15 px-3 py-1 text-xs font-semibold text-green-300">
            Renewable Availability: {metrics.renewableUsage}%
          </span>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className={`${glassClass} p-4 xl:col-span-2`}>
          <h3 className="mb-3 text-sm font-semibold text-slate-200">Energy Consumption Over Time</h3>
          <div className="h-72">
            {isLoading ? (
              <LoadingSkeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={energyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                  <XAxis dataKey="time" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '10px',
                    }}
                  />
                  <Line type="monotone" dataKey="energy" stroke="#22d3ee" strokeWidth={3} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className={`${glassClass} p-4`}>
          <h3 className="mb-3 text-sm font-semibold text-slate-200">Cost Per Time Slot</h3>
          <div className="h-72">
            {isLoading ? (
              <LoadingSkeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costBySlot}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                  <XAxis dataKey="slot" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Cost']}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '10px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="cost" fill="#60a5fa" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className={`${glassClass} p-4 lg:col-span-1`}>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-200">
            <BarChart3 size={15} className="text-violet-300" /> AI Insights
          </h3>
          <div className="space-y-2">
            {insights.map((insight) => (
              <div key={insight} className="rounded-lg border border-violet-500/20 bg-violet-500/10 p-2 text-sm text-violet-100">
                {insight}
              </div>
            ))}
          </div>
        </div>

        <div className={`${glassClass} p-4 lg:col-span-1`}>
          <h3 className="mb-3 text-sm font-semibold text-slate-200">Recent Activity</h3>
          <div className="space-y-2">
            {recentTasks.slice(0, 5).map((item) => (
              <div key={item.task} className="rounded-lg border border-slate-700 bg-slate-900/60 p-2">
                <p className="text-sm font-medium text-slate-100">{item.task}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <span>Slot: {item.slot}</span>
                  <span>Cost: ₹{item.cost}</span>
                  <span className={`rounded-full px-2 py-0.5 ${item.status === 'Completed' ? 'bg-emerald-500/15 text-emerald-300' : item.status === 'Delayed' ? 'bg-red-500/15 text-red-300' : 'bg-blue-500/15 text-blue-300'}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`${glassClass} p-4 lg:col-span-1`}>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-200">
            <BellRing size={15} className="text-rose-300" /> Alerts Panel
          </h3>
          <div className="space-y-2">
            {alerts.length === 0 && <p className="text-sm text-emerald-300">No active alerts.</p>}
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`rounded-lg border p-2 text-sm ${alert.level === 'critical' ? 'border-red-500/30 bg-red-500/10 text-red-200' : 'border-amber-500/30 bg-amber-500/10 text-amber-200'}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={14} />
                      <span className="font-medium">{alert.title}</span>
                    </div>
                    <p className="mt-1 text-xs opacity-90">{alert.description}</p>
                    <p className="mt-1 text-xs font-medium">Suggested action: {alert.action}</p>
                  </div>
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="rounded border border-white/20 bg-white/10 p-1 hover:bg-white/20"
                    aria-label="Dismiss alert"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
