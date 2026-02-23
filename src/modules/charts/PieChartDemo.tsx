import React from 'react';
import { View, Text } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import {
  ChartContainer,
  type ChartConfig,
  useChartTheme,
  ChartLegend,
} from '@/components/ui/chart';
import { useColorScheme } from 'nativewind';

const chartConfig = {
  chrome: {
    label: 'Chrome',
    theme: { light: 'hsl(12 76% 61%)', dark: 'hsl(220 70% 50%)' },
  },
  safari: {
    label: 'Safari',
    theme: { light: 'hsl(173 58% 39%)', dark: 'hsl(160 60% 45%)' },
  },
  firefox: {
    label: 'Firefox',
    theme: { light: 'hsl(197 37% 24%)', dark: 'hsl(30 80% 55%)' },
  },
  edge: {
    label: 'Edge',
    theme: { light: 'hsl(43 74% 66%)', dark: 'hsl(280 65% 60%)' },
  },
  other: {
    label: 'Other',
    theme: { light: 'hsl(27 87% 67%)', dark: 'hsl(340 75% 55%)' },
  },
} satisfies ChartConfig;

export function PieChartDemo() {
  const { colorScheme } = useColorScheme();
  const theme = useChartTheme();
  const isDark = colorScheme === 'dark';

  const chartData = [
    { value: 275, color: isDark ? 'hsl(220 70% 50%)' : 'hsl(12 76% 61%)', text: 'Chrome' },
    { value: 200, color: isDark ? 'hsl(160 60% 45%)' : 'hsl(173 58% 39%)', text: 'Safari' },
    { value: 187, color: isDark ? 'hsl(30 80% 55%)' : 'hsl(197 37% 24%)', text: 'Firefox' },
    { value: 173, color: isDark ? 'hsl(280 65% 60%)' : 'hsl(43 74% 66%)', text: 'Edge' },
    { value: 90, color: isDark ? 'hsl(340 75% 55%)' : 'hsl(27 87% 67%)', text: 'Other' },
  ];

  return (
    <View className="mt-4 rounded-xl border border-border bg-card p-4 shadow-sm">
      <View className="mb-6">
        <Text className="text-lg font-bold text-foreground">Pie Chart - Donut</Text>
        <Text className="text-sm text-muted-foreground">January - June 2024</Text>
      </View>
      <View className="items-center justify-center">
        <ChartContainer config={chartConfig}>
          <PieChart showText textColor="white" radius={100} textSize={12} data={chartData} />
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
