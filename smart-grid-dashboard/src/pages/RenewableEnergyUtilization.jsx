import { useMemo, useState } from 'react';
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { CircleGauge, Leaf, Sparkles, TrendingDown, Zap, Gauge } from 'lucide-react';

const TOTAL_ENERGY_KWH = 1000;
const GRID_EMISSION_FACTOR = 0.9;
const RENEWABLE_EMISSION_FACTOR = 0.1;

function CircularScore({ value }) {
  const safeValue = Math.min(100, Math.max(0, value));
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safeValue / 100) * circumference;

  return (
    <div className="relative h-32 w-32">
      <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} stroke="#1e293b" strokeWidth="10" fill="none" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="#22c55e"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 700ms ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-emerald-300">{safeValue}%</span>
        <span className="text-[10px] uppercase tracking-wider text-slate-400">Score</span>
      </div>
    </div>
  );
}

export default function RenewableEnergyUtilization() {
  const [percentage, setPercentage] = useState(45);
  const [result, setResult] = useState(() => {
    const renewableEnergy = Number(((45 / 100) * TOTAL_ENERGY_KWH).toFixed(2));
    const gridEnergy = Number((TOTAL_ENERGY_KWH - renewableEnergy).toFixed(2));
    const totalCarbon = Number(
      ((gridEnergy * GRID_EMISSION_FACTOR) + (renewableEnergy * RENEWABLE_EMISSION_FACTOR)).toFixed(2),
    );
    return { renewableEnergy, gridEnergy, percentage: 45, totalCarbon };
  });

  const handleAnalyze = () => {
    const safePercentage = Math.min(100, Math.max(0, Number(percentage) || 0));
    const renewableEnergy = Number(((safePercentage / 100) * TOTAL_ENERGY_KWH).toFixed(2));
    const gridEnergy = Number((TOTAL_ENERGY_KWH - renewableEnergy).toFixed(2));
    const totalCarbon = Number(
      ((gridEnergy * GRID_EMISSION_FACTOR) + (renewableEnergy * RENEWABLE_EMISSION_FACTOR)).toFixed(2),
    );

    setResult({ renewableEnergy, gridEnergy, percentage: safePercentage, totalCarbon });
  };

  const chartData = useMemo(() => {
    return [
      { name: 'Renewable', value: result.renewableEnergy, color: '#22c55e' },
      { name: 'Grid', value: result.gridEnergy, color: '#3b82f6' },
    ];
  }, [result]);

  const sustainabilityLevel = useMemo(() => {
    if (result.percentage <= 40) return 'Low';
    if (result.percentage <= 70) return 'Medium';
    return 'High';
  }, [result.percentage]);

  const efficiencyRating = useMemo(() => {
    if (result.percentage < 40) return 'Poor';
    if (result.percentage < 70) return 'Moderate';
    return 'Efficient';
  }, [result.percentage]);

  const trendSimulation = useMemo(() => {
    const boostedPercent = Math.min(100, result.percentage + 10);
    const boostedRenewable = (boostedPercent / 100) * TOTAL_ENERGY_KWH;
    const boostedGrid = TOTAL_ENERGY_KWH - boostedRenewable;
    const boostedCarbon = (boostedGrid * GRID_EMISSION_FACTOR) + (boostedRenewable * RENEWABLE_EMISSION_FACTOR);
    const savedCarbon = Number((result.totalCarbon - boostedCarbon).toFixed(2));
    return {
      boostedPercent,
      savedCarbon: Math.max(0, savedCarbon),
    };
  }, [result]);

  const aiInsight = useMemo(() => {
    const targetPercent = Math.min(100, result.percentage + 15);
    const targetRenewable = (targetPercent / 100) * TOTAL_ENERGY_KWH;
    const targetGrid = TOTAL_ENERGY_KWH - targetRenewable;
    const targetCarbon = (targetGrid * GRID_EMISSION_FACTOR) + (targetRenewable * RENEWABLE_EMISSION_FACTOR);
    const reductionPct = result.totalCarbon > 0
      ? Math.round(((result.totalCarbon - targetCarbon) / result.totalCarbon) * 100)
      : 0;

    return `Increase renewable usage by 15% to reduce carbon by ${Math.max(0, reductionPct)}%`;
  }, [result]);

  const renewableWidth = `${Math.max(0, Math.min(100, result.percentage))}%`;
  const gridWidth = `${Math.max(0, Math.min(100, 100 - result.percentage))}%`;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white">Energy Intelligence Dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">Optimizing for sustainable energy</p>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-green-400/30 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-300">
          <Leaf size={14} />
          Sustainable Mix
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="card border border-slate-800 bg-slate-900/80 p-5 sm:p-6">
          <label className="block text-sm font-medium text-slate-300">
            Renewable Energy Percentage (%)
            <input
              type="number"
              min="0"
              max="100"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
            />
          </label>

          <button
            onClick={handleAnalyze}
            className="mt-4 inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-500"
          >
            Analyze Usage
          </button>

          <div className="mt-5 space-y-3">
            <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3">
              <p className="text-xs uppercase tracking-wide text-green-300">Renewable Energy (kWh)</p>
              <p className="mt-1 text-2xl font-bold text-green-400">
                {result ? result.renewableEnergy.toLocaleString('en-IN') : '0'}
              </p>
            </div>

            <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-3">
              <p className="text-xs uppercase tracking-wide text-blue-300">Grid Energy (kWh)</p>
              <p className="mt-1 text-2xl font-bold text-blue-300">
                {result ? result.gridEnergy.toLocaleString('en-IN') : TOTAL_ENERGY_KWH.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-lg border border-slate-700 bg-slate-950/60 p-3">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Gauge size={13} /> Comparison Bar
            </div>
            <div className="h-4 w-full overflow-hidden rounded-full bg-slate-800">
              <div className="flex h-full">
                <div className="bg-green-500 transition-all duration-700" style={{ width: renewableWidth }} />
                <div className="bg-blue-500/80 transition-all duration-700" style={{ width: gridWidth }} />
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
              <span>Renewable: {result.percentage}%</span>
              <span>Grid: {100 - result.percentage}%</span>
            </div>
          </div>
        </div>

        <div className="card border border-slate-800 bg-slate-900/80 p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-slate-200">Renewable vs Grid</h2>
          <p className="mt-1 text-xs text-slate-400">Total energy assumed: {TOTAL_ENERGY_KWH.toLocaleString('en-IN')} kWh</p>

          <div className="mt-4 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={56}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '10px',
                    color: '#e2e8f0',
                  }}
                  formatter={(value) => [`${Number(value).toLocaleString('en-IN')} kWh`, 'Energy']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 rounded-md border border-slate-700 bg-slate-800/70 px-3 py-2 text-slate-300">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
              Renewable
            </div>
            <div className="flex items-center gap-2 rounded-md border border-slate-700 bg-slate-800/70 px-3 py-2 text-slate-300">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
              Grid
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="card border border-red-500/30 bg-red-500/10 p-4 transition-all duration-300 hover:-translate-y-0.5">
          <div className="mb-2 flex items-center gap-2 text-red-300">
            <TrendingDown size={15} />
            <p className="text-xs uppercase tracking-wide">Carbon Emission</p>
          </div>
          <p className="text-2xl font-bold text-red-300">{result.totalCarbon.toLocaleString('en-IN')} kg CO2</p>
        </div>

        <div className="card border border-green-500/30 bg-green-500/10 p-4 transition-all duration-300 hover:-translate-y-0.5">
          <div className="mb-2 flex items-center gap-2 text-green-300">
            <CircleGauge size={15} />
            <p className="text-xs uppercase tracking-wide">Sustainability Score</p>
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-2xl font-bold text-green-300">{result.percentage}</p>
            <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
              sustainabilityLevel === 'High' ? 'bg-green-500/20 text-green-300' :
              sustainabilityLevel === 'Medium' ? 'bg-amber-500/20 text-amber-300' : 'bg-red-500/20 text-red-300'
            }`}>
              {sustainabilityLevel}
            </span>
          </div>
        </div>

        <div className="card border border-sky-500/30 bg-sky-500/10 p-4 transition-all duration-300 hover:-translate-y-0.5">
          <div className="mb-2 flex items-center gap-2 text-sky-300">
            <Zap size={15} />
            <p className="text-xs uppercase tracking-wide">Efficiency Rating</p>
          </div>
          <p className="text-2xl font-bold text-sky-300">{efficiencyRating}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card border border-slate-800 bg-slate-900/80 p-5">
          <h3 className="text-sm font-semibold text-slate-200">Sustainability Progress</h3>
          <div className="mt-4 flex items-center justify-center">
            <CircularScore value={result.percentage} />
          </div>
          <p className="mt-3 text-center text-xs text-slate-400">Score scale: 0-40 Low, 40-70 Medium, 70+ High</p>
        </div>

        <div className="card border border-slate-800 bg-slate-900/80 p-5">
          <h3 className="text-sm font-semibold text-slate-200">Trend Simulation</h3>
          <p className="mt-2 text-sm text-slate-300">
            If renewable increases by +10%, savings =
            <span className="font-semibold text-emerald-300"> {trendSimulation.savedCarbon.toLocaleString('en-IN')} kg CO2</span>
          </p>
          <p className="mt-1 text-xs text-slate-400">Projected renewable share: {trendSimulation.boostedPercent}%</p>
        </div>
      </div>

      <div className="card border border-emerald-500/30 bg-emerald-500/10 p-5">
        <div className="mb-2 flex items-center gap-2 text-emerald-300">
          <Sparkles size={16} />
          <h3 className="text-sm font-semibold">AI Insight</h3>
        </div>
        <p className="text-sm text-emerald-100">{aiInsight}</p>
      </div>
    </div>
  );
}