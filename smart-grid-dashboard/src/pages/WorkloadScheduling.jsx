import { useState, useMemo } from 'react';
import { timeSlots, scheduledWorkloads } from '../data/workloadData';
import ChartCard from '../components/cards/ChartCard';
import StatusBadge from '../components/cards/StatusBadge';
import { CalendarClock, Plus, Clock, Zap, Sparkles } from 'lucide-react';

export default function WorkloadScheduling() {
  const [workloads, setWorkloads] = useState(scheduledWorkloads);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ name: '', cluster: 'Cluster A', startHour: 2, duration: 2, priority: 'Medium', energyRequired: 500 });

  // AI-suggested best time slot based on energy requirement and duration
  const bestSlot = useMemo(() => {
    const dur = newTask.duration;
    let bestStart = 0;
    let bestCost = Infinity;
    for (let start = 0; start <= 24 - dur; start++) {
      let totalCost = 0;
      for (let h = start; h < start + dur; h++) {
        totalCost += timeSlots[h]?.price || 0;
      }
      if (totalCost < bestCost) {
        bestCost = totalCost;
        bestStart = start;
      }
    }
    const avgPrice = (bestCost / dur).toFixed(2);
    const estCost = ((newTask.energyRequired * bestCost) / dur).toFixed(0);
    return {
      start: bestStart,
      end: (bestStart + dur) % 24,
      avgPrice,
      totalCost: bestCost.toFixed(2),
      estCost,
    };
  }, [newTask.duration, newTask.energyRequired]);

  const addTask = () => {
    if (!newTask.name.trim()) return;
    setWorkloads(prev => [
      ...prev,
      { id: prev.length + 1, ...newTask, status: 'Scheduled' }
    ]);
    setNewTask({ name: '', cluster: 'Cluster A', startHour: 2, duration: 2, priority: 'Medium', energyRequired: 500 });
    setShowModal(false);
  };

  const useAiSlot = () => {
    setNewTask(prev => ({ ...prev, startHour: bestSlot.start }));
  };

  const getSlotColor = (type) => {
    switch (type) {
      case 'optimal': return 'bg-green-500';
      case 'normal': return 'bg-amber-400';
      case 'peak': return 'bg-red-500';
      default: return 'bg-slate-400';
    }
  };

  const getSlotBg = (type) => {
    switch (type) {
      case 'optimal': return 'bg-green-500/10 border-green-500/30';
      case 'normal': return 'bg-amber-500/10 border-amber-500/30';
      case 'peak': return 'bg-red-500/10 border-red-500/30';
      default: return 'bg-slate-500/10';
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Workload Scheduling</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Optimize task scheduling for energy efficiency</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-green-500/25 transition-colors"
        >
          <Plus size={16} /> Schedule Task
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
          <span className="w-3 h-3 rounded bg-green-500" /> Optimal (Low Price)
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
          <span className="w-3 h-3 rounded bg-amber-400" /> Normal
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
          <span className="w-3 h-3 rounded bg-red-500" /> Peak (High Price)
        </div>
      </div>

      {/* Timeline */}
      <ChartCard title="24-Hour Energy Price Timeline" subtitle="Recommended scheduling windows based on electricity pricing">
        <div className="space-y-3">
          <div className="flex gap-0.5 h-16 items-end">
            {timeSlots.map((slot, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group cursor-default">
                <span className="text-[9px] text-slate-500 dark:text-slate-400 font-medium group-hover:text-slate-800 dark:group-hover:text-white transition-colors">₹{slot.price}</span>
                <div
                  className={`w-full rounded-t ${getSlotColor(slot.type)} transition-all hover:opacity-80 hover:scale-y-105 origin-bottom`}
                  style={{ height: `${(slot.price / 8.5) * 100}%` }}
                  title={`${slot.hour} — ₹${slot.price}/kWh (${slot.type})`}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-0.5">
            {timeSlots.map((slot, i) => (
              <div key={i} className="flex-1 text-center">
                <span className="text-[9px] text-slate-400">{i % 3 === 0 ? slot.hour : ''}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <div className="flex-1 border border-dashed border-green-500/50 bg-green-500/5 rounded-lg p-3 text-center">
              <p className="text-xs font-semibold text-green-600 dark:text-green-400">🟢 Best Window: 2 AM – 5 AM</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">₹2.30 – ₹2.80 per kWh</p>
            </div>
            <div className="flex-1 border border-dashed border-red-500/50 bg-red-500/5 rounded-lg p-3 text-center">
              <p className="text-xs font-semibold text-red-600 dark:text-red-400">🔴 Avoid: 6 PM – 8 PM</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">₹7.90 – ₹8.20 per kWh</p>
            </div>
          </div>
        </div>
      </ChartCard>

      {/* Scheduled Workloads */}
      <ChartCard title="Scheduled Workloads" subtitle="Current task queue and assignments">
        <div className="mb-6">
          <div className="relative">
            <div className="flex border-b border-slate-200 dark:border-slate-700 pb-1 mb-2">
              {Array.from({ length: 24 }, (_, i) => (
                <div key={i} className="flex-1 text-center text-[9px] text-slate-400">{i.toString().padStart(2, '0')}</div>
              ))}
            </div>
            <div className="flex gap-px mb-1 h-3">
              {timeSlots.map((slot, i) => (
                <div key={i} className={`flex-1 rounded-sm ${getSlotColor(slot.type)} opacity-20`} />
              ))}
            </div>
            <div className="space-y-1.5">
              {workloads.map(w => (
                <div key={w.id} className="relative h-7 flex items-center">
                  <div
                    className={`absolute h-full rounded-md border flex items-center px-2 text-[10px] font-medium truncate ${getSlotBg(timeSlots[w.startHour]?.type)}`}
                    style={{
                      left: `${(w.startHour / 24) * 100}%`,
                      width: `${(w.duration / 24) * 100}%`,
                    }}
                  >
                    <span className="text-slate-700 dark:text-slate-200 truncate">{w.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                <th className="pb-3 pr-4">Task</th>
                <th className="pb-3 pr-4">Cluster</th>
                <th className="pb-3 pr-4">Time Slot</th>
                <th className="pb-3 pr-4">Duration</th>
                <th className="pb-3 pr-4">Priority</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {workloads.map(w => (
                <tr key={w.id} className="text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="py-2.5 pr-4 font-medium">{w.name}</td>
                  <td className="py-2.5 pr-4">{w.cluster}</td>
                  <td className="py-2.5 pr-4">
                    <div className="flex items-center gap-1.5">
                      <Clock size={13} className="text-slate-400" />
                      {w.startHour.toString().padStart(2, '0')}:00 – {((w.startHour + w.duration) % 24).toString().padStart(2, '0')}:00
                    </div>
                  </td>
                  <td className="py-2.5 pr-4">{w.duration}h</td>
                  <td className="py-2.5 pr-4">
                    <span className={`text-xs font-semibold ${w.priority === 'High' ? 'text-red-500' : w.priority === 'Medium' ? 'text-amber-500' : 'text-green-500'}`}>
                      {w.priority}
                    </span>
                  </td>
                  <td className="py-2.5"><StatusBadge status={w.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Schedule New Task</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Task Name</label>
                <input type="text" value={newTask.name} onChange={e => setNewTask({ ...newTask, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  placeholder="Enter task name" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Cluster</label>
                  <select value={newTask.cluster} onChange={e => setNewTask({ ...newTask, cluster: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50">
                    {['A', 'B', 'C', 'D', 'E', 'F'].map(c => <option key={c} value={`Cluster ${c}`}>Cluster {c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Priority</label>
                  <select value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50">
                    <option>High</option><option>Medium</option><option>Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Energy (kWh)</label>
                  <input type="number" min={100} max={5000} value={newTask.energyRequired} onChange={e => setNewTask({ ...newTask, energyRequired: +e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Start Hour</label>
                  <input type="number" min={0} max={23} value={newTask.startHour} onChange={e => setNewTask({ ...newTask, startHour: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Duration (hrs)</label>
                  <input type="number" min={1} max={12} value={newTask.duration} onChange={e => setNewTask({ ...newTask, duration: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50" />
                </div>
              </div>

              {/* AI Recommendation */}
              <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Sparkles size={15} className="text-green-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-green-700 dark:text-green-400">
                      AI Suggested: {bestSlot.start.toString().padStart(2, '0')}:00 – {bestSlot.end.toString().padStart(2, '0')}:00
                    </p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                      Avg. ₹{bestSlot.avgPrice}/kWh • Est. cost: ₹{bestSlot.estCost}
                    </p>
                    <button
                      type="button"
                      onClick={useAiSlot}
                      className="mt-1.5 text-[11px] font-semibold text-green-600 dark:text-green-400 hover:text-green-700 underline decoration-dashed underline-offset-2"
                    >
                      Apply this time slot →
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                Cancel
              </button>
              <button onClick={addTask} className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-semibold shadow-lg shadow-green-500/25 transition-colors">
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
