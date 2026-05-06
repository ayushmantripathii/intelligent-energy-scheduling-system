import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import ChartCard from '../components/cards/ChartCard';
import EnergyPredictionForm from '../components/forms/EnergyPredictionForm';
import { demandForecast, renewableForecast, aiInsights } from '../data/forecastData';
import { AlertTriangle, CheckCircle, Info, TrendingUp } from 'lucide-react';

const insightIcons = {
  warning: AlertTriangle,
  success: CheckCircle,
  info: Info,
};

const insightColors = {
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    border: 'border-amber-200 dark:border-amber-500/30',
    icon: 'text-amber-500',
    title: 'text-amber-800 dark:text-amber-300',
  },
  success: {
    bg: 'bg-green-50 dark:bg-green-500/10',
    border: 'border-green-200 dark:border-green-500/30',
    icon: 'text-green-500',
    title: 'text-green-800 dark:text-green-300',
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    border: 'border-blue-200 dark:border-blue-500/30',
    icon: 'text-blue-500',
    title: 'text-blue-800 dark:text-blue-300',
  },
};

export default function Forecasting() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Energy Forecasting</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">AI-powered demand prediction and renewable availability forecast</p>
      </div>

      {/* Energy Demand Prediction Form */}
      <EnergyPredictionForm />

      {/* Demand Forecast Chart */}
      <ChartCard
        title="24-Hour Energy Demand Prediction"
        subtitle="Predicted vs actual demand with confidence bands (kWh)"
        action={
          <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-full">
            <TrendingUp size={12} /> 94.2% Accuracy
          </div>
        }
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={demandForecast}>
              <defs>
                <linearGradient id="colorBand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
              <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#94a3b8' }} interval={2} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Area type="monotone" dataKey="upper" stroke="transparent" fill="url(#colorBand)" name="Upper Bound" animationDuration={800} />
              <Area type="monotone" dataKey="lower" stroke="transparent" fill="#22C55E" fillOpacity={0.08} name="Lower Bound" animationDuration={800} />
              <Line type="monotone" dataKey="predicted" stroke="#22C55E" strokeWidth={2.5} dot={false} name="Predicted" animationDuration={800} />
              <Line type="monotone" dataKey="actual" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} name="Actual" connectNulls={false} animationDuration={800} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Renewable Forecast */}
      <ChartCard title="Renewable Energy Availability" subtitle="Forecasted solar and wind generation (kW)">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={renewableForecast}>
              <defs>
                <linearGradient id="colorSolarFc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorWindFc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
              <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }} formatter={(v) => `${v} kW`} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Area type="monotone" dataKey="solar" stroke="#F59E0B" fill="url(#colorSolarFc)" strokeWidth={2} name="Solar" animationDuration={800} />
              <Area type="monotone" dataKey="wind" stroke="#3B82F6" fill="url(#colorWindFc)" strokeWidth={2} name="Wind" animationDuration={800} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* AI Insights */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-3">AI Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiInsights.map((insight, i) => {
            const InsightIcon = insightIcons[insight.type] || Info;
            const colors = insightColors[insight.type] || insightColors.info;
            return (
              <div key={i} className={`${colors.bg} border ${colors.border} rounded-xl p-4`}>
                <div className="flex items-start gap-3">
                  <InsightIcon size={18} className={`${colors.icon} shrink-0 mt-0.5`} />
                  <div>
                    <h3 className={`text-sm font-semibold ${colors.title}`}>{insight.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{insight.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
