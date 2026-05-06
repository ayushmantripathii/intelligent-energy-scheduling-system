import { useState } from 'react';
import { BrainCircuit, TrendingUp, AlertTriangle, Leaf, ZapOff } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import AiRecommendation from '../components/AiRecommendation';
import EmptyStateIllustration from '../components/ui/EmptyStateIllustration';

function fakePredictionEngine(energy, price, renewable) {
  const randomDemandBias = Math.random() * 140 - 70;
  const renewableRelief = renewable * 2.4;
  const pricePressure = price * 34;

  const predictedDemand = Math.max(120, energy * 1.06 + pricePressure - renewableRelief + randomDemandBias);

  let recommendedSlot = 'Afternoon';
  if (price >= 7.5 || predictedDemand > energy * 1.15) recommendedSlot = 'Night';
  if (renewable > 55 && price < 7) recommendedSlot = 'Morning';

  const confidence = Math.floor(Math.random() * 21) + 75;

  const insight =
    recommendedSlot === 'Night'
      ? 'Based on current trends, demand will peak in evening. Shift workloads to night.'
      : recommendedSlot === 'Morning'
        ? 'Renewable availability is strong in early hours. Schedule flexible workloads in morning.'
        : 'Demand is likely stable through afternoon. Keep critical tasks in balanced time windows.';

  return {
    predictedDemand: Number(predictedDemand.toFixed(2)),
    recommendedSlot,
    confidence,
    insight,
  };
}

export default function EnergyPrediction() {
  const [energy, setEnergy] = useState(1250);
  const [renewable, setRenewable] = useState(42);
  const [price, setPrice] = useState(6.8);
  const [result, setResult] = useState(null);

  const predictDemand = () => {
    const output = fakePredictionEngine(energy, price, renewable);

    let demandLevel = 'Medium';
    if (output.predictedDemand > energy * 1.12) demandLevel = 'High';
    if (output.predictedDemand < energy * 0.92) demandLevel = 'Low';

    // Generate fake trend data based on prediction
    const trendData = Array.from({ length: 6 }).map((_, i) => ({
      val: Math.max(100, output.predictedDemand + (Math.random() * 40 - 20) * (i > 3 ? -1 : 1))
    }));
    trendData.push({ val: output.predictedDemand });

    setResult({
      val: output.predictedDemand,
      level: demandLevel,
      slot: output.recommendedSlot,
      insight: output.insight,
      confidence: output.confidence,
      trendData
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <BrainCircuit className="text-green-500" /> Energy Prediction
        </h2>
        <p className="text-sm text-slate-400 mt-1">AI-driven predictive demand modeling based on live metrics.</p>
      </div>

      <AiRecommendation message="Based on recent patterns, lowering daytime server workload by 15% can optimally align with peak solar generation." />

      <div className="grid gap-6 md:grid-cols-12">
        <div className="card space-y-5 md:col-span-5 self-start shadow-xl bg-slate-900/50 border-slate-700/50 rounded-2xl">
          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
              Energy Consumption ({energy.toLocaleString('en-IN')} kWh)
            </label>
            <input
              type="range"
              min="300"
              max="3000"
              step="10"
              value={energy}
              onChange={(e) => setEnergy(Number(e.target.value))}
              className="w-full accent-blue-500 bg-slate-800 h-2 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
              Available Renewable ({renewable}%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={renewable}
              onChange={(e) => setRenewable(Number(e.target.value))}
              className="w-full accent-green-500 bg-slate-800 h-2 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
              Electricity Price (₹{price})
            </label>
            <input
              type="range"
              min="1"
              max="15"
              step="0.1"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full accent-orange-500 bg-slate-800 h-2 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <button
            onClick={predictDemand}
            className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-lg hover:from-blue-500 hover:to-indigo-500 transition-all hover:scale-[1.02]"
          >
            <BrainCircuit size={18} />
            Generate Smart Prediction
          </button>
        </div>

        <div className="md:col-span-7">
          {result ? (
            <div className="card h-full bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50 shadow-2xl rounded-2xl flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-medium text-slate-300">
                  <TrendingUp size={12} className="text-blue-400" />
                  {result.confidence}% Confidence
                </span>
              </div>
              
              <h3 className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-wider">Prediction Results</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                              <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800/50">
                                <p className="text-xs text-slate-400 uppercase tracking-wide">Predicted Demand</p>
                                <p className="text-lg font-bold text-white mt-1">{result.val.toLocaleString('en-IN')} kWh</p>
                              </div>
                              <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800/50">
                                <p className="text-xs text-slate-400 uppercase tracking-wide">Suggested Best Time Slot</p>
                                <p className="text-lg font-bold text-cyan-300 mt-1">{result.slot}</p>
                              </div>
                            </div>
              
              <div className="flex items-end gap-4 mb-2">
                <span className="text-5xl font-black text-white">{result.val}</span>
                <span className="text-lg font-medium text-slate-400 pb-1">kWh</span>
              </div>
              
              <div className="flex items-center gap-3 mb-8">
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                  result.level === 'High' ? 'bg-red-500/20 text-red-400' :
                  result.level === 'Medium' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {result.level} Demand
                </span>
              </div>

              <div className="space-y-3 flex-1">
                <div className="flex items-start gap-3 bg-slate-950/40 p-3 rounded-lg border border-slate-800/50">
                  <AlertTriangle className="text-orange-400 shrink-0 mt-0.5" size={16} />
                  <p className="text-sm text-slate-200">{result.insight}</p>
                </div>
                
                {renewable > 40 && (
                  <div className="flex items-start gap-3 bg-slate-950/40 p-3 rounded-lg border border-slate-800/50">
                    <Leaf className="text-green-400 shrink-0 mt-0.5" size={16} />
                    <p className="text-sm text-slate-200">High renewable availability detected. Prioritize renewable routing.</p>
                  </div>
                )}

                {price > 7 && (
                  <div className="flex items-start gap-3 bg-slate-950/40 p-3 rounded-lg border border-slate-800/50">
                    <ZapOff className="text-red-400 shrink-0 mt-0.5" size={16} />
                    <p className="text-sm text-slate-200">Grid price is peaking. Recommended slot is {result.slot} for lower exposure.</p>
                  </div>
                )}
              </div>

              <div className="h-20 mt-6 -mx-4 -mb-4 opacity-70">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={result.trendData}>
                    <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <YAxis domain={['dataMin - 10', 'dataMax + 10']} hide />
                    <Area type="monotone" dataKey="val" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorVal)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <EmptyStateIllustration
              title="AI Prediction Waiting"
              description="Adjust energy, price, and renewable values, then generate a smart prediction to unlock analytics."
            />
          )}
        </div>
      </div>
    </div>
  );
}
