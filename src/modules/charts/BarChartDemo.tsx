import {
  Bar,
  BarChart,
  ChartContainer,
  ChartLegend,
  useChartPointerConfig,
  type ChartConfig,
} from '@/components/ui/chart';
import React from 'react';
import { Text, View } from 'react-native';

const desktopData = [
  { value: 450, label: 'Jan' },
  { value: 390, label: 'Feb' },
  { value: 300, label: 'Mar' },
  { value: 240, label: 'Apr' },
  { value: 320, label: 'May' },
  { value: 524, label: 'Jun' },
];

const mobileData = [
  { value: 240, label: 'Jan' },
  { value: 210, label: 'Feb' },
  { value: 160, label: 'Mar' },
  { value: 190, label: 'Apr' },
  { value: 140, label: 'May' },
  { value: 140, label: 'May' },
];

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))',
    theme: {
      light: 'hsl(12 76% 61%)',
      dark: 'hsl(220 70% 50%)',
    },
  },
  mobile: {
    label: 'Mobile',
    color: 'hsl(var(--chart-2))',
    theme: {
      light: 'hsl(173 58% 39%)',
      dark: 'hsl(160 60% 45%)',
    },
  },
} satisfies ChartConfig;

export function BarChartDemo() {
  const pointerConfig = useChartPointerConfig({
    hidePointer1: true,
    activatePointersInstantlyOnTouch: true,
    pointerLabelHeight: 190,
  });

  return (
    <View className="mt-4 rounded-xl border border-border bg-card p-4 shadow-sm">
      <View className="mb-6">
        <Text className="text-lg font-bold text-foreground">Bar Chart - Multiple</Text>
        <Text className="text-sm text-muted-foreground">January - May 2024</Text>
      </View>
      <ChartContainer config={chartConfig}>
        <BarChart noOfSections={5} pointerConfig={pointerConfig}>
          <Bar data={desktopData} dataKey="desktop" />
          <Bar data={mobileData} dataKey="mobile" />
        </BarChart>
        <ChartLegend />
      </ChartContainer>
      <View className="mt-4 border-t border-border pt-4">
        <View className="flex flex-row items-center gap-2">
          <Text className="text-sm font-medium text-foreground">
            Trending up by 5.2% this month
          </Text>
        </View>
        <Text className="text-xs text-muted-foreground">
          Showing total visitors for the last 5 months
        </Text>
      </View>
    </View>
  );
}
