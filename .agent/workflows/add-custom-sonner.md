---
description: How to add the custom Shadcn-style Sonner (Toast) component using sonner-native
---

# Adding the Custom Sonner Component

This workflow explains how to add the custom Shadcn-style Sonner (Toast) component to an Expo project. This component provides elegant, cross-platform notifications that match the Shadcn UI aesthetic with custom icons and styling.

## 1. Install Dependencies

Install `sonner-native` and its required peer dependencies, including `lucide-react-native` for icons.

```bash
npx expo install sonner-native react-native-svg react-native-reanimated react-native-gesture-handler lucide-react-native
```

## 2. Resolve Module Resolution Issues

### Fix A: Lucide Resolution (Package Patch)

Metro often struggles with ESM resolution and `.js` extensions in libraries on certain environments. To fix this for `lucide-react-native`, you must patch its `package.json` to use the CJS build:

1. Open `node_modules/lucide-react-native/package.json`.
2. Find the `"react-native"` field.
3. Change it from `"dist/esm/lucide-react-native.js"` to `"dist/cjs/lucide-react-native.js"`.

### Fix B: sonner-native internal patches

You must remove the `.js` extension from internal imports in these files within `node_modules/sonner-native/lib/module/`:

- `animations.js`
- `toast.js`
- `toaster.js`

## 3. Create the Component

Create `src/components/ui/sonner.tsx` and paste the following code.

**Note on Styling**: In React Native, `className` is not supported on third-party components like `SonnerToaster` by default. Use the `toastOptions` prop to apply theme-aware styling and platform-specific widths.

```tsx
import * as React from 'react';
import { Toaster as SonnerToaster, toast } from 'sonner-native';
import { useColorScheme } from 'nativewind';
import { Platform } from 'react-native';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, Loader2 } from 'lucide-react-native';

type ToasterProps = React.ComponentPropsWithoutRef<typeof SonnerToaster>;

function Toaster({ ...props }: ToasterProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <SonnerToaster
      theme={colorScheme as 'light' | 'dark'}
      richColors
      closeButton
      icons={{
        success: <CheckCircle2 size={20} color="hsl(142.1 76.2% 36.3%)" />,
        error: <AlertCircle size={20} color="hsl(346.8 77.2% 49.8%)" />,
        warning: <AlertTriangle size={20} color="hsl(47.9 95.8% 53.1%)" />,
        info: <Info size={20} color="hsl(221.2 83.2% 53.3%)" />,
        loading: <Loader2 size={20} color={isDark ? 'hsl(0 0% 98%)' : 'hsl(240 5.9% 10%)'} />,
      }}
      toastOptions={{
        style: {
          backgroundColor: isDark ? 'hsl(240 10% 3.9%)' : 'hsl(0 0% 100%)',
          borderColor: isDark ? 'hsl(240 3.7% 15.9%)' : 'hsl(240 5.9% 90%)',
          width: Platform.select({ web: 448, default: 300 }), // 448px matches max-w-md
          maxWidth: '100%',
        },
        titleStyle: {
          color: isDark ? 'hsl(0 0% 98%)' : 'hsl(240 10% 3.9%)',
        },
        descriptionStyle: {
          color: isDark ? 'hsl(240 5% 64.9%)' : 'hsl(240 3.8% 46.1%)',
        },
        success: {
          backgroundColor: isDark ? 'hsl(142.1 70.6% 4.5%)' : 'hsl(143 85% 96%)',
          borderColor: isDark ? 'hsl(142.1 70.6% 15%)' : 'hsl(142 76% 36% / 0.1)',
        },
        error: {
          backgroundColor: isDark ? 'hsl(346.8 77.2% 4.9%)' : 'hsl(0 100% 97%)',
          borderColor: isDark ? 'hsl(346.8 77.2% 15%)' : 'hsl(346 77% 49% / 0.1)',
        },
      }}
      {...props}
    />
  );
}

export { Toaster, toast };
```

## 4. Update Root Layout

Add the `<Toaster />` component to your root `app/_layout.tsx`.

```tsx
import { Toaster } from '@/components/ui/sonner';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack />
      <Toaster />
    </GestureHandlerRootView>
  );
}
```
