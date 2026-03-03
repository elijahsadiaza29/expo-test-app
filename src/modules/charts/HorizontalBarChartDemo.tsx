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
  { value: 700, label: 'Website' },
  { value: 390, label: 'Social' },
  // { value: 300, label: 'Ads' },
  // { value: 240, label: 'Direct' },
  // { value: 320, label: 'Other' },
  // { value: 100, label: 'test' },
  // { value: 100, label: 'if' },
  // { value: 100, label: 'else' },
];

const mobileData = [
  { value: 240, label: 'Website' },
  { value: 210, label: 'Social' },
  // { value: 160, label: 'Ads' },
  // { value: 190, label: 'Direct' },
  // { value: 140, label: 'Other' },
  // { value: 100, label: 'test' },
  // { value: 100, label: 'if' },
  // { value: 100, label: 'else' },
];

const tabletData = [
  { value: 1000, label: 'Website' },
  { value: 390, label: 'Social' },
  // { value: 300, label: 'Ads' },
  // { value: 240, label: 'Direct' },
  // { value: 320, label: 'Other' },
  // { value: 100, label: 'test' },
  // { value: 100, label: 'if' },
  // { value: 100, label: 'else' },
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
  tablet: {
    label: 'Tablet',
    color: 'hsl(var(--chart-3))',
    theme: {
      light: 'hsl(197 37% 24%)',
      dark: 'hsl(30 80% 55%)',
    },
  },
} satisfies ChartConfig;

export function HorizontalBarChartDemo() {
  const pointerConfig = useChartPointerConfig({
    hidePointer1: true,
    activatePointersInstantlyOnTouch: true,
  });

  // Note: For horizontal charts, many props act differently due to rotation.
  // We often need to adjust margins and shifts.

  return (
    <View className="mt-4 rounded-xl border border-border bg-card p-4 shadow-sm">
      <View>
        <Text className="text-lg font-bold text-foreground">Bar Chart - Horizontal</Text>
        <Text className="text-sm text-muted-foreground">Traffic Sources by Device</Text>
      </View>
      <ChartContainer config={chartConfig}>
        <BarChart horizontal pointerConfig={pointerConfig}>
          <Bar data={desktopData} dataKey="desktop" />
          <Bar data={mobileData} dataKey="mobile" />
          <Bar data={tabletData} dataKey="tablet" />
        </BarChart>
        <ChartLegend />
      </ChartContainer>
      <View className="mt-4 border-t border-border pt-4">
        <View className="flex flex-row items-center gap-2">
          <Text className="text-sm font-medium text-foreground">
            Desktop dominates website traffic
          </Text>
        </View>
        <Text className="text-xs text-muted-foreground">Showing data for May 2024</Text>
      </View>
    </View>
  );
}
