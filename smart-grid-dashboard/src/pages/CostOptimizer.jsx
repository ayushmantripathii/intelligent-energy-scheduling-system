import { useMemo, useState } from 'react';
import {
  BadgePercent,
  BarChart3,
  Brain,
  CalendarDays,
  Gauge,
  Lightbulb,
  SlidersHorizontal,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
} from 'lucide-react';
import {
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  AreaChart,
} from 'recharts';

export default function CostOptimizer() {
  const [usage, setUsage] = useState(1500);
  const [basePrice, setBasePrice] = useState(6.9);
  const [timeOfUsage, setTimeOfUsage] = useState('Normal');
  const [renewablePercent, setRenewablePercent] = useState(25);
  const [simRenewable, setSimRenewable] = useState(40);
  const [simTimeSlot, setSimTimeSlot] = useState('Off-Peak');

  const result = useMemo(() => {
    const safeUsage = Math.max(0, Number(usage) || 0);
    const safeBasePrice = Math.max(0, Number(basePrice) || 0);
    const safeRenewable = Math.min(100, Math.max(0, Number(renewablePercent) || 0));

    let adjustedPrice = safeBasePrice;
    if (timeOfUsage === 'Peak') adjustedPrice = safeBasePrice * 1.2;
    if (timeOfUsage === 'Off-Peak') adjustedPrice = safeBasePrice * 0.85;

    const discount = safeRenewable * 0.1;
    const finalPrice = adjustedPrice * (1 - discount / 100);

    const baseCost = Number((safeUsage * safeBasePrice).toFixed(2));
    const totalCost = Number((safeUsage * adjustedPrice).toFixed(2));
    const optimizedCost = Number((safeUsage * finalPrice).toFixed(2));
    const savings = Number((totalCost - optimizedCost).toFixed(2));

    const monthlyCost = Number((totalCost * 30).toFixed(2));
    const monthlySavings = Number((savings * 30).toFixed(2));
    const adjustmentValue = Number((totalCost - baseCost).toFixed(2));
    const efficiency = totalCost > 0 ? Number(((savings / totalCost) * 100).toFixed(2)) : 0;

    return {
      safeUsage,
      safeBasePrice,
      safeRenewable,
      baseCost,
      adjustedPrice: Number(adjustedPrice.toFixed(2)),
      discount: Number(discount.toFixed(2)),
      finalPrice: Number(finalPrice.toFixed(2)),
      totalCost,
      optimizedCost,
      savings,
      monthlyCost,
      monthlySavings,
      adjustmentValue,
      renewableDiscountValue: Number((totalCost - optimizedCost).toFixed(2)),
      efficiency,
    };
  }, [usage, basePrice, timeOfUsage, renewablePercent]);

  const whatIf = useMemo(() => {
    let simulatedAdjustedPrice = result.safeBasePrice;
    if (simTimeSlot === 'Peak') simulatedAdjustedPrice = result.safeBasePrice * 1.2;
    if (simTimeSlot === 'Off-Peak') simulatedAdjustedPrice = result.safeBasePrice * 0.85;

    const safeSimRenewable = Math.min(100, Math.max(0, Number(simRenewable) || 0));
    const simDiscount = safeSimRenewable * 0.1;
    const simFinalPrice = simulatedAdjustedPrice * (1 - simDiscount / 100);
    const simOptimizedCost = Number((result.safeUsage * simFinalPrice).toFixed(2));
    const simMonthlyCost = Number((simOptimizedCost * 30).toFixed(2));
    const monthlyDelta = Number((result.monthlyCost - simMonthlyCost).toFixed(2));

    return {
      simOptimizedCost,
      simMonthlyCost,
      monthlyDelta,
      simDiscount,
    };
  }, [result, simRenewable, simTimeSlot]);

  const costTrendData = useMemo(() => {
    const factors = [0.95, 1.03, 0.98, 1.06, 0.99, 1.04, 1.01];
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return labels.map((day, idx) => ({
      day,
      cost: Number((result.optimizedCost * factors[idx]).toFixed(2)),
    }));
  }, [result.optimizedCost]);

  const pieCostDistribution = useMemo(() => {
    const peakCost = result.safeUsage * result.safeBasePrice * 1.2;
    const normalCost = result.safeUsage * result.safeBasePrice;
    const offPeakCost = result.safeUsage * result.safeBasePrice * 0.85;
    return [
      { name: 'Peak Cost', value: Number(peakCost.toFixed(2)), color: '#ef4444' },
      { name: 'Normal Cost', value: Number(normalCost.toFixed(2)), color: '#3b82f6' },
      { name: 'Off-Peak Cost', value: Number(offPeakCost.toFixed(2)), color: '#22c55e' },
    ];
  }, [result.safeUsage, result.safeBasePrice]);

  const savingsBreakdown = useMemo(() => {
    const peakReferenceCost = result.safeUsage * result.safeBasePrice * 1.2;
    const timeShiftingSavings = Number(Math.max(0, peakReferenceCost - result.totalCost).toFixed(2));
    const renewableSavings = Number(result.renewableDiscountValue.toFixed(2));
    return [
      { name: 'Renewable Savings', value: renewableSavings },
      { name: 'Time Shift Savings', value: timeShiftingSavings },
    ];
  }, [result]);

  const recommendations = useMemo(() => {
    const items = [];
    if (timeOfUsage === 'Peak') {
      items.push('Shift usage to off-peak hours');
    }
    if ((Number(renewablePercent) || 0) < 30) {
      items.push('Increase renewable usage to save more');
    }
    if (items.length === 0) {
      items.push('Current setup is well-optimized. Continue monitoring tariff windows.');
    }
    return items;
  }, [timeOfUsage, renewablePercent]);

  const recommendedAction = useMemo(() => {
    const targetRenewable = Math.max(40, result.safeRenewable);
    let recommendedAdjusted = result.safeBasePrice * 0.85;
    const targetDiscount = targetRenewable * 0.1;
    recommendedAdjusted = recommendedAdjusted * (1 - targetDiscount / 100);
    const recommendedMonthly = result.safeUsage * recommendedAdjusted * 30;
    const save = Math.max(0, Number((result.monthlyCost - recommendedMonthly).toFixed(2)));
    return `Switching to Off-Peak + ${targetRenewable}% renewable can save \u20b9${save.toLocaleString('en-IN')}/month`;
  }, [result]);

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white">Smart Energy Cost Analysis</h1>
          <p className="text-sm text-slate-400">Analyze tariff timing and renewable contribution for cost optimization.</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
          <BadgePercent size={14} />
          Smart optimizer enabled
        </span>
      </div>

      <div className="card border-slate-800 bg-slate-900/80 p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <SlidersHorizontal size={15} className="text-cyan-300" />
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Live Inputs</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block text-sm font-medium text-slate-300">
            Energy Consumption (kWh)
            <div className="mt-2 rounded-lg border border-slate-700 bg-slate-950 px-3 py-3">
              <input
                type="range"
                min="100"
                max="5000"
                step="50"
                value={usage}
                onChange={(e) => setUsage(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <p className="mt-1 text-xs text-slate-300">{Number(usage).toLocaleString('en-IN')} kWh</p>
            </div>
          </label>

          <label className="block text-sm font-medium text-slate-300">
            Base Electricity Price (₹/kWh)
            <input
              type="number"
              min="0"
              step="0.1"
              value={basePrice}
              onChange={(e) => setBasePrice(Number(e.target.value))}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </label>

          <label className="block text-sm font-medium text-slate-300">
            Time of Usage
            <select
              value={timeOfUsage}
              onChange={(e) => setTimeOfUsage(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            >
              <option>Peak</option>
              <option>Normal</option>
              <option>Off-Peak</option>
            </select>
          </label>

          <label className="block text-sm font-medium text-slate-300">
            Renewable Energy Percentage (%)
            <div className="mt-2 rounded-lg border border-slate-700 bg-slate-950 px-3 py-3">
              <input
                type="range"
                min="0"
                max="100"
                value={renewablePercent}
                onChange={(e) => setRenewablePercent(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <p className="mt-1 text-xs text-slate-300">{Number(renewablePercent)}%</p>
            </div>
          </label>
        </div>
      </div>

      <>
          <div className="card border-slate-800 bg-slate-900/80 p-5">
            <div className="mb-4 flex items-center gap-2">
              <BarChart3 size={16} className="text-sky-300" />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Cost Breakdown</h2>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-slate-700 bg-slate-950/70 p-3">
                <p className="text-xs text-slate-400">Base Cost</p>
                <p className="mt-1 text-lg font-semibold text-slate-100">₹ {result.baseCost.toLocaleString('en-IN')}</p>
              </div>
              <div className={`rounded-lg border p-3 ${timeOfUsage === 'Peak' ? 'border-amber-500/30 bg-amber-500/10' : 'border-slate-700 bg-slate-950/70'}`}>
                <p className="text-xs text-slate-400">Peak Adjustment</p>
                <p className={`mt-1 text-lg font-semibold ${result.adjustmentValue >= 0 ? 'text-amber-300' : 'text-emerald-300'}`}>
                  {result.adjustmentValue >= 0 ? '+' : '-'}₹ {Math.abs(result.adjustmentValue).toLocaleString('en-IN')}
                </p>
              </div>
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
                <p className="text-xs text-emerald-200">Renewable Discount</p>
                <p className="mt-1 text-lg font-semibold text-emerald-300">-{result.discount}%</p>
              </div>
              <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-3">
                <p className="text-xs text-blue-200">Final Cost</p>
                <p className="mt-1 text-lg font-semibold text-blue-300">₹ {result.optimizedCost.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <div className="card border-slate-800 bg-slate-900/80 p-4">
              <h3 className="text-sm font-semibold text-slate-200">Cost Trend Graph</h3>
              <div className="mt-3 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={costTrendData}>
                    <defs>
                      <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                    <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Cost']} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }} />
                    <Area type="monotone" dataKey="cost" stroke="#22c55e" fill="url(#trendFill)" strokeWidth={2.5} isAnimationActive animationDuration={900} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card border-slate-800 bg-slate-900/80 p-4">
              <h3 className="text-sm font-semibold text-slate-200">Cost Distribution</h3>
              <div className="mt-3 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieCostDistribution} dataKey="value" nameKey="name" innerRadius={56} outerRadius={88} paddingAngle={3} isAnimationActive animationDuration={800}>
                      {pieCostDistribution.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Cost']} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="card border-slate-800 bg-slate-900/80 p-4">
            <h3 className="text-sm font-semibold text-slate-200">Savings Breakdown</h3>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {savingsBreakdown.map((item) => (
                <div key={item.name} className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 shadow-[0_0_24px_rgba(34,197,94,0.18)] transition hover:shadow-[0_0_30px_rgba(34,197,94,0.28)]">
                  <p className="text-xs uppercase tracking-wide text-emerald-300">{item.name}</p>
                  <p className="mt-1 text-xl font-bold text-emerald-300">₹ {item.value.toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="card border-red-500/30 bg-red-500/10 p-4">
              <div className="mb-2 flex items-center gap-2 text-red-300">
                <TrendingUp size={16} />
                <p className="text-xs uppercase tracking-wide">Total Cost</p>
              </div>
              <p className="text-2xl font-bold text-red-400">₹ {result.totalCost.toLocaleString('en-IN')}</p>
            </div>

            <div className="card border-blue-500/30 bg-blue-500/10 p-4">
              <div className="mb-2 flex items-center gap-2 text-blue-300">
                <Gauge size={16} />
                <p className="text-xs uppercase tracking-wide">Optimized Cost</p>
              </div>
              <p className="text-2xl font-bold text-blue-300">₹ {result.optimizedCost.toLocaleString('en-IN')}</p>
            </div>

            <div className="card border-emerald-500/30 bg-emerald-500/10 p-4">
              <div className="mb-2 flex items-center gap-2 text-emerald-300">
                <TrendingDown size={16} />
                <p className="text-xs uppercase tracking-wide">Savings</p>
              </div>
              <p className="text-2xl font-bold text-emerald-300">₹ {result.savings.toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="card border-slate-800 bg-slate-900/80 p-4">
              <div className="mb-3 flex items-center gap-2">
                <CalendarDays size={16} className="text-violet-300" />
                <h3 className="text-sm font-semibold text-slate-200">Monthly Projection</h3>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
                  <p className="text-xs text-red-300">Monthly Cost</p>
                  <p className="mt-1 text-xl font-bold text-red-300">₹ {result.monthlyCost.toLocaleString('en-IN')}</p>
                </div>
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
                  <p className="text-xs text-emerald-300">Monthly Savings</p>
                  <p className="mt-1 text-xl font-bold text-emerald-300">₹ {result.monthlySavings.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>

            <div className="card border-slate-800 bg-slate-900/80 p-4">
              <div className="mb-3 flex items-center gap-2">
                <BadgePercent size={16} className="text-emerald-300" />
                <h3 className="text-sm font-semibold text-slate-200">Optimization Efficiency</h3>
              </div>
              <p className="mb-2 text-sm text-slate-400">Efficiency: <span className="font-semibold text-emerald-300">{result.efficiency}%</span></p>
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(0, result.efficiency))}%` }}
                />
              </div>
            </div>
          </div>

          <div className="card border-slate-800 bg-slate-900/80 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Brain size={16} className="text-cyan-300" />
              <h3 className="text-sm font-semibold text-slate-200">What-If Analysis</h3>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-300">
                  Simulate Renewable %
                  <div className="mt-2 rounded-lg border border-slate-700 bg-slate-950 px-3 py-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={simRenewable}
                      onChange={(e) => setSimRenewable(Number(e.target.value))}
                      className="w-full accent-cyan-500"
                    />
                    <p className="mt-1 text-xs text-slate-300">{simRenewable}%</p>
                  </div>
                </label>

                <label className="block text-sm font-medium text-slate-300">
                  Simulate Time Slot
                  <select
                    value={simTimeSlot}
                    onChange={(e) => setSimTimeSlot(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none"
                  >
                    <option>Peak</option>
                    <option>Normal</option>
                    <option>Off-Peak</option>
                  </select>
                </label>
              </div>

              <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 p-4">
                <p className="text-xs uppercase tracking-wide text-cyan-300">Projected Optimized Cost</p>
                <p className="mt-1 text-xl font-bold text-cyan-200">₹ {whatIf.simOptimizedCost.toLocaleString('en-IN')}</p>
                <p className="mt-3 text-xs uppercase tracking-wide text-cyan-300">Projected Monthly Cost</p>
                <p className="mt-1 text-xl font-bold text-cyan-200">₹ {whatIf.simMonthlyCost.toLocaleString('en-IN')}</p>
                <p className="mt-3 text-xs text-emerald-300">Delta vs current monthly: ₹ {whatIf.monthlyDelta.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>

          <div className="card border-emerald-500/30 bg-emerald-500/10 p-4 shadow-[0_0_26px_rgba(34,197,94,0.16)]">
            <div className="mb-2 flex items-center gap-2">
              <Lightbulb size={16} className="text-emerald-300" />
              <h3 className="text-sm font-semibold text-emerald-100">Recommended Action</h3>
            </div>
            <p className="text-sm text-emerald-100">{recommendedAction}</p>
          </div>

          <div className={`card p-4 ${timeOfUsage === 'Peak' ? 'border-amber-500/30 bg-amber-500/10' : 'border-slate-800 bg-slate-900/80'}`}>
            <div className="mb-2 flex items-center gap-2">
              {timeOfUsage === 'Peak' ? (
                <TriangleAlert size={16} className="text-amber-300" />
              ) : (
                <Lightbulb size={16} className="text-emerald-300" />
              )}
              <h3 className="text-sm font-semibold text-slate-100">AI Recommendation</h3>
            </div>
            <ul className="space-y-1.5 text-sm text-slate-300">
              {recommendations.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
      </>
    </div>
  );
}
