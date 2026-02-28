import React from 'react';
import { View, Text } from 'react-native';
import {
  ChartContainer,
  type ChartConfig,
  useChartTheme,
  ChartLegend,
  useChartPointerConfig,
  AreaChart,
  Area,
} from '@/components/ui/chart';
import { useColorScheme } from 'nativewind';

const desktopData = [
  { value: 400, label: 'Jan' },
  { value: 300, label: 'Feb' },
  { value: 200, label: 'Mar' },
  { value: 278, label: 'Apr' },
  { value: 189, label: 'May' },
  { value: 239, label: 'Jun' },
  { value: 394, label: 'Jul' },
  { value: 120, label: 'Aug' },
  { value: 349, label: 'Sep' },
  { value: 300, label: 'Oct' },
  { value: 39, label: 'Nov' },
  { value: 349, label: 'Dec' },
];

const mobileData = [
  { value: 240, label: 'Jan' },
  { value: 210, label: 'Feb' },
  { value: 160, label: 'Mar' },
  { value: 190, label: 'Apr' },
  { value: 140, label: 'May' },
  { value: 180, label: 'Jun' },
  { value: 280, label: 'Jul' },
  { value: 110, label: 'Aug' },
  { value: 250, label: 'Sep' },
  { value: 220, label: 'Oct' },
  { value: 30, label: 'Nov' },
  { value: 210, label: 'Dec' },
];

const tabletData = [
  { value: 20, label: 'Jan' },
  { value: 10, label: 'Feb' },
  { value: 10, label: 'Mar' },
  { value: 10, label: 'Apr' },
  { value: 10, label: 'May' },
  { value: 10, label: 'Jun' },
  { value: 10, label: 'Jul' },
  { value: 10, label: 'Aug' },
  { value: 10, label: 'Sep' },
  { value: 220, label: 'Oct' },
  { value: 30, label: 'Nov' },
  { value: 210, label: 'Dec' },
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
      light: 'hsla(73, 100%, 51%, 1.00)',
      dark: 'hsla(54, 100%, 50%, 1.00)',
    },
  },
} satisfies ChartConfig;

export function AreaChartDemo() {
  const theme = useChartTheme();
  const pointerConfig = useChartPointerConfig();

  return (
    <View className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <View className="mb-6">
        <Text className="text-lg font-bold text-foreground">Area Chart - Simple</Text>
        <Text className="text-sm text-muted-foreground">
          Showing total visitors for the last 6 months
        </Text>
      </View>
      <ChartContainer config={chartConfig}>
        <AreaChart
          curved
          noOfSections={5}
          yAxisColor="transparent"
          xAxisColor="transparent"
          yAxisTextStyle={{ color: theme.mutedForeground, fontSize: 10 }}
          xAxisLabelTextStyle={{ color: theme.mutedForeground, fontSize: 10 }}
          rulesType="solid"
          rulesColor={theme.border}
          pointerConfig={pointerConfig}>
          <Area data={desktopData} dataKey="desktop" hideDataPoints />
          <Area data={mobileData} dataKey="mobile" hideDataPoints />
          <Area data={tabletData} dataKey="tablet" hideDataPoints />
        </AreaChart>
        <ChartLegend />
      </ChartContainer>
      <View className="mt-4 border-t border-border pt-4">
        <View className="flex flex-row items-center gap-2">
          <Text className="text-sm font-medium text-foreground">
            Trending up by 5.2% this month
          </Text>
        </View>
        <Text className="text-xs text-muted-foreground">January - June 2024</Text>
      </View>
    </View>
  );
}
