// Import each weight on its own: the package roots pull in every weight and style (about 9 MB of fonts).
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { PlusJakartaSans_600SemiBold } from '@expo-google-fonts/plus-jakarta-sans/600SemiBold';
import { PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans/700Bold';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Platform, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from '@/components/Feedback';
import { AppStoreProvider, useStore } from '@/store/AppStore';
import { useTheme } from '@/theme/theme';

SplashScreen.preventAutoHideAsync();

/** Width of the app column on the web (a large phone). */
const WEB_MAX_WIDTH = 480;

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
  const stack = (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.bgCanvas }, animation: 'slide_from_right' }}>
      <Stack.Screen name="splash" options={{ animation: 'fade' }} />
      <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
      <Stack.Screen name="exam/index" options={{ gestureEnabled: false }} />
    </Stack>
  );
  return (
    <ToastProvider>
      {Platform.OS === 'web' ? (
        // On tablets and computers the app stays a phone-width column in the middle of the screen.
        <View style={{ flex: 1, backgroundColor: c.bgSunken }}>
          <View style={{ flex: 1, width: '100%', maxWidth: WEB_MAX_WIDTH, alignSelf: 'center', backgroundColor: c.bgCanvas, borderLeftWidth: 1, borderRightWidth: 1, borderColor: c.borderDefault }}>{stack}</View>
        </View>
      ) : stack}
    </ToastProvider>
  );
}
