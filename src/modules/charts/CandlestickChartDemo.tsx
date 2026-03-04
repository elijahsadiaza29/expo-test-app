import {
  Candle,
  CandlestickChart,
  ChartContainer,
  ChartLegend,
  type CandleData,
  type ChartConfig,
} from '@/components/ui/chart';
import React from 'react';
import { Text, View } from 'react-native';

// Generate realistic-looking OHLC data
function generateMockData(): CandleData[] {
  const data: CandleData[] = [];
  let price = 175; // starting price
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  for (let i = 0; i < 30; i++) {
    const volatility = 2 + Math.random() * 4;
    const trend = (Math.random() - 0.48) * 3; // slight upward bias
    const open = price;
    const close = open + trend + (Math.random() - 0.5) * volatility;
    const high = Math.max(open, close) + Math.random() * volatility * 0.8;
    const low = Math.min(open, close) - Math.random() * volatility * 0.8;

    data.push({
      timestamp: now - (25 - i) * dayMs,
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
    });

    price = close;
  }
  return data;
}

const candleData = generateMockData();

const chartConfig = {
  positive: {
    label: 'Bullish',
    theme: {
      light: 'hsl(135 60% 49%)',
      dark: 'hsl(135 60% 49%)',
    },
  },
  negative: {
    label: 'Bearish',
    theme: {
      light: 'hsl(4 98% 59%)',
      dark: 'hsl(4 98% 59%)',
    },
  },
} satisfies ChartConfig;

export function CandlestickChartDemo() {
  return (
    <View className="mb-4 mt-4 rounded-xl border border-border bg-card p-4 shadow-sm">
      <View className="mb-4">
        <Text className="text-lg font-bold text-foreground">Candlestick Chart</Text>
        <Text className="text-sm text-muted-foreground">AAPL — Last 25 Trading Days</Text>
      </View>
      <ChartContainer config={chartConfig}>
        <CandlestickChart height={240}>
          <Candle data={candleData} dataKey="candle" />
        </CandlestickChart>
        <ChartLegend />
      </ChartContainer>
    </View>
  );
}
