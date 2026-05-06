import { useState } from 'react';

export default function SmartGridSimulation() {
  const [load, setLoad] = useState(68);
  const [energyUsage, setEnergyUsage] = useState(1280);
  const [warning, setWarning] = useState('');
  const [optimizationNote, setOptimizationNote] = useState('');

  const simulatePeakLoad = () => {
    setLoad((prev) => Math.min(prev + 20, 100));
    setEnergyUsage((prev) => prev + 260);
    setWarning('Peak demand detected. Rescheduling recommended.');
    setOptimizationNote('');
  };

  const autoOptimize = () => {
    setLoad((prev) => Math.max(prev - 15, 30));
    setEnergyUsage((prev) => Math.max(prev - 180, 700));
    setWarning('');
    setOptimizationNote('Load reduced and non-critical tasks shifted to low-price periods.');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-semibold">Smart Grid Simulation</h2>
        <p className="text-sm text-slate-400">Simulate peak demand behavior and auto optimization actions.</p>
      </div>

      <div className="card space-y-2">
        <p>Current Server Load: <span className="font-semibold text-blue-400">{load}%</span></p>
        <p>Current Energy Usage: <span className="font-semibold text-green-400">{energyUsage} kWh</span></p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={simulatePeakLoad}
          className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium hover:bg-orange-500"
        >
          Simulate Peak Load
        </button>

        <button
          onClick={autoOptimize}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium hover:bg-green-500"
        >
          Auto Optimize
        </button>
      </div>

      {warning && (
        <div className="card border-orange-500/50 text-orange-400">
          ⚠ {warning}
        </div>
      )}

      {optimizationNote && (
        <div className="card border-green-500/40 text-green-400">
          {optimizationNote}
        </div>
      )}
    </div>
  );
}
