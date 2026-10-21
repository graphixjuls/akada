import { DownloadSimpleIcon, XIcon } from '@/components/icons';
import { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import { useStore } from '../store/AppStore';
import { radius, space, useTheme } from '../theme/theme';
import { AkadaIcon } from './AkadaIcon';
import { AkadaText } from './AkadaText';
import { Button } from './Button';
import { IconButton } from './IconButton';

/** The browser's install prompt (Chrome, Edge and Android). Not in the TypeScript DOM types yet. */
interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}

type Mode = 'hidden' | 'ios' | 'prompt';

function isInstalled() {
  return window.matchMedia?.('(display-mode: standalone)').matches || !!(navigator as Navigator & { standalone?: boolean }).standalone;
}

function initialMode(): Mode {
  if (Platform.OS !== 'web' || typeof window === 'undefined' || isInstalled()) return 'hidden';
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  return ios ? 'ios' : 'hidden';
}

/** Web only: suggests adding Akada to the home screen so it opens like an app and works offline. */
export function InstallHint() {
  const { data, update } = useStore();
  const { c } = useTheme();
  // iPhones and iPads have no install prompt; Safari's Share menu has "Add to Home Screen".
  const [mode, setMode] = useState<Mode>(initialMode);
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(null);

  useEffect(() => {
    if (mode !== 'hidden' || Platform.OS !== 'web' || typeof window === 'undefined' || isInstalled()) return;
    const onPrompt = (e: Event) => { e.preventDefault(); setPromptEvent(e as InstallPromptEvent); setMode('prompt'); };
    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, [mode]);

  if (mode === 'hidden' || data.settings.installHintDismissed) return null;
  const dismiss = () => update(d => ({ ...d, settings: { ...d.settings, installHintDismissed: true } }));

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: space[12], padding: space[12], borderRadius: radius.lg, backgroundColor: c.primaryContainer }}>
      <AkadaIcon icon={DownloadSimpleIcon} color={c.primary} />
      <View style={{ flex: 1, gap: space[8] }}>
        <AkadaText variant="labelLarge">Install Akada on this phone</AkadaText>
        <AkadaText variant="bodyMedium">
          {mode === 'ios'
            ? 'Tap the Share button in Safari, then “Add to Home Screen”. Akada will open like an app and work offline.'
            : 'Add Akada to your home screen. It opens like an app and works offline.'}
        </AkadaText>
        {mode === 'prompt' && promptEvent && (
          <View style={{ alignSelf: 'flex-start' }}>
            <Button label="Install" size="small" onPress={() => { promptEvent.prompt().finally(dismiss); }} />
          </View>
        )}
      </View>
      <IconButton icon={XIcon} label="Dismiss install tip" onPress={dismiss} />
    </View>
  );
}
