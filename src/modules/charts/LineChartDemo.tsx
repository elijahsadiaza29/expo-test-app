import React from 'react';
import { View, Text } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { ChartContainer, type ChartConfig, useChartTheme } from '@/components/ui/chart';
import { useColorScheme } from 'nativewind';

const chartData = [
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

export function LineChartDemo() {
  const { colorScheme } = useColorScheme();
  const theme = useChartTheme();
  const color1 = colorScheme === 'dark' ? 'hsl(220 70% 50%)' : 'hsl(12 76% 61%)';
  // Note: color2 can be used for a second line if needed

  return (
    <View className="mt-4 rounded-xl border border-border bg-card p-4 shadow-sm">
      <View className="mb-6">
        <Text className="text-lg font-bold text-foreground">Line Chart - Multiple</Text>
        <Text className="text-sm text-muted-foreground">January - June 2024</Text>
      </View>
      <ChartContainer config={chartConfig}>
        <LineChart
          data={chartData}
          spacing={40}
          color={color1}
          thickness={2}
          dataPointsHeight={6}
          dataPointsWidth={6}
          dataPointsColor={color1}
          noOfSections={5}
          yAxisColor="transparent"
          xAxisColor="transparent"
          yAxisTextStyle={{ color: theme.mutedForeground, fontSize: 10 }}
          xAxisLabelTextStyle={{ color: theme.mutedForeground, fontSize: 10 }}
          rulesType="solid"
          rulesColor={theme.border}
        />
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
