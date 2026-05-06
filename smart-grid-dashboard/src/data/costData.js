export const pricePrediction = [
  { time: '00:00', actual: 3.2, predicted: 3.1 },
  { time: '02:00', actual: 2.5, predicted: 2.4 },
  { time: '04:00', actual: 2.6, predicted: 2.7 },
  { time: '06:00', actual: 4.2, predicted: 4.0 },
  { time: '08:00', actual: 6.8, predicted: 7.0 },
  { time: '10:00', actual: 7.8, predicted: 7.5 },
  { time: '12:00', actual: 7.6, predicted: 7.8 },
  { time: '14:00', actual: 6.9, predicted: 7.1 },
  { time: '16:00', actual: 6.2, predicted: 6.0 },
  { time: '18:00', actual: 7.9, predicted: 8.1 },
  { time: '20:00', actual: 7.1, predicted: 6.9 },
  { time: '22:00', actual: 4.5, predicted: 4.3 },
];

export const monthlyCostData = [
  { month: 'Jul', cost: 285000, optimized: 248000 },
  { month: 'Aug', cost: 298000, optimized: 255000 },
  { month: 'Sep', cost: 272000, optimized: 238000 },
  { month: 'Oct', cost: 310000, optimized: 262000 },
  { month: 'Nov', cost: 295000, optimized: 251000 },
  { month: 'Dec', cost: 320000, optimized: 268000 },
];

export const aiRecommendations = [
  {
    id: 1,
    title: 'Shift Batch Workloads to Off-Peak Hours',
    description: 'Move batch processing tasks to 2 AM – 5 AM when electricity rates are ₹2.30–₹2.80/kWh, saving up to 65% on energy costs.',
    impact: 'High',
    savings: '₹18,500/month',
    icon: 'clock',
  },
  {
    id: 2,
    title: 'Maximize Renewable Energy Usage',
    description: 'Schedule compute-intensive tasks during 10 AM – 2 PM when solar generation peaks at 580 kW capacity.',
    impact: 'High',
    savings: '₹12,200/month',
    icon: 'sun',
  },
  {
    id: 3,
    title: 'Reduce Peak Hour Usage by 15%',
    description: 'Defer non-critical workloads from 6 PM – 9 PM slot. Current peak usage is 23% above optimal threshold.',
    impact: 'Medium',
    savings: '₹8,900/month',
    icon: 'trending-down',
  },
  {
    id: 4,
    title: 'Enable Dynamic Cooling Optimization',
    description: 'Reduce cooling energy by adjusting set points during off-peak hours. AI predicts 8% cooling energy reduction is safe.',
    impact: 'Medium',
    savings: '₹6,400/month',
    icon: 'thermometer',
  },
  {
    id: 5,
    title: 'Consolidate Underutilized Clusters',
    description: 'Cluster D is at 45% utilization. Migrating workloads and entering low-power state can save significant energy.',
    impact: 'Low',
    savings: '₹4,100/month',
    icon: 'server',
  },
];

export const costSummary = {
  currentMonthly: '₹3,20,000',
  optimizedMonthly: '₹2,68,000',
  estimatedSavings: '₹52,000',
  savingsPercent: '16.25%',
  currentPrice: '₹6.50',
  avgPrice: '₹5.82',
  lowestPrice: '₹2.30',
  peakPrice: '₹8.20',
};
