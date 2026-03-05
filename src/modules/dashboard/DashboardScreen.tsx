import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
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
import { toast } from '@/components/ui/sonner';
import { Text } from '@/components/ui/text';
import { TimePicker, type TimePickerValue } from '@/components/ui/time-picker';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function DashboardScreen() {
  const router = useRouter();
  const [selectedTime, setSelectedTime] = React.useState<TimePickerValue | null>(null);
  const [isPickerOpen, setIsPickerOpen] = React.useState(false);

  const handleTimeConfirm = (value: TimePickerValue) => {
    setSelectedTime(value);
    const minuteStr = value.minute < 10 ? `0${value.minute}` : value.minute;
    toast.success(`Time set to ${value.hour}:${minuteStr} ${value.period}`);
    setIsPickerOpen(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 items-center justify-center gap-6 px-6 py-12">
          <View className="items-center gap-2">
            <Text className="text-3xl font-bold">Dashboard</Text>
            <Text className="text-center text-base text-muted-foreground">
              Welcome! You&apos;re now signed in.
            </Text>
          </View>

          {selectedTime && (
            <View className="items-center rounded-lg bg-muted/50 px-4 py-2">
              <Text className="text-sm text-muted-foreground">Selected Time</Text>
              <Text className="text-xl font-semibold">
                {selectedTime.hour}:
                {selectedTime.minute < 10 ? `0${selectedTime.minute}` : selectedTime.minute}{' '}
                {selectedTime.period}
              </Text>
            </View>
          )}

          <AlertDialog open={isPickerOpen} onOpenChange={setIsPickerOpen}>
            <AlertDialogTrigger asChild>
              <Button className="w-full max-w-xs">
                <Text>Set Appointment Time</Text>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="w-full max-w-[360px] border-0 bg-transparent  p-0 shadow-none">
              <TimePicker onConfirm={handleTimeConfirm} onCancel={() => setIsPickerOpen(false)} />
            </AlertDialogContent>
          </AlertDialog>

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

          <View className="w-full max-w-xs flex-col gap-2">
            <Button
              variant="outline"
              className="w-full"
              onPress={() => toast.success('Account created successfully!')}>
              <Text>Success Toast</Text>
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onPress={() => toast.info('New message received!')}>
              <Text>Info Toast</Text>
            </Button>
          </View>

          <Button
            variant="ghost"
            className="w-full max-w-xs"
            onPress={() => router.push('/charts')}>
            <Text>View Charts</Text>
          </Button>

          <Button
            variant="ghost"
            className="w-full max-w-xs text-destructive"
            onPress={() => router.replace('/(auth)/sign-in')}>
            <Text className="text-destructive">Sign Out</Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
