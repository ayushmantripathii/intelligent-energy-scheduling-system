export const dashboardStats = {
  totalEnergy: { value: '12,847', unit: 'kWh', change: '+2.4%', trend: 'up' },
  currentLoad: { value: '73', unit: '%', change: '-1.2%', trend: 'down' },
  renewablePercent: { value: '41', unit: '%', change: '+5.8%', trend: 'up' },
  electricityPrice: { value: '₹6.50', unit: '/kWh', change: '+0.30', trend: 'up' },
};

export const energyUsageTimeline = [
  { time: '00:00', usage: 820, renewable: 340, grid: 480 },
  { time: '01:00', usage: 750, renewable: 310, grid: 440 },
  { time: '02:00', usage: 680, renewable: 290, grid: 390 },
  { time: '03:00', usage: 620, renewable: 270, grid: 350 },
  { time: '04:00', usage: 590, renewable: 260, grid: 330 },
  { time: '05:00', usage: 640, renewable: 280, grid: 360 },
  { time: '06:00', usage: 780, renewable: 350, grid: 430 },
  { time: '07:00', usage: 920, renewable: 410, grid: 510 },
  { time: '08:00', usage: 1050, renewable: 480, grid: 570 },
  { time: '09:00', usage: 1180, renewable: 520, grid: 660 },
  { time: '10:00', usage: 1280, renewable: 560, grid: 720 },
  { time: '11:00', usage: 1350, renewable: 580, grid: 770 },
  { time: '12:00', usage: 1320, renewable: 600, grid: 720 },
  { time: '13:00', usage: 1290, renewable: 590, grid: 700 },
  { time: '14:00', usage: 1260, renewable: 570, grid: 690 },
  { time: '15:00', usage: 1200, renewable: 530, grid: 670 },
  { time: '16:00', usage: 1150, renewable: 490, grid: 660 },
  { time: '17:00', usage: 1100, renewable: 420, grid: 680 },
  { time: '18:00', usage: 1180, renewable: 350, grid: 830 },
  { time: '19:00', usage: 1250, renewable: 280, grid: 970 },
  { time: '20:00', usage: 1150, renewable: 240, grid: 910 },
  { time: '21:00', usage: 1020, renewable: 210, grid: 810 },
  { time: '22:00', usage: 920, renewable: 230, grid: 690 },
  { time: '23:00', usage: 860, renewable: 300, grid: 560 },
];

export const energySourceSplit = [
  { name: 'Solar', value: 28, color: '#F59E0B' },
  { name: 'Wind', value: 13, color: '#3B82F6' },
  { name: 'Grid', value: 59, color: '#64748B' },
];

export const serverClusterLoad = [
  { name: 'Cluster A', load: 82, capacity: 100 },
  { name: 'Cluster B', load: 65, capacity: 100 },
  { name: 'Cluster C', load: 91, capacity: 100 },
  { name: 'Cluster D', load: 45, capacity: 100 },
  { name: 'Cluster E', load: 78, capacity: 100 },
  { name: 'Cluster F', load: 56, capacity: 100 },
];
