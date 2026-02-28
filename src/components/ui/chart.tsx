import * as React from 'react';
import { View, Text, type ViewStyle, type LayoutChangeEvent } from 'react-native';
import { useColorScheme } from 'nativewind';
import { cn } from '@/lib/utils';

// --- Types ---

export type ChartConfig = {
  [key: string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
    color?: string;
    theme?: {
      light?: string;
      dark?: string;
    };
  };
};

type ChartContextProps = {
  config: ChartConfig;
  width: number;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

export function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error('useChart must be used within a ChartContainer');
  }
  return context;
}

// --- Components ---

/**
 * ChartContainer – Acts as a responsive wrapper (like Shadcn's ResponsiveContainer).
 *
 * It measures its own available width via `onLayout` and automatically injects
 * that width into any direct gifted-charts child so charts always fit their
 * parent without overflow. No hardcoded width is needed in individual charts.
 */
export function ChartContainer({
  id,
  config,
  children,
  className,
  style,
}: {
  id?: string;
  config: ChartConfig;
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}) {
  const { colorScheme } = useColorScheme();
  const [containerWidth, setContainerWidth] = React.useState(0);

  const handleLayout = React.useCallback((event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  }, []);

  // Resolve theme colours into the config
  const chartConfig = React.useMemo(() => {
    const resolvedConfig: ChartConfig = {};
    Object.entries(config).forEach(([key, value]) => {
      let color = value.color;
      if (value.theme) {
        color = colorScheme === 'dark' ? value.theme.dark : value.theme.light;
      }
      resolvedConfig[key] = { ...value, color };
    });
    return resolvedConfig;
  }, [config, colorScheme]);

  // Inject responsive props into direct chart children so they auto-fit.
  // This mirrors how Shadcn's web ChartContainer wraps children in a
  // ResponsiveContainer – charts always compress to fit, never scroll.
  const responsiveChildren = React.useMemo(() => {
    if (containerWidth === 0) return null;

    return React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return child;

      const childProps = child.props as Record<string, any>;
      let data: any[] | undefined = childProps.data;
      let numSeries = 1;

      // Logic Refactor: Extract data from ALL marker children (Shadcn style)
      if (childProps.children) {
        const markerSeries = React.Children.toArray(childProps.children).filter(
          (c): c is React.ReactElement<MarkerProps> =>
            React.isValidElement(c) && (c.type === Area || c.type === Bar || c.type === Line)
        );

        if (markerSeries.length > 0) {
          numSeries = markerSeries.length;
          // Use the longest data set to determine widths/spacing
          const longestSeries = markerSeries.reduce((prev, curr) =>
            (curr.props.data?.length ?? 0) > (prev.props.data?.length ?? 0) ? curr : prev
          );
          data = longestSeries.props.data;
        }
      }

      if (!data?.length || childProps.donut !== undefined || childProps.radius !== undefined) {
        return child;
      }

      const yAxisLabelWidth = childProps.yAxisLabelWidth ?? 40;
      const chartWidth = Math.max(containerWidth - yAxisLabelWidth, 0);
      const isBarChart = child.type === BarChart || (childProps.barWidth ?? 0) > 0;

      const overrides: Record<string, any> = {
        width: chartWidth,
        initialSpacing: 0,
        endSpacing: 0,
        disableScroll: true,
      };

      if (isBarChart) {
        const totalBars = data.length * numSeries;
        const slotWidth = chartWidth / totalBars;
        const gap = Math.min(4, Math.max(Math.floor(slotWidth * 0.1), 1));
        const barWidth = Math.max(Math.floor(slotWidth - gap), 1);

        overrides.barWidth = barWidth;
        overrides.spacing = gap;
      } else {
        const n = data.length;

        const pointRadius = childProps.dataPointsRadius ?? 0;
        const safeWidth = Math.max(chartWidth - pointRadius, 0);
        const spacing = n > 1 ? safeWidth / (n - 0) : 0;

        overrides.width = safeWidth;
        overrides.spacing = spacing;
        overrides.initialSpacing = 8;
        overrides.endSpacing = -8;
        overrides.adjustToWidth = false;
      }

      return React.cloneElement(child as React.ReactElement<any>, overrides);
    });
  }, [children, containerWidth]);

  // Determine if we should center align the chart (Pie/Radial charts)
  const isCentered = React.useMemo(() => {
    let centered = false;
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        const props = child.props as Record<string, any>;
        if (props.donut !== undefined || props.radius !== undefined) {
          centered = true;
        }
      }
    });
    return centered;
  }, [children]);

  return (
    <ChartContext.Provider value={{ config: chartConfig, width: containerWidth }}>
      <View
        id={id}
        onLayout={handleLayout}
        style={[
          { width: '100%', overflow: 'hidden', alignItems: isCentered ? 'center' : 'stretch' },
          style,
        ]}>
        {responsiveChildren}
      </View>
    </ChartContext.Provider>
  );
}

export function ChartLegend({ className, style }: { className?: string; style?: any }) {
  const { config } = useChart();

  if (!config) return null;

  return (
    <View
      className={cn('mt-4 flex flex-row flex-wrap items-center justify-center gap-4', className)}
      style={style}>
      {Object.entries(config).map(([key, item]) => {
        if (!item.label) return null;
        return (
          <View key={key} className="flex flex-row items-center gap-1.5">
            <View
              style={{
                width: 12,
                height: 12,
                borderRadius: 2,
                backgroundColor: item.color || '#000',
              }}
            />
            <Text className="text-sm text-muted-foreground">{item.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

export function ChartTooltip({
  active,
  payload,
  label,
  indicator = 'dot',
  hideLabel = false,
  hideIndicator = false,
}: any) {
  const { config } = useChart();

  if (!active || !payload?.length) {
    return null;
  }

  // gifted-charts sometimes passes a single object instead of an array
  const items = Array.isArray(payload) ? payload : [payload];
  const tooltipLabel = label || items[0]?.label;

  return (
    <View className="min-w-[130px] rounded-xl border border-border bg-card px-3 py-2 shadow-sm">
      {!hideLabel && tooltipLabel ? (
        <Text className="mb-2 text-sm font-medium text-foreground">{tooltipLabel}</Text>
      ) : null}
      <View className="flex flex-col gap-1.5">
        {items.map((item: any, index: number) => {
          const configKeys = Object.keys(config);
          // If the item doesn't explicitly have a `dataKey`, try to match it by index,
          // or fallback to the first config key if it's a single-series chart.
          const key =
            item.dataKey || item.name || configKeys[Math.min(index, configKeys.length - 1)];
          const conf = config[key];

          if (!conf) return null;

          const itemColor = item.color || item.frontColor || conf.color || '#000';

          return (
            <View key={index} className="flex flex-row items-center justify-between gap-4">
              <View className="flex flex-row items-center gap-2">
                {!hideIndicator && (
                  <View
                    style={{
                      width: indicator === 'dot' ? 8 : 4,
                      height: indicator === 'dot' ? 8 : 12,
                      borderRadius: indicator === 'dot' ? 4 : 2,
                      backgroundColor: itemColor,
                    }}
                  />
                )}
                <Text className="text-sm text-muted-foreground">{conf.label || key}</Text>
              </View>
              <Text className="font-mono text-sm font-bold text-foreground">{item.value}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

// --- Marker Components ---

type MarkerProps = {
  data: any[];
  dataKey: string;
  color?: string;
  thickness?: number;
  hideDataPoints?: boolean;
  dataPointsColor?: string;
};

export function Area(_props: MarkerProps) {
  return null;
}

export function Bar(_props: { data: any[]; dataKey: string; color?: string }) {
  return null;
}

export function Line(_props: MarkerProps) {
  return null;
}

// --- Wrapped Chart Components ---

import {
  LineChart as GiftedLineChart,
  BarChart as GiftedBarChart,
} from 'react-native-gifted-charts';

export function AreaChart({
  children,
  curved = false,
  ...props
}: {
  children: React.ReactNode;
  curved?: boolean;
} & any) {
  const { config } = useChart();
  const series = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<MarkerProps> =>
      React.isValidElement(child) && child.type === Area
  );

  const dataSet = series.map((s) => {
    const { dataKey, data, thickness, hideDataPoints, dataPointsColor } = s.props;
    const color = config[dataKey]?.color || '#000';
    return {
      data,
      color,
      thickness: thickness ?? 2,
      hideDataPoints: hideDataPoints ?? false,
      dataPointsColor: dataPointsColor ?? color,
      startFillColor: color,
      endFillColor: color,
      startOpacity: 0.4,
      endOpacity: 0.1,
    };
  });

  return <GiftedLineChart areaChart curved={curved} dataSet={dataSet} {...props} />;
}

export function BarChart({ children, ...props }: { children: React.ReactNode } & any) {
  const { config } = useChart();
  const series = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<MarkerProps> =>
      React.isValidElement(child) && child.type === Bar
  );

  if (series.length === 0) return null;

  // Interleave data for grouped bars
  const data: any[] = [];
  const numItems = series[0].props.data.length;

  for (let i = 0; i < numItems; i++) {
    series.forEach((s, seriesIndex) => {
      const { dataKey, data: seriesData } = s.props;
      const color = config[dataKey]?.color || '#000';
      const item = seriesData[i];
      if (item) {
        data.push({
          ...item,
          // Optimization: Only show the label for the first bar in each group
          // so it appears centered under the group rather than repeated.
          label: seriesIndex === 0 ? item.label : undefined,
          frontColor: color,
        });
      }
    });
  }

  return <GiftedBarChart data={data} {...props} />;
}

export function LineChart({
  children,
  curved = false,
  ...props
}: {
  children: React.ReactNode;
  curved?: boolean;
} & any) {
  const { config } = useChart();
  const series = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<MarkerProps> =>
      React.isValidElement(child) && child.type === Line
  );

  const dataSet = series.map((s) => {
    const { dataKey, data, thickness, hideDataPoints, dataPointsColor } = s.props;
    const color = config[dataKey]?.color || '#000';
    return {
      data,
      color,
      thickness: thickness ?? 2,
      hideDataPoints: hideDataPoints ?? false,
      dataPointsColor: dataPointsColor ?? color,
    };
  });

  return <GiftedLineChart curved={curved} dataSet={dataSet} {...props} />;
}

// --- Utilities ---

export function getChartColor(key: string, config: ChartConfig): string {
  return config[key]?.color || '#000';
}

/**
 * Returns a ready-to-use `pointerConfig` with safe tooltip defaults.
 * Spread overrides on top to customize individual charts.
 */
export function useChartPointerConfig(overrides?: Record<string, any>) {
  const theme = useChartTheme();

  return {
    showPointerStrip: false,
    pointerStripWidth: 2,
    pointerColor: theme.mutedForeground,
    radius: 4,
    pointerLabelWidth: 160,
    pointerLabelHeight: 90,
    activatePointersOnLongPress: false,
    autoAdjustPointerLabelPosition: true,
    shiftPointerLabelX: -30,
    persistPointer: false,
    resetPointerIndexOnRelease: false,
    pointerVanishDelay: 2000,
    pointerLabelComponent: (items: any) => {
      return <ChartTooltip active={true} payload={items} />;
    },
    ...overrides,
  };
}

export function useChartTheme() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return {
    border: isDark ? 'hsl(0 0% 14.9%)' : 'hsl(0 0% 89.8%)',
    input: isDark ? 'hsl(0 0% 14.9%)' : 'hsl(0 0% 89.8%)',
    ring: isDark ? 'hsl(0 0% 83.1%)' : 'hsl(0 0% 3.9%)',
    background: isDark ? 'hsl(0 0% 3.9%)' : 'hsl(0 0% 100%)',
    foreground: isDark ? 'hsl(0 0% 98%)' : 'hsl(0 0% 3.9%)',
    primary: isDark ? 'hsl(0 0% 98%)' : 'hsl(0 0% 9%)',
    secondary: isDark ? 'hsl(0 0% 14.9%)' : 'hsl(0 0% 96.1%)',
    muted: isDark ? 'hsl(0 0% 14.9%)' : 'hsl(0 0% 96.1%)',
    mutedForeground: isDark ? 'hsl(0 0% 63.9%)' : 'hsl(0 0% 45.1%)',
    accent: isDark ? 'hsl(0 0% 14.9%)' : 'hsl(0 0% 96.1%)',
    destructive: isDark ? 'hsl(0 62.8% 30.6%)' : 'hsl(0 84.2% 60.2%)',
  };
}
