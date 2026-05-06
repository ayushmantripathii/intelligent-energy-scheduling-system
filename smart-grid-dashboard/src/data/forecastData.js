export const demandForecast = [
  { hour: '00:00', predicted: 810, lower: 760, upper: 860, actual: 820 },
  { hour: '01:00', predicted: 740, lower: 690, upper: 790, actual: 750 },
  { hour: '02:00', predicted: 670, lower: 620, upper: 720, actual: 680 },
  { hour: '03:00', predicted: 610, lower: 560, upper: 660, actual: 620 },
  { hour: '04:00', predicted: 580, lower: 530, upper: 630, actual: 590 },
  { hour: '05:00', predicted: 630, lower: 580, upper: 680, actual: 640 },
  { hour: '06:00', predicted: 770, lower: 720, upper: 820, actual: 780 },
  { hour: '07:00', predicted: 910, lower: 860, upper: 960, actual: 920 },
  { hour: '08:00', predicted: 1040, lower: 990, upper: 1090, actual: 1050 },
  { hour: '09:00', predicted: 1170, lower: 1120, upper: 1220, actual: 1180 },
  { hour: '10:00', predicted: 1270, lower: 1220, upper: 1320, actual: null },
  { hour: '11:00', predicted: 1340, lower: 1290, upper: 1390, actual: null },
  { hour: '12:00', predicted: 1310, lower: 1260, upper: 1360, actual: null },
  { hour: '13:00', predicted: 1280, lower: 1230, upper: 1330, actual: null },
  { hour: '14:00', predicted: 1250, lower: 1200, upper: 1300, actual: null },
  { hour: '15:00', predicted: 1190, lower: 1140, upper: 1240, actual: null },
  { hour: '16:00', predicted: 1140, lower: 1090, upper: 1190, actual: null },
  { hour: '17:00', predicted: 1090, lower: 1040, upper: 1140, actual: null },
  { hour: '18:00', predicted: 1170, lower: 1120, upper: 1220, actual: null },
  { hour: '19:00', predicted: 1240, lower: 1190, upper: 1290, actual: null },
  { hour: '20:00', predicted: 1140, lower: 1090, upper: 1190, actual: null },
  { hour: '21:00', predicted: 1010, lower: 960, upper: 1060, actual: null },
  { hour: '22:00', predicted: 910, lower: 860, upper: 960, actual: null },
  { hour: '23:00', predicted: 850, lower: 800, upper: 900, actual: null },
];

export const renewableForecast = [
  { hour: '00:00', solar: 0, wind: 120 },
  { hour: '02:00', solar: 0, wind: 110 },
  { hour: '04:00', solar: 0, wind: 130 },
  { hour: '06:00', solar: 80, wind: 140 },
  { hour: '08:00', solar: 280, wind: 150 },
  { hour: '10:00', solar: 420, wind: 140 },
  { hour: '12:00', solar: 520, wind: 120 },
  { hour: '14:00', solar: 480, wind: 130 },
  { hour: '16:00', solar: 350, wind: 140 },
  { hour: '18:00', solar: 150, wind: 160 },
  { hour: '20:00', solar: 20, wind: 170 },
  { hour: '22:00', solar: 0, wind: 150 },
];

export const aiInsights = [
  {
    title: 'Peak Demand Alert',
    description: 'Energy demand expected to peak at 1,340 kWh around 11:00 AM. Consider pre-cooling data halls and shifting non-essential workloads.',
    type: 'warning',
  },
  {
    title: 'Solar Generation Optimal',
    description: 'Solar output forecast to reach 520 kW at noon. Schedule high-compute tasks between 10 AM – 2 PM for maximum renewable utilization.',
    type: 'success',
  },
  {
    title: 'Wind Energy Increase Tonight',
    description: 'Wind generation expected to rise to 170 kW after 8 PM. Good opportunity for overnight batch processing with green energy.',
    type: 'info',
  },
  {
    title: 'Demand-Response Event Likely',
    description: 'Grid operator may trigger demand-response between 6 PM – 8 PM. Prepare load shedding protocols for non-critical systems.',
    type: 'warning',
  },
];
