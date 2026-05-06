# Intelligent Energy Scheduling for Smart Grid Data Centers

A clean and simple React + Vite demo app that simulates energy-aware workload scheduling decisions for a data center.

## Tech Stack

- React + Vite
- Tailwind CSS
- Chart.js (`chart.js` + `react-chartjs-2`)

## Features

- Minimal sidebar + content layout
- Dashboard with key metrics and 2 charts
- Energy demand prediction simulator
- Workload scheduler with recommendation output and task table
- Cost optimization calculator
- Smart grid peak load simulation with auto optimization
- Reports generation and CSV export
- Simple settings page

## Pages

1. Dashboard
2. Energy Prediction
3. Workload Scheduler
4. Cost Optimizer
5. Smart Grid Simulation (open from Dashboard)
6. Reports
7. Settings

## Project Structure

```text
src/
  components/
    layout/
      Layout.jsx
      Sidebar.jsx
  pages/
    Dashboard.jsx
    EnergyPrediction.jsx
    WorkloadScheduler.jsx
    CostOptimizer.jsx
    SmartGridSimulation.jsx
    Reports.jsx
    Settings.jsx
  data/
  utils/
  App.jsx
  main.jsx
  index.css
```

## Run Locally

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in terminal (typically `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```
