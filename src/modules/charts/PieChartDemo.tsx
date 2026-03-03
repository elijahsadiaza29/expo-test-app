import React from 'react';
import { View, Text } from 'react-native';
import {
  ChartContainer,
  type ChartConfig,
  useChartTheme,
  ChartLegend,
  PieChart,
  Pie,
} from '@/components/ui/chart';

const chartConfig = {
  chrome: {
    label: 'Chrome',
    color: 'hsl(var(--chart-1))',
    theme: { light: 'hsl(12 76% 61%)', dark: 'hsl(220 70% 50%)' },
  },
  safari: {
    label: 'Safari',
    color: 'hsl(var(--chart-2))',
    theme: { light: 'hsl(173 58% 39%)', dark: 'hsl(160 60% 45%)' },
  },
  firefox: {
    label: 'Firefox',
    color: 'hsl(var(--chart-3))',
    theme: { light: 'hsl(197 37% 24%)', dark: 'hsl(30 80% 55%)' },
  },
  edge: {
    label: 'Edge',
    color: 'hsl(var(--chart-4))',
    theme: { light: 'hsl(43 74% 66%)', dark: 'hsl(280 65% 60%)' },
  },
  other: {
    label: 'Other',
    color: 'hsl(var(--chart-5))',
    theme: { light: 'hsl(27 87% 67%)', dark: 'hsl(340 75% 55%)' },
  },
} satisfies ChartConfig;

export function PieChartDemo() {
  return (
    <View className="mt-4 rounded-xl border border-border bg-card p-4 shadow-sm">
      <View className="mb-6">
        <Text className="text-lg font-bold text-foreground">Pie Chart - Donut</Text>
        <Text className="text-sm text-muted-foreground">January - June 2024</Text>
      </View>
      <View className="items-center justify-center">
        <ChartContainer config={chartConfig}>
          <PieChart showText textColor="white" radius={100} textSize={12}>
            <Pie value={275} dataKey="chrome" />
            <Pie value={200} dataKey="safari" />
            <Pie value={187} dataKey="firefox" />
            <Pie value={173} dataKey="edge" />
            <Pie value={90} dataKey="other" />
          </PieChart>
          <ChartLegend />
        </ChartContainer>
      </View>
      <View className="mt-4 border-t border-border pt-4">
        <View className="flex flex-row items-center gap-2">
          <Text className="text-sm font-medium text-foreground">
            Trending up by 5.2% this month
          </Text>
        </View>
        <Text className="text-xs text-muted-foreground">
          Showing total visitors for the last 6 months
        </Text>
      </View>
    </View>
  );
}
