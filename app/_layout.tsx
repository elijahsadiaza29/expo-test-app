import '@/styles/global.css';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PortalHost } from '@rn-primitives/portal';
import { Toaster } from '@/components/ui/sonner';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { View, Platform } from 'react-native';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Explicitly apply the dark class to the HTML element on web
  // This is required for NativeWind CSS variables to work properly on the web
  React.useEffect(() => {
    if (Platform.OS === 'web') {
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDark]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <BottomSheetModalProvider>
          <View className={`flex-1 bg-white dark:bg-black ${isDark ? 'dark' : ''}`}>
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'fade',
              }}>
              {/* The (auth) group contains our sign-in page */}
              <Stack.Screen name="(auth)" />

              {/* The (authenticated) group will contain our main app */}
              <Stack.Screen name="(authenticated)" />
            </Stack>
          </View>

          {/* Required for RNR Modals/Dialogs */}
          <PortalHost />
        </BottomSheetModalProvider>
        <Toaster />
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
