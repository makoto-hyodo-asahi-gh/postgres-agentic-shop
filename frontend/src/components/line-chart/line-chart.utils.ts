import { theme } from 'styles/theme';

export const chartData = [
  { month: 'Jan', price: 400 },
  { month: 'Feb', price: 390 },
  { month: 'Mar', price: 400 },
  { month: 'Apr', price: 420 },
  { month: 'May', price: 440 },
  { month: 'Jun', price: 410 },
  { month: 'Jul', price: 420 },
  { month: 'Aug', price: 430 },
  { month: 'Sep', price: 440 },
  { month: 'Oct', price: 450 },
  { month: 'Nov', price: 460 },
  { month: 'Dec', price: 470 },
];

export const chartConfig = {
  data: chartData,
  height: 340,
  width: 470,
  xField: 'month',
  yField: 'price',
  smooth: true,
  color: theme.colors.hover,
  point: {
    size: 2,
    shape: 'circle',
  },
};
