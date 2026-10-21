import { router, usePathname } from 'expo-router';
import { Pressable, View } from 'react-native';
import { localDate, useStore } from '../store/AppStore';
import { streak } from '../logic/progress';
import { radius, space, useTheme } from '../theme/theme';
import { AkadaIcon } from './AkadaIcon';
import { AkadaText } from './AkadaText';
import { TABS } from './BottomNav';
import { Emoji } from './Emoji';
import { ProgressBar } from './Progress';

/** Which tab a path belongs to, so pages outside the tabs (Topics, Settings…) keep their section highlighted. */
export function tabForPath(path: string): string | null {
  if (path === '/' || path === '') return 'index';
  if (path.startsWith('/practice')) return 'practice';
  if (path.startsWith('/mock') || path.startsWith('/exam') || path.startsWith('/review')) return 'mock';
  if (path.startsWith('/progress')) return 'progress';
  if (['/profile', '/settings', '/downloads', '/bookmarks', '/notifications'].some(p => path.startsWith(p))) return 'profile';
  return null;
}

const HREF = { index: '/', practice: '/practice', mock: '/mock', progress: '/progress', profile: '/profile' } as const;

function Mark() {
  const { c } = useTheme();
  return (
    <View style={{ width: 40, height: 40, borderRadius: radius.md, backgroundColor: c.primary, alignItems: 'center', justifyContent: 'center' }}>
      <AkadaText variant="h2" color="textOnPrimary">A</AkadaText>
    </View>
  );
}

/**
 * Web and tablet navigation, replacing the bottom nav on wide screens.
 * `rail` (tablet): 88 px, icon over label like the mobile tabs. Otherwise (desktop): 264 px sidebar with a streak card.
 */
export function SideNav({ rail }: { rail?: boolean }) {
  const { c } = useTheme();
  const { data } = useStore();
  const active = tabForPath(usePathname());
  const today = localDate();
  const days = streak(data.practiceDays, today);
  const minutes = data.today.date === today ? data.today.minutes : 0;
  const goal = data.profile?.dailyGoalMin ?? 30;

  return (
    <View
      accessibilityRole="tablist"
      style={{ width: rail ? 88 : 264, backgroundColor: c.bgSurface, borderRightWidth: 1, borderRightColor: c.borderDefault, paddingVertical: space[24], paddingHorizontal: rail ? space[8] : space[16], gap: rail ? space[12] : space[8], alignItems: rail ? 'center' : 'stretch' }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space[12], paddingLeft: rail ? 0 : space[16], paddingBottom: space[24] }}>
        <Mark />
        {!rail && <AkadaText variant="h2">Akada</AkadaText>}
      </View>
      {(Object.keys(TABS) as (keyof typeof TABS)[]).map(key => {
        const tab = TABS[key];
        const on = active === key;
        return (
          <Pressable
            key={key}
            onPress={() => router.navigate(HREF[key])}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            accessibilityLabel={tab.label}
            style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => (rail
              ? { alignItems: 'center', gap: space[4], minHeight: 52, width: 72, opacity: pressed ? 0.85 : 1 }
              : { flexDirection: 'row', alignItems: 'center', gap: space[12], height: 48, paddingHorizontal: space[16], borderRadius: radius.md, backgroundColor: on ? c.primaryContainer : hovered ? c.bgSunken : 'transparent', opacity: pressed ? 0.85 : 1 })}
          >
            {rail ? (
              <>
                <View style={{ width: 56, height: 32, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center', backgroundColor: on ? c.primaryContainer : 'transparent' }}>
                  <AkadaIcon icon={tab.icon} active={on} color={on ? c.primary : c.textSecondary} />
                </View>
                <AkadaText variant="labelSmall" color={on ? 'textPrimary' : 'textSecondary'}>{tab.label}</AkadaText>
              </>
            ) : (
              <>
                <AkadaIcon icon={tab.icon} active={on} color={on ? c.primary : c.textSecondary} />
                <AkadaText variant="labelLarge" style={{ color: on ? c.primaryOnContainer : c.textSecondary }}>{tab.label}</AkadaText>
              </>
            )}
          </Pressable>
        );
      })}
      {!rail && (
        <>
          <View style={{ flex: 1 }} />
          <View style={{ backgroundColor: c.warningContainer, borderRadius: radius.lg, padding: space[16], gap: space[8] }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: space[8] }}>
              <Emoji name="fire" size={24} />
              <AkadaText variant="labelLarge">{days ? `${days}-day streak` : 'Start your streak'}</AkadaText>
            </View>
            <AkadaText variant="bodySmall" color="textSecondary">Today: {Math.min(minutes, goal)} / {goal} min</AkadaText>
            <ProgressBar value={minutes / goal} />
          </View>
        </>
      )}
    </View>
  );
}
