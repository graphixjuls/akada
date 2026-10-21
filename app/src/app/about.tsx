import Constants from 'expo-constants';
import { router } from 'expo-router';
import { Linking, View } from 'react-native';
import { ArrowLeftIcon, BookOpenTextIcon, GithubLogoIcon, GraduationCapIcon, ShieldCheckIcon, WifiSlashIcon, type Icon } from '@/components/icons';
import { AkadaIcon } from '@/components/AkadaIcon';
import { AkadaText } from '@/components/AkadaText';
import { Card, Columns, ListCard, Row, Screen, Stack } from '@/components/Layout';
import { IconButton } from '@/components/IconButton';
import { ListRow } from '@/components/ListRow';
import { bank } from '@/data/bank';
import { subjects } from '@/data/catalog';
import { THIS_DEVICE } from '@/theme/responsive';
import { radius, space, useTheme } from '@/theme/theme';

const APP_VERSION = Constants.expoConfig?.version ?? '1.0.0';
const REPO_URL = 'https://github.com/graphixjuls/akada';

export default function About() {
  const { c } = useTheme();
  const topics = new Set(bank.questions.map(q => q.topicId)).size;
  const facts: [Icon, string, string][] = [
    [BookOpenTextIcon, `${bank.questions.length.toLocaleString()} practice questions`, `${subjects.length} subjects and ${topics} topics, each question with an explanation`],
    [GraduationCapIcon, 'For SS1 to SS3', 'Every topic is labelled by class, so you can practise what you’re learning now'],
    [WifiSlashIcon, 'Works offline', 'All the questions are inside the app. No data needed after you install it'],
    [ShieldCheckIcon, 'Private', `No account. Your name and progress stay on ${THIS_DEVICE}, and Akada sends nothing anywhere`],
  ];
  return (
    <Screen>
      <Row><IconButton icon={ArrowLeftIcon} label="Back" onPress={() => router.back()} /><AkadaText variant="h2">About Akada</AkadaText></Row>
      <Columns sideWidth={400}
        main={<>
          <Card style={{ alignItems: 'center', paddingVertical: space[32] }} gap={space[12]}>
            {/* Temporary mark until the brand logo is approved. */}
            <View style={{ width: 72, height: 72, borderRadius: radius.lg, backgroundColor: c.primary, alignItems: 'center', justifyContent: 'center' }}>
              <AkadaText variant="display" color="textOnPrimary">A</AkadaText>
            </View>
            <AkadaText variant="h1" align="center">Akada</AkadaText>
            <AkadaText variant="bodyMedium" color="textSecondary" align="center">Free practice for secondary school students in Nigeria.</AkadaText>
            <AkadaText variant="bodySmall" color="textTertiary" align="center">Version {APP_VERSION}</AkadaText>
          </Card>
          <Stack gap={space[16]}>
            {facts.map(([icon, title, sub]) => (
              <Row key={title} align="flex-start">
                <View style={{ width: 44, height: 44, borderRadius: radius.md, backgroundColor: c.primaryContainer, alignItems: 'center', justifyContent: 'center' }}><AkadaIcon icon={icon} /></View>
                <Stack gap={space[4]} style={{ flex: 1 }}>
                  <AkadaText variant="labelLarge">{title}</AkadaText>
                  <AkadaText variant="bodySmall" color="textSecondary">{sub}</AkadaText>
                </Stack>
              </Row>
            ))}
          </Stack>
        </>}
        side={<>
          <Card gap={space[8]}>
            <AkadaText variant="labelLarge">About the questions</AkadaText>
            <AkadaText variant="bodyMedium" color="textSecondary">All questions are original practice questions written for Akada. They are not past questions, and Akada is not connected to WAEC, NECO, JAMB or any exam board. Check your school’s scheme of work for what you need to study.</AkadaText>
          </Card>
          <ListCard>
            <ListRow label="Akada on GitHub" icon={GithubLogoIcon} last onPress={() => Linking.openURL(REPO_URL)} />
          </ListCard>
          <AkadaText variant="bodySmall" color="textTertiary" align="center">Akada is an independent study app.</AkadaText>
        </>}
      />
    </Screen>
  );
}
