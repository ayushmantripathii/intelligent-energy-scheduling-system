export default function ChartCard({ title, subtitle, children, action }) {
  return (
    <div className="rounded-2xl border border-slate-700/60 bg-slate-900/75 shadow-xl shadow-black/25 backdrop-blur-md overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-400/40 hover:shadow-cyan-500/10">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-wide">{title}</h3>
          {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="p-5">
        {children}
      </div>
    </div>
  );
}
