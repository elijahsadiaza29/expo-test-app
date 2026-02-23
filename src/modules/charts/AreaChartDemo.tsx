import React from 'react';
import { View, Text } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import {
  ChartContainer,
  type ChartConfig,
  useChartTheme,
  ChartLegend,
  ChartTooltip,
} from '@/components/ui/chart';
import { useColorScheme } from 'nativewind';

const chartData = [
  { value: 400, label: 'Jan' },
  { value: 420, label: 'Feb' },
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
    color: 'var(--chart-1)',
    theme: {
      light: 'hsl(12 76% 61%)',
      dark: 'hsl(220 70% 50%)',
    },
  },
} satisfies ChartConfig;

export function AreaChartDemo() {
  const { colorScheme } = useColorScheme();
  const theme = useChartTheme();
  const color = colorScheme === 'dark' ? 'hsl(220 70% 50%)' : 'hsl(12 76% 61%)';

  return (
    <View className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <View className="mb-6">
        <Text className="text-lg font-bold text-foreground">Area Chart - Simple</Text>
        <Text className="text-sm text-muted-foreground">
          Showing total visitors for the last 6 months
        </Text>
      </View>
      <ChartContainer config={chartConfig}>
        <LineChart
          areaChart
          data={chartData}
          hideDataPoints
          thickness={2}
          color={color}
          startFillColor={color}
          endFillColor={color}
          startOpacity={0.4}
          endOpacity={0.1}
          noOfSections={5}
          yAxisColor="transparent"
          xAxisColor="transparent"
          yAxisTextStyle={{ color: theme.mutedForeground, fontSize: 10 }}
          xAxisLabelTextStyle={{ color: theme.mutedForeground, fontSize: 10 }}
          rulesType="solid"
          rulesColor={theme.border}
          pointerConfig={{
            showPointerStrip: false,
            pointerStripWidth: 2,
            pointerColor: theme.mutedForeground,
            radius: 4,
            pointerLabelWidth: 100,
            pointerLabelHeight: 90,
            activatePointersOnLongPress: false,
            autoAdjustPointerLabelPosition: true,
            persistPointer: false,
            resetPointerIndexOnRelease: false,
            pointerVanishDelay: 2000,
            pointerLabelComponent: (items: any) => {
              return <ChartTooltip active={true} payload={items} />;
            },
          }}
        />
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
