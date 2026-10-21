import { Tabs } from 'expo-router/js-tabs';
import { BottomNav } from '@/components/BottomNav';
import { useLayout } from '@/theme/responsive';
import { useTheme } from '@/theme/theme';

export default function TabsLayout() {
  const { c } = useTheme();
  // On tablets and computers the side navigation (in the root layout) replaces the bottom nav.
  const { wide } = useLayout();
  return (
    <Tabs tabBar={props => (wide ? null : <BottomNav {...props} />)} screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: c.bgCanvas } }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="practice" />
      <Tabs.Screen name="mock" />
      <Tabs.Screen name="progress" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
