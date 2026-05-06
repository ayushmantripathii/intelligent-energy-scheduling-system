import { useState } from 'react';
import { Calculator, Zap, AlertTriangle, CheckCircle } from 'lucide-react';

export default function EnergyPredictionForm({ onPredict }) {
  const [inputs, setInputs] = useState({
    currentLoad: 1200,
    renewablePercent: 41,
    serverWorkload: 73,
  });
  const [result, setResult] = useState(null);

  const handlePredict = (e) => {
    e.preventDefault();
    const { currentLoad, renewablePercent, serverWorkload } = inputs;
    // Formula: predicted = currentLoad + (serverWorkload × 0.6 × 10) - (renewablePercent × 0.4 × 10)
    const predicted = Math.round(
      currentLoad + (serverWorkload * 0.6 * 10) - (renewablePercent * 0.4 * 10)
    );
    const efficiency = Math.min(99, Math.max(50, Math.round(100 - (predicted / currentLoad - 1) * 100)));
    const status = predicted > currentLoad * 1.2 ? 'high' : predicted > currentLoad ? 'moderate' : 'optimal';
    const res = { predicted, efficiency, status };
    setResult(res);
    if (onPredict) onPredict(res);
  };

  const statusConfig = {
    optimal: { color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-500/10', border: 'border-green-200 dark:border-green-500/30', icon: CheckCircle, label: 'Optimal — within capacity' },
    moderate: { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10', border: 'border-amber-200 dark:border-amber-500/30', icon: AlertTriangle, label: 'Moderate — plan scaling' },
    high: { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/10', border: 'border-red-200 dark:border-red-500/30', icon: AlertTriangle, label: 'High demand — schedule off‑peak' },
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xs border border-slate-200/80 dark:border-slate-700/50 overflow-hidden">
      <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-700/50 flex items-center gap-2">
        <Calculator size={16} className="text-green-500" />
        <h3 className="text-sm font-semibold text-slate-800 dark:text-white">Energy Demand Prediction</h3>
      </div>
      <div className="p-5">
        <form onSubmit={handlePredict} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                Current Load (kWh)
              </label>
              <input
                type="number"
                value={inputs.currentLoad}
                onChange={e => setInputs({ ...inputs, currentLoad: +e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50"
                min={0}
                max={5000}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                Renewable Energy (%)
              </label>
              <input
                type="number"
                value={inputs.renewablePercent}
                onChange={e => setInputs({ ...inputs, renewablePercent: +e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50"
                min={0}
                max={100}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                Server Workload (%)
              </label>
              <input
                type="number"
                value={inputs.serverWorkload}
                onChange={e => setInputs({ ...inputs, serverWorkload: +e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50"
                min={0}
                max={100}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg shadow-lg shadow-green-500/25 transition-colors"
            >
              <Zap size={14} /> Predict Demand
            </button>
            <p className="text-[11px] text-slate-400 italic">
              Formula: Load + (Workload × 6) − (Renewable × 4)
            </p>
          </div>
        </form>

        {/* Result */}
        {result && (
          <div className={`mt-4 p-4 rounded-xl border ${statusConfig[result.status].bg} ${statusConfig[result.status].border}`}>
            <div className="flex items-start gap-3">
              {(() => { const Icon = statusConfig[result.status].icon; return <Icon size={18} className={`${statusConfig[result.status].color} shrink-0 mt-0.5`} />; })()}
              <div className="flex-1">
                <div className="flex flex-wrap items-baseline gap-4">
                  <div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">Predicted Demand</p>
                    <p className="text-xl font-bold text-slate-800 dark:text-white">{result.predicted} <span className="text-sm font-normal text-slate-500">kWh</span></p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">Efficiency Score</p>
                    <p className="text-xl font-bold text-slate-800 dark:text-white">{result.efficiency}<span className="text-sm font-normal text-slate-500">%</span></p>
                  </div>
                </div>
                <p className={`text-xs font-medium mt-2 ${statusConfig[result.status].color}`}>
                  {statusConfig[result.status].label}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
