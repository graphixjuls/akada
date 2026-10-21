import { router } from 'expo-router';
import { ArrowLeftIcon } from '@/components/icons';
import { View, type ImageSourcePropType } from 'react-native';
import { useLayout } from '../theme/responsive';
import { space } from '../theme/theme';
import { AkadaText } from './AkadaText';
import { IconButton } from './IconButton';
import { Photo, Stack } from './Layout';

/** Back + "Step x of 4", optional photo, then title and one line of help: the top of every set-up step. */
export function SetupHeader({ step, title, body, photo, photoHeight = 120 }: { step?: number; title: string; body: string; photo?: ImageSourcePropType; photoHeight?: number }) {
  // On desktop the photo fills the left half of the screen instead (Screen `aside`).
  const { desktop } = useLayout();
  return (
    <Stack gap={space[16]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space[12] }}>
        <IconButton icon={ArrowLeftIcon} label="Back" onPress={() => router.back()} />
        {step !== undefined && <AkadaText variant="labelMedium" color="textSecondary">Step {step} of 4</AkadaText>}
      </View>
      {photo && !desktop && <Photo source={photo} height={photoHeight} />}
      <Stack>
        <AkadaText variant="h1">{title}</AkadaText>
        <AkadaText variant="bodyLarge" color="textSecondary">{body}</AkadaText>
      </Stack>
    </Stack>
  );
}
