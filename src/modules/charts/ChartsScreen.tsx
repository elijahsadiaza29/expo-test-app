import { Button } from '@/components/ui/button';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { AreaChartDemo } from './AreaChartDemo';
import { BarChartDemo } from './BarChartDemo';
import { CandlestickChartDemo } from './CandlestickChartDemo';
import { HorizontalBarChartDemo } from './HorizontalBarChartDemo';
import { LineChartDemo } from './LineChartDemo';
import { PieChartDemo } from './PieChartDemo';
import { RadialChartDemo } from './RadialChartDemo';

export function ChartsScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row items-center gap-4 border-b border-border px-4 py-6">
        <Button variant="ghost" size="icon" onPress={() => router.back()}>
          <ChevronLeft className="text-foreground" />
        </Button>
        <View>
          <Text className="text-2xl font-bold text-foreground">Charts</Text>
          <Text className="text-sm text-muted-foreground">Shadcn-style React Native Charts</Text>
        </View>
      </View>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <CandlestickChartDemo />
        <AreaChartDemo />
        <BarChartDemo />
        <LineChartDemo />
        <PieChartDemo />
        <RadialChartDemo />
        <HorizontalBarChartDemo />
      </ScrollView>
    </View>
  );
}
