import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import CostOptimizer from './pages/CostOptimizer';
import Dashboard from './pages/Dashboard';
import EnergyPrediction from './pages/EnergyPrediction';
import Login from './pages/Login';
import RenewableEnergyUtilization from './pages/RenewableEnergyUtilization';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import SmartGridSimulation from './pages/SmartGridSimulation';
import WorkloadScheduler from './pages/WorkloadScheduler';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/prediction" element={<EnergyPrediction />} />
          <Route path="/scheduler" element={<WorkloadScheduler />} />
          <Route path="/cost" element={<CostOptimizer />} />
          <Route path="/renewable" element={<RenewableEnergyUtilization />} />
          <Route path="/simulation" element={<SmartGridSimulation />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
