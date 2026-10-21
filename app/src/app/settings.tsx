import { router } from 'expo-router';
import { ArrowLeftIcon } from '@/components/icons';
import { AkadaText } from '@/components/AkadaText';
import { Chip } from '@/components/Chips';
import { IconButton } from '@/components/IconButton';
import { Row, Screen, Stack } from '@/components/Layout';
import { useStore, type ThemeSetting } from '@/store/AppStore';
import { space } from '@/theme/theme';

export default function Settings() {
  const { data, setTheme } = useStore();
  const themes: [ThemeSetting, string][] = [['system', 'System'], ['light', 'Light'], ['dark', 'Dark']];
  return (
    <Screen>
      <Row><IconButton icon={ArrowLeftIcon} label="Back" onPress={() => router.back()} /><AkadaText variant="h2">Settings</AkadaText></Row>
      <Stack gap={space[12]}>
        <AkadaText variant="labelMedium">Theme</AkadaText>
        <Row gap={space[8]}>{themes.map(([v, l]) => <Chip key={v} label={l} selected={data.settings.theme === v} onPress={() => setTheme(v)} grow />)}</Row>
        <AkadaText variant="bodySmall" color="textSecondary">System follows your device’s setting.</AkadaText>
      </Stack>
    </Screen>
  );
}
