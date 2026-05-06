import { useState } from 'react';
import { Download, FileText, Zap, Leaf, TrendingDown, AlignLeft } from 'lucide-react';
import AiRecommendation from '../components/AiRecommendation';

const initialReport = {
  totalEnergy: 0,
  averageLoad: 0,
  renewable: 0,
  savings: 0,
  aiSummary: "Generate a report to view AI-summarized highlights.",
};

export default function Reports() {
  const [reportType, setReportType] = useState('Weekly');
  const [report, setReport] = useState(initialReport);
  const [isLoading, setIsLoading] = useState(false);

  const generateReport = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (reportType === 'Daily') {
         setReport({ totalEnergy: 1420, averageLoad: 68, renewable: 42, savings: 850, aiSummary: "Energy consumption peaked significantly during the afternoon hours. Shifting workloads to 2AM successfully avoided grid spikes. Overall grid dependency reduced by 12% today." });
      } else if (reportType === 'Monthly') {
         setReport({ totalEnergy: 34500, averageLoad: 74, renewable: 56, savings: 24500, aiSummary: "Strong month for renewable utilization. Battery discharge during peak pricing hours saved ₹24.5k. Recommendation: Investigate cooling efficiency on server rack C for further improvements." });
      } else {
         setReport({ totalEnergy: 9800, averageLoad: 71, renewable: 48, savings: 6200, aiSummary: "Balanced week. The intelligent scheduler deferred 45 low-priority tasks to off-peak grid hours, resulting in substantial cost savings. Renewable usage remains steady." });
      }
      setIsLoading(false);
    }, 600);
  };

  const exportCsv = () => {
    const csvContent = [
      'Metric,Value',
      `Report Type,${reportType}`,
      `Total Energy Used (kWh),${report.totalEnergy}`,
      `Average Load (%),${report.averageLoad}`,
      `Renewable Percentage (%),${report.renewable}`,
      `Estimated Savings (INR),${report.savings}`,
      `AI Summary,"${report.aiSummary}"`
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `smart-grid-${reportType.toLowerCase()}-report.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <FileText className="text-blue-500" /> Executive Reports
        </h2>
        <p className="text-sm text-slate-400 mt-1">Generate automated operational intelligence summaries.</p>
      </div>

      <AiRecommendation message="New feature: Executive reports now include an automated text summary of operational anomalies and scheduling wins." />

      <div className="card space-y-5">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
             <label className="block text-sm font-medium text-slate-300 mb-1">Select Reporting Period</label>
             <select
               value={reportType}
               onChange={(e) => setReportType(e.target.value)}
               className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
             >
               <option>Daily</option>
               <option>Weekly</option>
               <option>Monthly</option>
             </select>
          </div>
          <button
            onClick={generateReport}
            disabled={isLoading}
            className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-500 transition disabled:opacity-50 min-w-[140px]"
          >
            {isLoading ? 'Processing...' : 'Generate Report'}
          </button>
          <button
            onClick={exportCsv}
            disabled={report.totalEnergy === 0}
            className="flex items-center gap-2 rounded-xl bg-slate-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={16} /> Export
          </button>
        </div>

        {report.totalEnergy > 0 ? (
          <div className="mt-8">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
               {reportType} Performance Summary
            </h3>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
               <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                  <div className="flex items-center gap-2 text-blue-400 mb-2">
                    <Zap size={16} /> <span className="text-xs font-semibold">Total Energy</span>
                  </div>
                  <p className="text-xl font-bold">{report.totalEnergy.toLocaleString()} <span className="text-sm font-normal text-slate-500">kWh</span></p>
               </div>
               <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                  <div className="flex items-center gap-2 text-indigo-400 mb-2">
                    <TrendingDown size={16} /> <span className="text-xs font-semibold">Average Load</span>
                  </div>
                  <p className="text-xl font-bold">{report.averageLoad} <span className="text-sm font-normal text-slate-500">%</span></p>
               </div>
               <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                  <div className="flex items-center gap-2 text-green-400 mb-2">
                    <Leaf size={16} /> <span className="text-xs font-semibold">Renewable Share</span>
                  </div>
                  <p className="text-xl font-bold">{report.renewable} <span className="text-sm font-normal text-slate-500">%</span></p>
               </div>
               <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                  <div className="flex items-center gap-2 text-orange-400 mb-2">
                    <span className="font-bold text-lg leading-none">₹</span> <span className="text-xs font-semibold">Cost Savings</span>
                  </div>
                  <p className="text-xl font-bold">{report.savings.toLocaleString()}</p>
               </div>
            </div>

            <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-xl p-5 relative">
              <div className="flex gap-3">
                <div className="mt-1">
                  <AlignLeft className="text-indigo-400" size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-indigo-300 mb-1">AI Automated Summary</h4>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {report.aiSummary}
                  </p>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="py-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl bg-slate-900/20">
             <FileText size={32} className="mx-auto mb-3 opacity-20" />
             Select a reporting period and click generate to view data
          </div>
        )}
      </div>
    </div>
  );
}
