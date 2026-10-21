import { router } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { AkadaText } from '@/components/AkadaText';
import { LogoMark, Wordmark } from '@/components/Logo';
import { Screen } from '@/components/Layout';
import { space } from '@/theme/theme';

export default function Splash() {
  useEffect(() => {
    const t = setTimeout(() => router.replace('/welcome'), 1200);
    return () => clearTimeout(t);
  }, []);
  return (
    <Screen background="primary" scroll={false}>
      <View style={{ flex: 1, minHeight: 600, alignItems: 'center', justifyContent: 'center', gap: space[16] }}>
        <LogoMark size={104} inverse />
        <Wordmark size={48} onPrimary />
        <AkadaText variant="bodyLarge" color="textOnPrimary">Exam practice that fits your day</AkadaText>
      </View>
      <AkadaText variant="bodySmall" color="textOnPrimary" align="center">Practice questions for SS1 to SS3</AkadaText>
    </Screen>
  );
}
