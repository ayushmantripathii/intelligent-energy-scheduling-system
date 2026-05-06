# Intelligent Energy Scheduling System

AI-powered smart grid energy scheduling and monitoring system with workload optimization, peak demand management, renewable energy utilization, automated alerts, and real-time analytics dashboard.

## Highlights

- Energy-aware workload scheduling with recommendation output
- Peak load simulation and automated optimization
- Renewable energy utilization insights
- Cost optimization calculator
- Alerts and status indicators
- Charts, metrics, and reports

## Project Layout

```text
smart-grid-dashboard/   React + Vite frontend app
```

## Prerequisites

- Node.js 18+ and npm

## Quick Start

```bash
cd smart-grid-dashboard
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal (typically http://localhost:5173).

## Available Scripts

Run these from the smart-grid-dashboard folder:

```bash
npm run dev      # Start the dev server
npm run build    # Production build
npm run preview  # Preview the production build locally
npm run lint     # Lint the codebase (if configured)
```

## Key Pages

- Dashboard
- Energy Prediction
- Workload Scheduler
- Cost Optimizer
- Smart Grid Simulation
- Reports
- Settings

## Tech Stack

- React
- Vite
- Tailwind CSS
- Chart.js (via react-chartjs-2)

## Project Structure

```text
smart-grid-dashboard/
	public/
	src/
		assets/
		components/
			alerts/
			cards/
			charts/
			forms/
			layout/
			ui/
		data/
		pages/
		utils/
		App.jsx
		main.jsx
		index.css
```

## Build

```bash
cd smart-grid-dashboard
npm run build
npm run preview
```

## Notes

- If you see missing dependency errors, run `npm install` again in smart-grid-dashboard.
- Node modules are intentionally ignored in version control.

## License

Specify a license if you plan to distribute this project.
