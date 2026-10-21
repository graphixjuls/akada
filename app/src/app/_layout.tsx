// Import each weight on its own: the package roots pull in every weight and style (about 9 MB of fonts).
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { PlusJakartaSans_600SemiBold } from '@expo-google-fonts/plus-jakarta-sans/600SemiBold';
import { PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans/700Bold';
import { useFonts } from 'expo-font';
import { router, Stack, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from '@/components/Feedback';
import { SideNav } from '@/components/SideNav';
import { AppStoreProvider, useStore } from '@/store/AppStore';
import { useLayout } from '@/theme/responsive';
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
  const { hydrated, data } = useStore();
  const { c } = useTheme();
  const { size } = useLayout();
  const path = usePathname();
  const ready = fontsReady && hydrated;
  useEffect(() => { if (ready) SplashScreen.hideAsync(); }, [ready]);
  // No profile yet and outside onboarding (for example a shared link): start at the Splash.
  // The screens below are protected, so nothing that needs a profile renders in the meantime.
  const inOnboarding = ['/splash', '/welcome', '/get-started'].includes(path) || path.startsWith('/setup');
  useEffect(() => { if (ready && !data.profile && !inOnboarding) router.replace('/splash'); }, [ready, data.profile, inOnboarding]);
  if (!ready) return null;
  const stack = (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.bgCanvas }, animation: 'slide_from_right' }}>
      <Stack.Screen name="splash" options={{ animation: 'fade' }} />
      {/* Screens that need a profile. Opening one by link before setup (common on the web) goes to the Splash instead of crashing. */}
      <Stack.Protected guard={!!data.profile}>
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        <Stack.Screen name="exam/index" options={{ gestureEnabled: false }} />
        <Stack.Screen name="exam/results" />
        <Stack.Screen name="practice/[subject]" />
        <Stack.Screen name="practice/session" />
        <Stack.Screen name="practice/summary" />
        <Stack.Screen name="review" />
        <Stack.Screen name="bookmarks" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="help" />
        <Stack.Screen name="about" />
      </Stack.Protected>
    </Stack>
  );
  // Tablets and computers get side navigation, except during onboarding and in focus mode
  // (a practice session or a running mock test), which keep the whole screen for the task.
  const onboarding = !data.profile || inOnboarding;
  const focus = path.startsWith('/practice/session') || path === '/exam';
  const nav = size !== 'phone' && !onboarding && !focus;
  return (
    <ToastProvider>
      <View style={{ flex: 1, flexDirection: 'row', backgroundColor: c.bgCanvas }}>
        {nav && <SideNav rail={size === 'tablet'} />}
        <View style={{ flex: 1 }}>{stack}</View>
      </View>
    </ToastProvider>
  );
}
