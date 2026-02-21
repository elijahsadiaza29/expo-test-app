import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import * as React from 'react';
import { toast } from '@/components/ui/sonner';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

export function DashboardScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center gap-6 px-6">
        <View className="items-center gap-2">
          <Text className="text-3xl font-bold">Dashboard</Text>
          <Text className="text-center text-base text-muted-foreground">
            Welcome! You're now signed in.
          </Text>
        </View>

        <Drawer>
          <DrawerTrigger asChild>
            <Button className="w-full max-w-xs">
              <Text>Open Drawer</Text>
            </Button>
          </DrawerTrigger>
          <Button
            variant="outline"
            className="w-full max-w-xs"
            onPress={() => toast.success('Account created successfully!')}>
            <Text>Success Toast</Text>
          </Button>
          <Button
            variant="outline"
            className="w-full max-w-xs"
            onPress={() => toast.info('New message received!')}>
            <Text>Info Toast</Text>
          </Button>
          <Button
            variant="outline"
            className="w-full max-w-xs"
            onPress={() => toast.warning('Your session will expire soon!')}>
            <Text>Warning Toast</Text>
          </Button>
          <Button
            variant="outline"
            className="w-full max-w-xs"
            onPress={() => toast.error('Failed to save changes.')}>
            <Text>Error Toast</Text>
          </Button>
          <Button
            variant="outline"
            className="w-full max-w-xs"
            onPress={() => {
              const promise = new Promise((resolve) => setTimeout(resolve, 2000));
              toast.promise(promise, {
                loading: 'Loading data...',
                success: () => 'Data loaded!',
                error: () => 'Error loading data',
              });
            }}>
            <Text>Promise Toast</Text>
          </Button>

          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Are you absolutely sure?</DrawerTitle>
              <DrawerDescription>
                This action cannot be undone. This will permanently delete your account and remove
                your data from our servers.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button>
                <Text>Submit</Text>
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">
                  <Text>Cancel</Text>
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        <Button
          variant="outline"
          className="w-full max-w-xs"
          onPress={() => router.replace('/(auth)/sign-in')}>
          <Text>Sign Out</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
