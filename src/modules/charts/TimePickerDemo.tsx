import { TimePicker, type TimePickerValue } from '@/components/ui/time-picker';
import React from 'react';
import { Text, View } from 'react-native';

export function TimePickerDemo() {
  const [dialResult, setDialResult] = React.useState<string | null>(null);
  const [inputResult, setInputResult] = React.useState<string | null>(null);

  const formatResult = (v: TimePickerValue) =>
    `${v.hour.toString().padStart(2, '0')}:${v.minute.toString().padStart(2, '0')} ${v.period}`;

  return (
    <View>
      {/* Dial Mode */}
      <View className="mt-4 rounded-xl border border-border bg-card p-4 shadow-sm">
        <View className="mb-4">
          <Text className="text-lg font-bold text-foreground">Time Picker — Dial</Text>
          <Text className="text-sm text-muted-foreground">M3 clock face with touch gestures</Text>
        </View>
        <View className="items-center">
          <TimePicker
            initialHour={7}
            initialMinute={0}
            initialPeriod="AM"
            initialMode="dial"
            onConfirm={(v) => setDialResult(formatResult(v))}
            onCancel={() => setDialResult('Cancelled')}
          />
        </View>
      </View>

      {/* Input Mode */}
      <View className="mb-4 mt-4 rounded-xl border border-border bg-card p-4 shadow-sm">
        <View className="mb-4">
          <Text className="text-lg font-bold text-foreground">Time Picker — Input</Text>
          <Text className="text-sm text-muted-foreground">M3 keyboard entry with text inputs</Text>
        </View>
        <View className="items-center">
          <TimePicker
            initialHour={7}
            initialMinute={0}
            initialPeriod="AM"
            initialMode="input"
            onConfirm={(v) => setInputResult(formatResult(v))}
            onCancel={() => setInputResult('Cancelled')}
          />
        </View>
      </View>
    </View>
  );
}
