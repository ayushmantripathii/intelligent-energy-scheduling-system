const statusStyles = {
  Normal: 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400',
  Warning: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  Critical: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
  Running: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
  Scheduled: 'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400',
  Pending: 'bg-slate-100 text-slate-600 dark:bg-slate-600 dark:text-slate-300',
  Completed: 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${statusStyles[status] || statusStyles.Pending}`}>
      {status}
    </span>
  );
}
