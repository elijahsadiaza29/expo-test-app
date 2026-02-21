---
description: How to set up a new Expo project with Expo Router, NativeWind, and React Native Reusables
---

# New Expo Project Setup (Expo Router + NativeWind + RNR)

## 1. Create the project

// turbo

```sh
npx create-expo-app@latest ./
```

## 2. Install Expo Router and all peer dependencies

// turbo

```sh
npx expo install expo-router expo-linking expo-constants react-native-screens react-native-gesture-handler react-native-safe-area-context
```

## 3. Set entry point in `package.json`

Change the `main` field:

```json
"main": "expo-router/entry"
```

## 4. Add `expo-router` plugin to `app.json`

```json
{
  "expo": {
    "plugins": ["expo-router"],
    "experiments": {
      "tsconfigPaths": true
    }
  }
}
```

## 5. Configure `tsconfig.json`

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "skipLibCheck": true
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts"]
}
```

## 6. Install NativeWind and Tailwind CSS

// turbo

```sh
npx expo install nativewind react-native-reanimated
npm install -D tailwindcss@^3.4.0 tailwindcss-animate
```

## 7. Configure Tailwind (`tailwind.config.js`)

> **IMPORTANT**: Include ALL directories that contain components from the start.

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './src/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
};
```

## 8. Create `global.css` (at `src/styles/global.css`)

> **IMPORTANT**: Add ALL CSS variables for the theme BEFORE adding any UI components.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
    --primary: 240 5.9% 10%;
    --primary-foreground: 0 0% 98%;
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 240 5.9% 10%;
    --radius: 0.5rem;
  }

  .dark:root {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 72% 51%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 240 4.9% 83.9%;
  }
}
```

## 9. Configure Babel (`babel.config.js`)

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    plugins: [],
  };
};
```

## 10. Configure Metro (`metro.config.js`)

```js
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './src/styles/global.css' });
```

## 11. Create root layout (`app/_layout.tsx`)

```tsx
import '@/styles/global.css';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PortalHost } from '@rn-primitives/portal';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }} />
      <PortalHost />
    </SafeAreaProvider>
  );
}
```

## 12. Install RNR primitives (as needed)

// turbo

```sh
npx expo install @rn-primitives/portal @rn-primitives/slot @rn-primitives/label @rn-primitives/separator
npm install class-variance-authority clsx tailwind-merge
```

## 13. Create utility file (`src/lib/utils.ts`)

```ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## 14. First run

// turbo

```sh
npx expo start --clear
```

---

## Common Pitfalls to Avoid

| Pitfall                                 | Solution                                                     |
| --------------------------------------- | ------------------------------------------------------------ |
| CSS not working on components           | Ensure ALL directories are in `tailwind.config.js` `content` |
| Unstyled shadcn/RNR components          | Add CSS variables to `global.css` BEFORE adding components   |
| `expo-router` TS errors                 | Use `skipLibCheck: true` and `"main": "expo-router/entry"`   |
| Missing module errors                   | Install ALL expo-router peer deps at once (step 2)           |
| `sm:` breakpoints not working on mobile | Most phones are < 640px; use base classes for mobile layouts |