import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useColorScheme as useNativeWindColorScheme, StyleSheet } from 'nativewind';
import { StatusBar } from 'expo-status-bar';
import * as Device from 'expo-device';
import 'react-native-reanimated';
import './global.css';
import { AuthProvider } from '../context/auth-context';
import { useColorScheme } from '@/components/useColorScheme';
import { registerForPushNotificationsAsync } from '../lib/notificationService';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

let ScreenOrientation: any;
try {
  ScreenOrientation = require('expo-screen-orientation');
} catch (e) {
  ScreenOrientation = null;
}

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { colorScheme: nwColorScheme, setColorScheme: setNwColorScheme } = useNativeWindColorScheme();

  useEffect(() => {
    async function handleTabletOrientation() {
      if (!ScreenOrientation || !ScreenOrientation.lockAsync) return;
      try {
        const deviceType = await Device.getDeviceTypeAsync();
        if (deviceType === Device.DeviceType.TABLET) {
          await ScreenOrientation.unlockAsync();
        } else {
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
        }
      } catch (err) {
        // Orientation lock not supported on this platform
      }
    }
    handleTabletOrientation();
  }, []);

  useEffect(() => {
    if (nwColorScheme === 'dark') {
      setNwColorScheme('light');
    }
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <StatusBar hidden />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="budget-main" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: true }} />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}
