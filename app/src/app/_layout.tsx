import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from '@/components/Feedback';
import { AppStoreProvider, useStore } from '@/store/AppStore';
import { useTheme } from '@/theme/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({ PlusJakartaSans_700Bold, PlusJakartaSans_600SemiBold, Inter_400Regular, Inter_500Medium, Inter_600SemiBold });
  return (
    <SafeAreaProvider>
      <AppStoreProvider>
        <Gate fontsReady={loaded || !!error} />
      </AppStoreProvider>
    </SafeAreaProvider>
  );
}

function Gate({ fontsReady }: { fontsReady: boolean }) {
  const { hydrated } = useStore();
  const { c } = useTheme();
  const ready = fontsReady && hydrated;
  useEffect(() => { if (ready) SplashScreen.hideAsync(); }, [ready]);
  if (!ready) return null;
  return (
    <ToastProvider>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.bgCanvas }, animation: 'slide_from_right' }}>
        <Stack.Screen name="splash" options={{ animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        <Stack.Screen name="exam/index" options={{ gestureEnabled: false }} />
      </Stack>
    </ToastProvider>
  );
}
