import React from 'react';
import { View, Text } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import {
  ChartContainer,
  type ChartConfig,
  useChartTheme,
  ChartLegend,
  useChartPointerConfig,
} from '@/components/ui/chart';
import { useColorScheme } from 'nativewind';

const chartData = [
  { value: 450, label: 'Jan' },
  { value: 390, label: 'Feb' },
  { value: 300, label: 'Mar' },
  { value: 240, label: 'Apr' },
  { value: 320, label: 'May' },
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
} satisfies ChartConfig;

export function BarChartDemo() {
  const { colorScheme } = useColorScheme();
  const theme = useChartTheme();
  const color = colorScheme === 'dark' ? 'hsl(220 70% 50%)' : 'hsl(12 76% 61%)';
  const pointerConfig = useChartPointerConfig({
    hidePointer1: true,
    activatePointersInstantlyOnTouch: true,
    pointerLabelHeight: 190,
  });

  return (
    <View className="mt-4 rounded-xl border border-border bg-card p-4 shadow-sm">
      <View className="mb-6">
        <Text className="text-lg font-bold text-foreground">Bar Chart - Multiple</Text>
        <Text className="text-sm text-muted-foreground">January - June 2024</Text>
      </View>
      <ChartContainer config={chartConfig}>
        <BarChart
          data={chartData}
          barWidth={22}
          noOfSections={5}
          barBorderRadius={4}
          frontColor={color}
          yAxisThickness={0}
          xAxisThickness={0}
          yAxisTextStyle={{ color: theme.mutedForeground, fontSize: 10 }}
          xAxisLabelTextStyle={{ color: theme.mutedForeground, fontSize: 10 }}
          rulesColor={theme.border}
          rulesType="solid"
          width={300}
          pointerConfig={pointerConfig}
        />
        <ChartLegend />
      </ChartContainer>
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
