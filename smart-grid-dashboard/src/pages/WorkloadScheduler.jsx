import { useMemo, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import {
  Brain,
  CalendarClock,
  CheckCircle2,
  Clock,
  History,
  Leaf,
  Lightbulb,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Zap,
} from 'lucide-react';
import EmptyStateIllustration from '../components/ui/EmptyStateIllustration';

export default function WorkloadScheduler() {
  const [activeTab, setActiveTab] = useState('new');
  const [taskName, setTaskName] = useState('Data Backup');
  const [energyRequired, setEnergyRequired] = useState(60);
  const [priority, setPriority] = useState('Medium');
  const [gridPrice, setGridPrice] = useState(6);
  const [renewablePercent, setRenewablePercent] = useState(45);
  const [simulationMode, setSimulationMode] = useState(true);
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterSlot, setFilterSlot] = useState('All');
  const [latestResult, setLatestResult] = useState(null);
  const [history, setHistory] = useState([]);

  const balancedSummary = useMemo(() => {
    return history.reduce(
      (acc, task) => {
        if (task.loadSlot === 'Morning') acc.morning += task.energyRequired;
        if (task.loadSlot === 'Afternoon') acc.afternoon += task.energyRequired;
        if (task.loadSlot === 'Night') acc.night += task.energyRequired;
        return acc;
      },
      { morning: 0, afternoon: 0, night: 0 },
    );
  }, [history]);

  const totalBalancedLoad = balancedSummary.morning + balancedSummary.afternoon + balancedSummary.night;

  const loadDistribution = useMemo(() => {
    if (totalBalancedLoad === 0) {
      return [
        { name: 'Morning', value: 33, color: '#f59e0b' },
        { name: 'Afternoon', value: 33, color: '#3b82f6' },
        { name: 'Night', value: 34, color: '#6366f1' },
      ];
    }

    return [
      {
        name: 'Morning',
        value: Number(((balancedSummary.morning / totalBalancedLoad) * 100).toFixed(1)),
        color: '#f59e0b',
      },
      {
        name: 'Afternoon',
        value: Number(((balancedSummary.afternoon / totalBalancedLoad) * 100).toFixed(1)),
        color: '#3b82f6',
      },
      {
        name: 'Night',
        value: Number(((balancedSummary.night / totalBalancedLoad) * 100).toFixed(1)),
        color: '#6366f1',
      },
    ];
  }, [balancedSummary, totalBalancedLoad]);

  const shiftableTasks = useMemo(
    () => history.filter((task) => task.gridPrice > 7 && task.priority !== 'High').length,
    [history],
  );

  const aiSuggestion =
    shiftableTasks > 0
      ? `${shiftableTasks} tasks can be shifted to save \u20b9${(shiftableTasks * 500).toLocaleString('en-IN')} daily`
      : 'Current queue is balanced. Monitor upcoming peak pricing windows.';

  const filteredHistory = useMemo(() => {
    return history.filter((task) => {
      const byPriority = filterPriority === 'All' || task.priority === filterPriority;
      const bySlot = filterSlot === 'All' || task.assignedSlot === filterSlot;
      return byPriority && bySlot;
    });
  }, [history, filterPriority, filterSlot]);

  const performanceMetrics = useMemo(() => {
    if (history.length === 0) {
      return { avgCost: 0, totalEnergy: 0, totalSavings: 0 };
    }

    const totalCost = history.reduce((sum, task) => sum + task.finalCost, 0);
    const totalEnergy = history.reduce((sum, task) => sum + task.energyRequired, 0);
    const totalSavings = history.reduce((sum, task) => sum + task.savings, 0);

    return {
      avgCost: Number((totalCost / history.length).toFixed(2)),
      totalEnergy,
      totalSavings: Number(totalSavings.toFixed(2)),
    };
  }, [history]);

  const scheduleWorkload = () => {
    const safeEnergy = Math.max(1, Number(energyRequired) || 1);
    const safeGridPrice = Math.max(0, Number(gridPrice) || 0);
    const safeRenewable = Math.min(100, Math.max(0, Number(renewablePercent) || 0));

    let assignedSlot = 'Night';
    let loadSlot = 'Night';
    let optimizationTag = 'Standard Routing';
    let energySource = 'Grid';
    const reasons = [];

    if (priority === 'High') {
      assignedSlot = 'Immediate';
      loadSlot = 'Morning';
      reasons.push('High priority task scheduled for immediate execution.');
    }

    if (priority === 'Medium') {
      assignedSlot = 'Afternoon';
      loadSlot = 'Afternoon';
      reasons.push('Medium priority task routed to afternoon slot.');
    }

    if (priority === 'Low') {
      assignedSlot = 'Night';
      loadSlot = 'Night';
      reasons.push('Low priority task assigned to night window.');
    }

    const beforeCost = Number((safeEnergy * safeGridPrice).toFixed(2));
    let finalCost = beforeCost;

    if (simulationMode) {
      if (safeGridPrice > 7) {
        assignedSlot = 'Off-Peak';
        loadSlot = 'Night';
        optimizationTag = 'Shifted to save cost';
        finalCost = Number((finalCost * 0.82).toFixed(2));
        reasons.push('Task shifted to night to reduce peak pricing impact.');
      }

      if (safeRenewable > 50) {
        assignedSlot = 'Green Slot';
        energySource = 'Renewable';
        optimizationTag = optimizationTag === 'Shifted to save cost' ? 'Cost + Green Optimized' : 'Green Optimized';
        finalCost = Number((finalCost * 0.92).toFixed(2));
        reasons.push('High renewable availability enabled green-slot assignment.');
      } else if (safeRenewable > 30) {
        energySource = 'Hybrid';
        finalCost = Number((finalCost * 0.97).toFixed(2));
        reasons.push('Moderate renewable availability used hybrid energy source.');
      }
    } else {
      optimizationTag = 'Basic scheduling (simulation off)';
      reasons.push('Simulation mode disabled, basic priority mapping applied.');
    }

    let carbonImpact = 'Low';
    if (safeEnergy >= 80 && safeRenewable < 35) {
      carbonImpact = 'High';
    } else if (safeEnergy >= 60 || safeRenewable < 50) {
      carbonImpact = 'Medium';
    }

    const savings = Number((beforeCost - finalCost).toFixed(2));
    const optimizationPercent = beforeCost > 0 ? Number(((savings / beforeCost) * 100).toFixed(1)) : 0;

    const renewableBenefit = safeRenewable > 50
      ? `Renewable benefit: ${safeRenewable}% renewable enabled cleaner routing.`
      : 'Renewable benefit: Limited renewable availability, consider increasing green input.';

    const explanation = `This task was shifted to ${assignedSlot} to reduce cost by ${optimizationPercent}% and use renewable energy.`;

    const costBadge = safeGridPrice > 7 ? 'High Cost' : safeGridPrice > 5.5 ? 'Moderate Cost' : 'Optimized Cost';

    const newTask = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      taskName,
      energyRequired: safeEnergy,
      priority,
      assignedSlot,
      loadSlot,
      energySource,
      beforeCost,
      finalCost,
      savings,
      status: 'Scheduled',
      carbonImpact,
      optimizationTag,
      reason: reasons.join(' '),
      renewableBenefit,
      explanation,
      optimizationPercent,
      gridPrice: safeGridPrice,
      renewablePercent: safeRenewable,
      costBadge,
    };

    setLatestResult(newTask);
    setHistory((prev) => [newTask, ...prev]);
  };

  const getImpactClass = (impact) => {
    if (impact === 'High') return 'bg-red-500/15 text-red-300 border-red-500/30';
    if (impact === 'Medium') return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    return 'bg-green-500/15 text-green-300 border-green-500/30';
  };

  const getCostBadgeClass = (badge) => {
    if (badge === 'High Cost') return 'bg-red-500/15 text-red-300 border-red-500/30';
    if (badge === 'Moderate Cost') return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    return 'bg-green-500/15 text-green-300 border-green-500/30';
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <CalendarClock className="text-blue-500" /> Intelligent Scheduling Engine
        </h2>
        <p className="text-sm text-slate-400 mt-1">Cost-aware and renewable-aware workload routing for better efficiency.</p>
      </div>

      <div className="card border border-slate-800 bg-slate-900/80 p-2">
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setActiveTab('new')}
            className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
              activeTab === 'new' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-slate-800/70 text-slate-300 border border-slate-700'
            }`}
          >
            <Zap size={14} /> New Task
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
              activeTab === 'history' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-slate-800/70 text-slate-300 border border-slate-700'
            }`}
          >
            <History size={14} /> History
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
              activeTab === 'insights' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-slate-800/70 text-slate-300 border border-slate-700'
            }`}
          >
            <Brain size={14} /> Insights
          </button>
        </div>
      </div>

      <div className="card border border-emerald-500/30 bg-emerald-500/10 p-4">
        <div className="flex items-start gap-2 text-emerald-200">
          <Lightbulb size={16} className="mt-0.5" />
          <p className="text-sm font-medium">AI Suggestion: {aiSuggestion}</p>
        </div>
      </div>

      {activeTab === 'new' && (
        <div className="grid gap-6 lg:grid-cols-12">
        <div className="card space-y-5 lg:col-span-5 self-start">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Add Task</h3>
            <button
              onClick={() => setSimulationMode((prev) => !prev)}
              className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                simulationMode ? 'border-green-500/30 bg-green-500/15 text-green-300' : 'border-slate-600 bg-slate-800 text-slate-300'
              }`}
            >
              {simulationMode ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}
              Simulation {simulationMode ? 'ON' : 'OFF'}
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Task Name</label>
            <input
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Energy Required (kWh)</label>
            <input
              type="number"
              min="1"
              value={energyRequired}
              onChange={(e) => setEnergyRequired(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <label className="text-sm font-medium text-slate-300">
              Grid Price
              <input
                type="number"
                step="0.1"
                value={gridPrice}
                onChange={(e) => setGridPrice(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </label>
            <label className="text-sm font-medium text-slate-300">
              Renewable %
              <input
                type="number"
                min="0"
                max="100"
                value={renewablePercent}
                onChange={(e) => setRenewablePercent(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </label>
          </div>

          <button
            onClick={scheduleWorkload}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-blue-500 hover:scale-[1.02]"
          >
            <Zap size={18} />
            Schedule Workload
          </button>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-6">
          {latestResult ? (
            <div className="card bg-slate-800/40 border-blue-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  latestResult.status === 'Scheduled' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                }`}>
                  {latestResult.status === 'Scheduled' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                  {latestResult.status}
                </span>
              </div>

              <h3 className="text-base font-semibold mb-5 items-center flex gap-2">
                Smart Decision Card
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                  <p className="text-xs text-slate-400 mb-1">Assigned Slot</p>
                  <p className="text-sm font-medium text-cyan-300">{latestResult.assignedSlot}</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                  <p className="text-xs text-slate-400 mb-1">Energy Source</p>
                  <p className="text-sm font-medium text-blue-400">{latestResult.energySource}</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                  <p className="text-xs text-slate-400 mb-1">Estimated Cost</p>
                  <p className="text-sm font-medium text-green-400">₹ {latestResult.finalCost}</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                  <p className="text-xs text-slate-400 mb-1">Carbon Impact</p>
                  <p className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${getImpactClass(latestResult.carbonImpact)}`}>
                    {latestResult.carbonImpact}
                  </p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50 col-span-2">
                  <p className="text-xs text-slate-400 mb-1">Optimization Tag</p>
                  <p className="inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-300">
                    {latestResult.optimizationTag}
                  </p>
                </div>
              </div>
            </div>
          ) : (
             <div className="card flex items-center justify-center min-h-[160px] border-dashed border-slate-700">
                <p className="text-slate-500 text-sm">Submit a workload to view intelligent routing decisions</p>
             </div>
          )}

          {latestResult && (
            <div className="card border border-slate-800 bg-slate-900/80 p-4">
              <div className="mb-1 flex items-center gap-2 text-slate-200">
                <Sparkles size={15} className="text-indigo-300" />
                <h3 className="text-sm font-semibold">Decision Explanation</h3>
              </div>
              <p className="text-sm text-slate-300">{latestResult.explanation}</p>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="rounded border border-slate-700 bg-slate-900/60 p-2">
                  <p className="text-slate-400">Why slot was chosen</p>
                  <p className="mt-1 text-slate-200">{latestResult.reason}</p>
                </div>
                <div className="rounded border border-slate-700 bg-slate-900/60 p-2">
                  <p className="text-slate-400">Cost comparison</p>
                  <p className="mt-1 text-slate-200">Before: ₹{latestResult.beforeCost} | After: ₹{latestResult.finalCost}</p>
                </div>
                <div className="rounded border border-green-500/20 bg-green-500/10 p-2">
                  <p className="text-green-300">Renewable benefit</p>
                  <p className="mt-1 text-green-200">{latestResult.renewableBenefit}</p>
                </div>
              </div>
            </div>
          )}
          <div className="card flex-1 overflow-hidden flex flex-col p-0">
            <div className="p-4 border-b border-slate-800 bg-slate-900/30">
              <h3 className="text-sm font-semibold text-slate-300">Latest Queue</h3>
            </div>
            <div className="overflow-x-auto flex-1 p-4">
              <table className="min-w-full text-left text-sm">
                <thead className="text-xs text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="pb-3 pr-4 font-medium">Task</th>
                    <th className="pb-3 px-4 font-medium">Pri.</th>
                    <th className="pb-3 px-4 font-medium">Assigned Slot</th>
                    <th className="pb-3 px-4 font-medium">Cost</th>
                    <th className="pb-3 pl-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {history.slice(0, 5).map((task) => (
                    <tr key={task.id} className="group hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 pr-4 text-slate-200">{task.taskName}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          task.priority === 'High' ? 'bg-red-500/10 text-red-400' :
                          task.priority === 'Medium' ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-500/10 text-slate-400'
                        }`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">{task.assignedSlot}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-slate-200 font-medium">₹ {task.finalCost.toLocaleString('en-IN')}</span>
                          <span className={`inline-flex w-fit rounded-full border px-2 py-0.5 text-[10px] font-semibold ${getCostBadgeClass(task.costBadge)}`}>
                            {task.costBadge}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`flex items-center gap-1.5 text-xs ${task.status==='Scheduled' ? 'text-green-400' : 'text-orange-400'}`}>
                          {task.status==='Scheduled' ? <CheckCircle2 size={12}/> : <Clock size={12}/>}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {history.length === 0 && (
                    <tr>
                      <td className="py-4" colSpan="5">
                        <EmptyStateIllustration
                          title="No Scheduled Tasks"
                          description="Create a new task to build your intelligent scheduling queue."
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      )}

      {activeTab === 'history' && (
        <div className="card space-y-4">
          <div className="flex flex-wrap items-end gap-3">
            <label className="text-sm text-slate-300">
              Filter by Priority
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="mt-1 block rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
              >
                <option>All</option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </label>

            <label className="text-sm text-slate-300">
              Filter by Slot
              <select
                value={filterSlot}
                onChange={(e) => setFilterSlot(e.target.value)}
                className="mt-1 block rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
              >
                <option>All</option>
                <option>Immediate</option>
                <option>Afternoon</option>
                <option>Night</option>
                <option>Off-Peak</option>
                <option>Green Slot</option>
              </select>
            </label>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="pb-3 pr-4 font-medium">Task Name</th>
                  <th className="pb-3 px-4 font-medium">Energy</th>
                  <th className="pb-3 px-4 font-medium">Slot</th>
                  <th className="pb-3 px-4 font-medium">Cost</th>
                  <th className="pb-3 px-4 font-medium">Carbon Impact</th>
                  <th className="pb-3 px-4 font-medium">Optimization %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredHistory.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 pr-4 text-slate-200">{task.taskName}</td>
                    <td className="py-3 px-4 text-slate-300">{task.energyRequired} kWh</td>
                    <td className="py-3 px-4 text-slate-300">{task.assignedSlot}</td>
                    <td className="py-3 px-4 text-slate-300">₹ {task.finalCost.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold ${getImpactClass(task.carbonImpact)}`}>
                        {task.carbonImpact}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold ${task.optimizationPercent > 10 ? 'bg-green-500/15 text-green-300 border-green-500/30' : task.optimizationPercent > 0 ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' : 'bg-slate-500/15 text-slate-300 border-slate-500/30'}`}>
                        {task.optimizationPercent}%
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredHistory.length === 0 && (
                  <tr>
                    <td className="py-4" colSpan="6">
                      <EmptyStateIllustration
                        title="No Matching History"
                        description="Try changing priority or slot filters to view previous optimization results."
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div className="card border border-blue-500/20 bg-blue-500/10">
              <p className="text-xs text-blue-300 uppercase tracking-wide">Avg Cost per Task</p>
              <p className="text-2xl font-bold text-blue-200 mt-1">₹ {performanceMetrics.avgCost.toLocaleString('en-IN')}</p>
            </div>
            <div className="card border border-emerald-500/20 bg-emerald-500/10">
              <p className="text-xs text-emerald-300 uppercase tracking-wide">Total Energy Scheduled</p>
              <p className="text-2xl font-bold text-emerald-200 mt-1">{performanceMetrics.totalEnergy.toLocaleString('en-IN')} kWh</p>
            </div>
            <div className="card border border-amber-500/20 bg-amber-500/10">
              <p className="text-xs text-amber-300 uppercase tracking-wide">Total Savings</p>
              <p className="text-2xl font-bold text-amber-200 mt-1">₹ {performanceMetrics.totalSavings.toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div className="card space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-slate-300">Load Distribution Chart</h3>
              <span className="text-[11px] text-green-300 bg-green-500/10 border border-green-500/20 rounded-full px-2 py-0.5">
                Load distributed to avoid peak usage
              </span>
            </div>

            <div className="h-56 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={loadDistribution} dataKey="value" nameKey="name" innerRadius={56} outerRadius={80} paddingAngle={3}>
                    {loadDistribution.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value}%`, 'Load Share']}
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs text-slate-300">
              {loadDistribution.map((slot) => (
                <div key={slot.name} className="rounded border border-slate-700 bg-slate-800/60 px-2 py-1.5 text-center">
                  <p>{slot.name}</p>
                  <p className="font-semibold">{slot.value}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
