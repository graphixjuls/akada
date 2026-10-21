import { Tabs } from 'expo-router/js-tabs';
import { BottomNav } from '@/components/BottomNav';
import { useTheme } from '@/theme/theme';

export default function TabsLayout() {
  const { c } = useTheme();
  return (
    <Tabs tabBar={props => <BottomNav {...props} />} screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: c.bgCanvas } }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="practice" />
      <Tabs.Screen name="mock" />
      <Tabs.Screen name="progress" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
