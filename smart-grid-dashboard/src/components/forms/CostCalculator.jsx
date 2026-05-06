import { useState } from 'react';
import { Calculator, IndianRupee, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';

export default function CostCalculator() {
  const [inputs, setInputs] = useState({
    usage: 1000,
    price: 6.5,
    hours: 24,
  });
  const [result, setResult] = useState(null);

  const handleCalculate = (e) => {
    e.preventDefault();
    const totalCost = inputs.usage * inputs.price * (inputs.hours / 24);
    const optimizedCost = totalCost * 0.78; // 22% savings with smart scheduling
    const savings = totalCost - optimizedCost;
    const isExpensive = inputs.price > 6.5;

    setResult({
      totalCost: Math.round(totalCost),
      optimizedCost: Math.round(optimizedCost),
      savings: Math.round(savings),
      savingsPercent: Math.round((savings / totalCost) * 100),
      isExpensive,
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xs border border-slate-200/80 dark:border-slate-700/50 overflow-hidden">
      <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-700/50 flex items-center gap-2">
        <Calculator size={16} className="text-blue-500" />
        <h3 className="text-sm font-semibold text-slate-800 dark:text-white">Cost Calculator</h3>
      </div>
      <div className="p-5">
        <form onSubmit={handleCalculate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                Energy Usage (kWh)
              </label>
              <input
                type="number"
                value={inputs.usage}
                onChange={e => setInputs({ ...inputs, usage: +e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                min={0}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                Electricity Price (₹/kWh)
              </label>
              <input
                type="number"
                step="0.1"
                value={inputs.price}
                onChange={e => setInputs({ ...inputs, price: +e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                min={0}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                Duration (hours)
              </label>
              <input
                type="number"
                value={inputs.hours}
                onChange={e => setInputs({ ...inputs, hours: +e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                min={1}
                max={720}
              />
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-lg shadow-blue-500/25 transition-colors"
          >
            <IndianRupee size={14} /> Calculate Cost
          </button>
        </form>

        {/* Result */}
        {result && (
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-3 text-center">
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Cost</p>
                <p className="text-lg font-bold text-slate-800 dark:text-white mt-0.5">₹{result.totalCost.toLocaleString()}</p>
              </div>
              <div className="bg-green-50 dark:bg-green-500/10 rounded-lg p-3 text-center">
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">Optimized</p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400 mt-0.5">₹{result.optimizedCost.toLocaleString()}</p>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-lg p-3 text-center">
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">Savings</p>
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">₹{result.savings.toLocaleString()}</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-500/10 rounded-lg p-3 text-center">
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">Savings %</p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-0.5">{result.savingsPercent}%</p>
              </div>
            </div>

            {result.isExpensive && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-lg">
                <AlertTriangle size={15} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  <span className="font-semibold">High price alert!</span> Current rate exceeds ₹6.50/kWh. Consider shifting non-critical workloads to off-peak hours (2 AM – 5 AM) for lower rates.
                </p>
              </div>
            )}

            <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-lg">
              <Lightbulb size={15} className="text-blue-500 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 dark:text-blue-300">
                <span className="font-semibold">AI Tip:</span> Smart scheduling can save up to {result.savingsPercent}% by redistributing workloads to optimal pricing windows.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
