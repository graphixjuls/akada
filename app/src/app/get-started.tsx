import { router } from 'expo-router';
import { UserCircleIcon } from 'phosphor-react-native';
import { useState } from 'react';
import { AkadaText } from '@/components/AkadaText';
import { Button } from '@/components/Button';
import { Photo, Screen, Stack } from '@/components/Layout';
import { TextField } from '@/components/TextField';
import { images } from '@/data/images';
import { useStore } from '@/store/AppStore';

/** No account and no internet needed: the name is only used to greet the student, and stays on the phone. */
export default function GetStarted() {
  const { updateDraft } = useStore();
  const [name, setName] = useState('');
  const ready = name.trim().length > 0;
  const next = () => {
    if (!ready) return;
    updateDraft({ name: name.trim() });
    router.push('/setup/department');
  };
  return (
    <Screen footer={<>
      <Button label="Continue" onPress={next} disabled={!ready} block />
      <AkadaText variant="bodySmall" color="textTertiary" align="center">Everything stays on this phone. No account or data needed.</AkadaText>
    </>}>
      <Photo source={images.signup} height={200} />
      <Stack>
        <AkadaText variant="h1">Let’s get you started</AkadaText>
        <AkadaText variant="bodyLarge" color="textSecondary">What should we call you?</AkadaText>
      </Stack>
      <TextField label="First name" value={name} onChangeText={setName} placeholder="e.g. Chiamaka" icon={UserCircleIcon} maxLength={30} autoFocus />
    </Screen>
  );
}
