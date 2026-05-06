import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const AlertContext = createContext(null);

const DEFAULT_THRESHOLDS = {
  cost: 80000,
  renewable: 30,
  load: 85,
};

function upsertByType(prev, nextAlert) {
  const idx = prev.findIndex((item) => item.type === nextAlert.type);
  if (idx === -1) {
    return [nextAlert, ...prev];
  }

  const copy = [...prev];
  copy[idx] = nextAlert;
  return copy;
}

export function AlertProvider({ children }) {
  const [alerts, setAlerts] = useState([]);

  const dismissAlert = useCallback((id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  const pushAlert = useCallback((alert) => {
    const normalized = {
      id: alert.id || `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: alert.type || 'info',
      level: alert.level || 'warning',
      title: alert.title || 'Alert',
      description: alert.description || '',
      action: alert.action || 'Review system settings.',
      createdAt: Date.now(),
    };

    setAlerts((prev) => upsertByType(prev, normalized));
  }, []);

  const evaluateTriggers = useCallback((metrics, thresholds = DEFAULT_THRESHOLDS) => {
    const nextAlerts = [];

    if ((metrics.cost ?? 0) > thresholds.cost) {
      nextAlerts.push({
        type: 'high-cost',
        level: 'critical',
        title: 'High Cost Alert',
        description: `Current cost ₹${Number(metrics.cost).toLocaleString('en-IN')} exceeded threshold ₹${thresholds.cost.toLocaleString('en-IN')}.`,
        action: 'Shift tasks to off-peak hours.',
      });
    }

    if ((metrics.renewable ?? 100) < thresholds.renewable) {
      nextAlerts.push({
        type: 'sustainability-warning',
        level: 'warning',
        title: 'Sustainability Warning',
        description: `Renewable usage dropped to ${Number(metrics.renewable).toFixed(0)}%.`,
        action: 'Increase renewable input and defer non-critical load.',
      });
    }

    if ((metrics.load ?? 0) > thresholds.load) {
      nextAlerts.push({
        type: 'overload-alert',
        level: 'critical',
        title: 'Overload Alert',
        description: `System load reached ${Number(metrics.load).toFixed(0)}%.`,
        action: 'Rebalance workload and throttle peak clusters.',
      });
    }

    setAlerts((prev) => {
      const preserved = prev.filter(
        (alert) => !['high-cost', 'sustainability-warning', 'overload-alert'].includes(alert.type),
      );
      const normalizedNext = nextAlerts.map((alert) => ({
        ...alert,
        id: `${alert.type}`,
        createdAt: Date.now(),
      }));
      return [...normalizedNext, ...preserved];
    });
  }, []);

  const value = useMemo(
    () => ({ alerts, pushAlert, dismissAlert, evaluateTriggers }),
    [alerts, dismissAlert, evaluateTriggers, pushAlert],
  );

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
}

export function useAlerts() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlerts must be used within AlertProvider');
  }
  return context;
}
