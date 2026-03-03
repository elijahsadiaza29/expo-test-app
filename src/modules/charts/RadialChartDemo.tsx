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
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))',
    theme: { light: 'hsl(12 76% 61%)', dark: 'hsl(220 70% 50%)' },
  },
  mobile: {
    label: 'Mobile',
    color: 'hsl(var(--chart-2))',
    theme: { light: 'hsl(173 58% 39%)', dark: 'hsl(160 60% 45%)' },
  },
} satisfies ChartConfig;

export function RadialChartDemo() {
  const theme = useChartTheme();

  return (
    <View className="mt-4 rounded-xl border border-border bg-card p-4 shadow-sm">
      <View className="mb-6">
        <Text className="text-lg font-bold text-foreground">Radial Chart - Shape</Text>
        <Text className="text-sm text-muted-foreground">January - June 2024</Text>
      </View>
      <View className="items-center justify-center">
        <ChartContainer config={chartConfig}>
          <PieChart
            donut
            radius={100}
            innerRadius={80}
            centerLabelComponent={() => {
              return (
                <View className="items-center justify-center">
                  <Text className="text-2xl font-bold text-foreground">1,260</Text>
                  <Text className="text-xs text-muted-foreground">Visitors</Text>
                </View>
              );
            }}>
            <Pie value={1260} dataKey="desktop" />
            <Pie value={260} dataKey="mobile" />
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
        <Text className="text-xs text-muted-foreground">January - June 2024</Text>
      </View>
    </View>
  );
}
