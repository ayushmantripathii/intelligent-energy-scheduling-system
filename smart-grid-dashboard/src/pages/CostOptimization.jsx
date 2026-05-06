import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import ChartCard from '../components/cards/ChartCard';
import StatCard from '../components/cards/StatCard';
import CostCalculator from '../components/forms/CostCalculator';
import AiRecommendation from '../components/AiRecommendation';
import { pricePrediction, monthlyCostData, aiRecommendations, costSummary } from '../data/costData';
import { IndianRupee, TrendingDown, Clock, Sun, Thermometer, Server, Lightbulb, PiggyBank } from 'lucide-react';

const iconMap = {
  clock: Clock,
  sun: Sun,
  'trending-down': TrendingDown,
  thermometer: Thermometer,
  server: Server,
};

export default function CostOptimization() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Cost Optimization</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Electricity pricing analysis and AI-driven savings recommendations</p>
      </div>

      <AiRecommendation message="AI Suggestion: Shift 30% of cooling workloads to off-peak hours (1AM-5AM) to reduce monthly cooling costs by ₹14,000." />

      {/* Price Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Current Price" value={costSummary.currentPrice} unit="/kWh" icon={IndianRupee} color="amber" />
        <StatCard title="Average Price" value={costSummary.avgPrice} unit="/kWh" icon={IndianRupee} color="blue" />
        <StatCard title="Lowest Today" value={costSummary.lowestPrice} unit="/kWh" icon={TrendingDown} color="green" />
        <StatCard title="Peak Price" value={costSummary.peakPrice} unit="/kWh" icon={IndianRupee} color="red" />
      </div>

      {/* Cost Calculator */}
      <CostCalculator />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Electricity Price Prediction" subtitle="Actual vs AI-predicted pricing (₹/kWh)">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={pricePrediction}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} domain={[0, 10]} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }} formatter={(v) => `₹${v}`} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="actual" stroke="#22C55E" strokeWidth={2.5} dot={{ r: 3 }} name="Actual" animationDuration={800} />
                <Line type="monotone" dataKey="predicted" stroke="#8B5CF6" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} name="Predicted" animationDuration={800} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Monthly Cost Comparison" subtitle="Actual vs optimized costs (₹)">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyCostData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }} formatter={(v) => `₹${v.toLocaleString()}`} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="cost" name="Actual" fill="#EF4444" radius={[4, 4, 0, 0]} animationDuration={800} />
                <Bar dataKey="optimized" name="Optimized" fill="#22C55E" radius={[4, 4, 0, 0]} animationDuration={800} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Savings Card */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-5 shadow-lg shadow-green-500/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <PiggyBank size={24} className="text-white" />
            </div>
            <div>
              <p className="text-green-100 text-sm font-medium">Estimated Monthly Savings</p>
              <h2 className="text-2xl font-bold text-white">{costSummary.estimatedSavings}</h2>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-green-100 text-xs">Current</p>
              <p className="text-white text-lg font-bold">{costSummary.currentMonthly}</p>
            </div>
            <div className="text-center">
              <p className="text-green-100 text-xs">Optimized</p>
              <p className="text-white text-lg font-bold">{costSummary.optimizedMonthly}</p>
            </div>
            <div className="text-center">
              <p className="text-green-100 text-xs">Savings</p>
              <p className="text-white text-lg font-bold">{costSummary.savingsPercent}</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <ChartCard title="AI Recommendations" subtitle="Smart suggestions to reduce energy costs" action={<Lightbulb size={18} className="text-amber-500" />}>
        <div className="space-y-3">
          {aiRecommendations.map(rec => {
            const RecIcon = iconMap[rec.icon] || Lightbulb;
            return (
              <div key={rec.id} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-100 dark:border-slate-700/50 hover:shadow-sm transition-shadow">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  rec.impact === 'High' ? 'bg-green-100 dark:bg-green-500/15 text-green-600 dark:text-green-400' :
                  rec.impact === 'Medium' ? 'bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400' :
                  'bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                }`}>
                  <RecIcon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-white">{rec.title}</h4>
                    <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      rec.impact === 'High' ? 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400' :
                      rec.impact === 'Medium' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400' :
                      'bg-slate-100 text-slate-600 dark:bg-slate-600 dark:text-slate-300'
                    }`}>{rec.impact}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{rec.description}</p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <IndianRupee size={11} className="text-green-500" />
                    <span className="text-xs font-semibold text-green-600 dark:text-green-400">{rec.savings}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ChartCard>
    </div>
  );
}
