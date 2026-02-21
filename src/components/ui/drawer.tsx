import * as React from 'react';
import { Platform, Pressable, View } from 'react-native';
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
    console.log('[DrawerTrigger] Tapped! Opening drawer...');
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
>(({ children, snapPoints, ...props }, ref) => {
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
    console.log(
      '[DrawerContent] open state changed:',
      open,
      'modal ref exists:',
      !!internalRef.current
    );
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
        {...(Platform.OS === 'web'
          ? {
              backgroundComponent: ({ style }: any) => (
                <View
                  style={style}
                  className="rounded-t-[10px] border-t border-border bg-background shadow-lg"
                />
              ),
              handleComponent: () => (
                <View className="h-8 w-full items-center justify-center rounded-t-[10px]">
                  <View className="mt-2 h-1.5 w-12 rounded-full bg-muted-foreground/30" />
                </View>
              ),
            }
          : {
              backgroundStyle: [
                {
                  backgroundColor: isDark ? 'hsl(240 10% 3.9%)' : 'hsl(0 0% 100%)', // matching bg-background
                },
                props.backgroundStyle,
              ],
              handleIndicatorStyle: [
                {
                  backgroundColor: isDark ? 'hsl(240 3.7% 15.9%)' : 'hsl(240 5.9% 90%)', // matching bg-muted
                  width: 50,
                },
                props.handleIndicatorStyle,
              ],
            })}
        keyboardBlurBehavior="restore"
        {...props}>
        <View className={cn('flex-1 bg-background', isDark ? 'dark' : '')}>{children}</View>
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
    className={cn('text-lg font-semibold leading-none tracking-tight text-foreground', className)}
    {...props}
  />
));
DrawerTitle.displayName = 'DrawerTitle';

// 7. Description
export const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof Text>,
  React.ComponentPropsWithoutRef<typeof Text>
>(({ className, ...props }, ref) => (
  <Text ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
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
