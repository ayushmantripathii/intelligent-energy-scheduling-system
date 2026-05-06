import { Bell, Menu, Moon, Sun, RefreshCw, CheckCheck } from 'lucide-react';
import { useAuth } from '../../utils/AuthContext';
import { useTheme } from '../../utils/ThemeContext';
import { useState, useEffect, useRef } from 'react';

export default function Navbar({ onMenuClick }) {
  const { user } = useAuth();
  const { dark, toggle } = useTheme();
  const [showNotif, setShowNotif] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const notifRef = useRef(null);

  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Cluster C load exceeds 90% — critical alert', time: '2 min ago', type: 'critical', read: false },
    { id: 2, text: 'Solar generation peaked at 520 kW', time: '15 min ago', type: 'success', read: false },
    { id: 3, text: 'Electricity price rising — ₹7.80/kWh', time: '32 min ago', type: 'warning', read: false },
    { id: 4, text: 'Batch processing job completed', time: '1 hr ago', type: 'info', read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Dispatch custom event for pages to listen to
    window.dispatchEvent(new CustomEvent('dashboard-refresh'));
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Close notification dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const typeColors = {
    critical: 'bg-red-500',
    warning: 'bg-amber-500',
    success: 'bg-green-500',
    info: 'bg-blue-500',
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700/50 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <Menu size={20} />
          </button>
          <div>
            <h2 className="text-sm font-semibold text-slate-800 dark:text-white">
              Welcome back, {user?.username || 'User'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {user?.role || 'Operator'} • {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            title="Refresh data"
          >
            <RefreshCw size={17} className={refreshing ? 'animate-spin' : ''} />
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotif(!showNotif)}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 relative transition-colors"
            >
              <Bell size={17} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotif && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-white">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="flex items-center gap-1 text-[11px] font-medium text-green-600 dark:text-green-400 hover:text-green-700 transition-colors"
                    >
                      <CheckCheck size={13} /> Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => markRead(n.id)}
                      className={`px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700/50 last:border-0 cursor-pointer transition-colors ${
                        !n.read ? 'bg-slate-50/50 dark:bg-slate-700/20' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${typeColors[n.type] || 'bg-slate-400'}`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${!n.read ? 'text-slate-800 dark:text-white font-medium' : 'text-slate-600 dark:text-slate-300'}`}>
                            {n.text}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{n.time}</p>
                        </div>
                        {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold ml-1 shadow-sm">
            {user?.avatar || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
}
