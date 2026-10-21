import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { BooksIcon, ChartLineUpIcon, ExamIcon, HouseIcon, UserCircleIcon, type Icon } from 'phosphor-react-native';
import { Pressable, View } from 'react-native';
import { radius, space, useTheme } from '../theme/theme';
import { AkadaIcon } from './AkadaIcon';
import { AkadaText } from './AkadaText';

const TABS: Record<string, { label: string; icon: Icon }> = {
  index: { label: 'Home', icon: HouseIcon },
  practice: { label: 'Practice', icon: BooksIcon },
  mock: { label: 'Mock Test', icon: ExamIcon },
  progress: { label: 'Progress', icon: ChartLineUpIcon },
  profile: { label: 'Profile', icon: UserCircleIcon },
};

/** Home · Practice · Mock Test · Progress · Profile. Active = Fill icon on a tonal indicator. */
export function BottomNav({ state, navigateToTab, insets }: BottomTabBarProps) {
  const { c } = useTheme();
  return (
    <View style={{ flexDirection: 'row', backgroundColor: c.bgSurface, borderTopWidth: 1, borderTopColor: c.borderDefault, paddingTop: space[8], paddingBottom: Math.max(insets.bottom, space[8]) }}>
      {state.routes.map((route, i) => {
        const tab = TABS[route.name];
        if (!tab) return null;
        const active = state.index === i;
        return (
          <Pressable key={route.key} onPress={() => navigateToTab(route.key)} accessibilityRole="tab" accessibilityState={{ selected: active }} accessibilityLabel={tab.label} style={{ flex: 1, alignItems: 'center', gap: space[4], minHeight: 52 }}>
            <View style={{ width: 56, height: 32, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center', backgroundColor: active ? c.primaryContainer : 'transparent' }}>
              <AkadaIcon icon={tab.icon} active={active} color={active ? c.primary : c.textSecondary} />
            </View>
            <AkadaText variant="labelSmall" color={active ? 'textPrimary' : 'textSecondary'}>{tab.label}</AkadaText>
          </Pressable>
        );
      })}
    </View>
  );
}
