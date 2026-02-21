import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hides the default header for a custom look
        animation: 'fade', // Clean transition for auth flows
      }}>
      <Stack.Screen name="sign-in" />
    </Stack>
  );
}
