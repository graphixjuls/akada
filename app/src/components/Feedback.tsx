import { CheckCircleIcon, InfoIcon, WarningCircleIcon, WifiSlashIcon } from '@/components/icons';
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { Modal, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { radius, shadow, space, useTheme } from '../theme/theme';
import { AkadaIcon } from './AkadaIcon';
import { AkadaText } from './AkadaText';
import { Button } from './Button';
import { Emoji, type EmojiName } from './Emoji';

/** Centered confirmation on a bg/scrim overlay. One Primary + one Ghost. */
export function Dialog({ visible, title, body, primaryLabel, onPrimary, secondaryLabel, onSecondary }: { visible: boolean; title: string; body: string; primaryLabel: string; onPrimary: () => void; secondaryLabel: string; onSecondary: () => void }) {
  const { c } = useTheme();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onSecondary} statusBarTranslucent>
      <View style={{ flex: 1, backgroundColor: c.bgScrim, justifyContent: 'center', paddingHorizontal: space[20] }}>
        <View accessibilityRole="alert" style={[{ width: '100%', maxWidth: 440, alignSelf: 'center', backgroundColor: c.bgSurface, borderRadius: radius.xl, padding: space[24], gap: space[16] }, shadow.floating]}>
          <View style={{ gap: space[8] }}>
            <AkadaText variant="h2">{title}</AkadaText>
            <AkadaText variant="bodyMedium" color="textSecondary">{body}</AkadaText>
          </View>
          <View style={{ gap: space[8] }}>
            <Button label={primaryLabel} onPress={onPrimary} block />
            <Button label={secondaryLabel} onPress={onSecondary} variant="ghost" block />
          </View>
        </View>
      </View>
    </Modal>
  );
}

type ToastType = 'success' | 'error' | 'info';
const ToastCtx = createContext<(message: string, type?: ToastType) => void>(() => {});

/** Toast above the bottom actions, auto-dismiss ~3 s. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const show = useCallback((message: string, type: ToastType = 'info') => {
    if (timer.current) clearTimeout(timer.current);
    setToast({ message, type });
    timer.current = setTimeout(() => setToast(null), 3000);
  }, []);
  const look = toast && {
    success: { bg: c.successContainer, fg: c.success, icon: CheckCircleIcon },
    error: { bg: c.errorContainer, fg: c.error, icon: WarningCircleIcon },
    info: { bg: c.primaryContainer, fg: c.primary, icon: InfoIcon },
  }[toast.type];
  return (
    <ToastCtx.Provider value={show}>
      {children}
      {toast && look && (
        <View pointerEvents="none" accessibilityLiveRegion="polite" style={[{ position: 'absolute', left: space[20], right: space[20], maxWidth: 480, marginHorizontal: 'auto', bottom: insets.bottom + 140, flexDirection: 'row', alignItems: 'center', gap: space[12], padding: space[12], borderRadius: radius.lg, backgroundColor: look.bg }, shadow.floating]}>
          <AkadaIcon icon={look.icon} color={look.fg} />
          <AkadaText variant="labelMedium" style={{ flex: 1 }}>{toast.message}</AkadaText>
        </View>
      )}
    </ToastCtx.Provider>
  );
}
export const useToast = () => useContext(ToastCtx);

/** Inline warning banner (offline etc.). */
export function Banner({ title, body }: { title?: string; body: string }) {
  const { c } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: space[12], padding: space[12], borderRadius: radius.lg, backgroundColor: c.warningContainer }}>
      <AkadaIcon icon={WifiSlashIcon} color={c.warning} />
      <View style={{ flex: 1, gap: space[4] }}>
        {title && <AkadaText variant="labelLarge">{title}</AkadaText>}
        <AkadaText variant="bodyMedium">{body}</AkadaText>
      </View>
    </View>
  );
}

/** Empty state: emoji, title, one sentence, optional action. */
export function EmptyState({ emoji, title, body, action }: { emoji: EmojiName; title: string; body: string; action?: ReactNode }) {
  return (
    <View style={{ alignItems: 'center', gap: space[8], paddingVertical: space[32] }}>
      <Emoji name={emoji} size={72} />
      <AkadaText variant="h2" align="center">{title}</AkadaText>
      <AkadaText variant="bodyMedium" color="textSecondary" align="center">{body}</AkadaText>
      {action && <View style={{ alignSelf: 'center', marginTop: space[8] }}>{action}</View>}
    </View>
  );
}
