---
description: How to add the custom Shadcn-style Drawer component using Bottom Sheet
---

# Adding the Custom Drawer Component

This workflow explains how to add the custom Shadcn-style Drawer component to an Expo project that uses NativeWind v4 and Expo Router. This component is built on top of `@gorhom/bottom-sheet` and uses `@rn-primitives` to replicate the `vaul` drawer API from the web.

## 1. Install Dependencies

Install the required bottom sheet, gesture handler, reanimated, and primitives. Note that `@gorhom/bottom-sheet` v5 alpha is required for compatibility with Reanimated v4 (Expo SDK 54+).

```bash
npm install @gorhom/bottom-sheet@^5.0.0-alpha.11 @rn-primitives/slot @rn-primitives/portal react-native-gesture-handler react-native-reanimated --legacy-peer-deps
```

## 2. Configure Babel (Reanimated)

Ensure that `react-native-reanimated/plugin` is added to your `babel.config.js` plugins array. **Do not** use the `react-native-worklets/plugin` as it conflicts with Reanimated v4.

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    plugins: [
      'react-native-reanimated/plugin', // MUST be listed here
    ],
  };
};
```

## 3. Update Root Layout

Wrap your application in `app/_layout.tsx` with the necessary gesture and bottom sheet providers, as well as the PortalHost.

```tsx
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PortalHost } from '@rn-primitives/portal';
// ... other imports

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        {/* Your Stack or Slot components go here */}

        {/* Required for portaled bottom sheets to render correctly */}
        <PortalHost />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
```

## 4. Create the Component

Create `src/components/ui/drawer.tsx` and paste the following code. This provides the full `Drawer`, `DrawerTrigger`, `DrawerContent`, `DrawerHeader`, `DrawerFooter`, `DrawerTitle`, `DrawerDescription`, and `DrawerClose` suite.

**Note:** Ensure your `Button` component (if used with `DrawerTrigger asChild`) is wrapped in `React.forwardRef`!

```tsx
import * as React from 'react';
import { Pressable, View } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  type BottomSheetModalProps,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { useColorScheme } from 'nativewind';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import * as Slot from '@rn-primitives/slot';
import { Portal } from '@rn-primitives/portal';

// 1. Context to track open state and provide the ref
const DrawerContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}>({
  open: false,
  setOpen: () => {},
  openDrawer: () => {},
  closeDrawer: () => {},
});

export function Drawer({
  children,
  open: controlledOpen,
  onOpenChange,
}: {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = React.useCallback(
    (value: boolean) => {
      setUncontrolledOpen(value);
      onOpenChange?.(value);
    },
    [onOpenChange]
  );

  const openDrawer = React.useCallback(() => setOpen(true), [setOpen]);
  const closeDrawer = React.useCallback(() => setOpen(false), [setOpen]);

  return (
    <DrawerContext.Provider value={{ open, setOpen, openDrawer, closeDrawer }}>
      {children}
    </DrawerContext.Provider>
  );
}

// 2. Trigger
export const DrawerTrigger = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  React.ComponentPropsWithoutRef<typeof Pressable> & { asChild?: boolean }
>(({ asChild, onPress, ...props }, ref) => {
  const { openDrawer } = React.useContext(DrawerContext);

  const handlePress = (e: any) => {
    openDrawer();
    onPress?.(e);
  };

  if (asChild) {
    return <Slot.Pressable ref={ref} onPress={handlePress} {...props} />;
  }

  return <Pressable ref={ref} onPress={handlePress} {...props} />;
});
DrawerTrigger.displayName = 'DrawerTrigger';

// 3. Content (The actual Bottom Sheet)
export const DrawerContent = React.forwardRef<
  React.ElementRef<typeof BottomSheetModal>,
  Omit<BottomSheetModalProps, 'ref' | 'snapPoints'> & {
    children: React.ReactNode;
    snapPoints?: string[] | number[];
  }
>(({ children, snapPoints, backgroundStyle, handleIndicatorStyle, ...props }, ref) => {
  const { open, closeDrawer } = React.useContext(DrawerContext);
  const internalRef = React.useRef<BottomSheetModal>(null);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const defaultSnapPoints = React.useMemo(() => ['50%'], []);
  const memoizedSnapPoints = React.useMemo(
    () => snapPoints || defaultSnapPoints,
    [snapPoints, defaultSnapPoints]
  );

  // Sync state -> modal
  React.useEffect(() => {
    if (open) {
      internalRef.current?.present();
    } else {
      internalRef.current?.dismiss();
    }
  }, [open]);

  // Sync modal -> state (when dismissed via gesture)
  const handleDismiss = React.useCallback(() => {
    closeDrawer();
  }, [closeDrawer]);

  const renderBackdrop = React.useCallback(
    (backdropProps: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...backdropProps} disappearsOnIndex={-1} appearsOnIndex={0} />
    ),
    []
  );

  return (
    <Portal name="bottom-sheet">
      <BottomSheetModal
        ref={(node) => {
          // Handle both forwarded ref and internal ref
          internalRef.current = node as any;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as any).current = node;
        }}
        index={0}
        snapPoints={memoizedSnapPoints}
        enableDynamicSizing={false}
        onDismiss={handleDismiss}
        backdropComponent={renderBackdrop}
        backgroundStyle={[
          {
            backgroundColor: isDark ? 'hsl(240 10% 3.9%)' : 'hsl(0 0% 100%)', // matching bg-background
          },
          backgroundStyle,
        ]}
        handleIndicatorStyle={[
          {
            backgroundColor: isDark ? 'hsl(240 3.7% 15.9%)' : 'hsl(240 5.9% 90%)', // matching bg-muted
            width: 50,
          },
          handleIndicatorStyle,
        ]}
        keyboardBlurBehavior="restore"
        {...props}>
        <View className={cn('bg-background flex-1', isDark ? 'dark' : '')}>{children}</View>
      </BottomSheetModal>
    </Portal>
  );
});
DrawerContent.displayName = 'DrawerContent';

// 4. Header
export function DrawerHeader({ className, ...props }: React.ComponentPropsWithoutRef<typeof View>) {
  return <View className={cn('gap-1.5 p-4 text-center sm:text-left', className)} {...props} />;
}
DrawerHeader.displayName = 'DrawerHeader';

// 5. Footer
export function DrawerFooter({ className, ...props }: React.ComponentPropsWithoutRef<typeof View>) {
  return <View className={cn('mt-auto gap-2 p-4', className)} {...props} />;
}
DrawerFooter.displayName = 'DrawerFooter';

// 6. Title
export const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof Text>,
  React.ComponentPropsWithoutRef<typeof Text>
>(({ className, ...props }, ref) => (
  <Text
    ref={ref}
    className={cn('text-foreground text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));
DrawerTitle.displayName = 'DrawerTitle';

// 7. Description
export const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof Text>,
  React.ComponentPropsWithoutRef<typeof Text>
>(({ className, ...props }, ref) => (
  <Text ref={ref} className={cn('text-muted-foreground text-sm', className)} {...props} />
));
DrawerDescription.displayName = 'DrawerDescription';

// 8. Close Trigger
export const DrawerClose = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  React.ComponentPropsWithoutRef<typeof Pressable> & { asChild?: boolean }
>(({ asChild, onPress, ...props }, ref) => {
  const { closeDrawer } = React.useContext(DrawerContext);

  const handlePress = (e: any) => {
    closeDrawer();
    onPress?.(e);
  };

  if (asChild) {
    return <Slot.Pressable ref={ref} onPress={handlePress} {...props} />;
  }

  return <Pressable ref={ref} onPress={handlePress} {...props} />;
});
DrawerClose.displayName = 'DrawerClose';
```

## 5. Usage Example

You can now use the component just like the shadcn web drawer.

```tsx
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
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

export function Demo() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>
          <Text>Open Drawer</Text>
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
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
  );
}
```
