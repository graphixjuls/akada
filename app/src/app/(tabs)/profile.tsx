import { router } from 'expo-router';
import { ArrowCounterClockwiseIcon, BookmarkSimpleIcon, ChatCircleDotsIcon, DownloadSimpleIcon, GearSixIcon, InfoIcon } from '@/components/icons';
import { useState } from 'react';
import { View } from 'react-native';
import { AkadaText } from '@/components/AkadaText';
import { Button } from '@/components/Button';
import { Chip, SubjectTag, Wrap } from '@/components/Chips';
import { Dialog, useToast } from '@/components/Feedback';
import { Card, Columns, ListCard, Row, Screen, Stack } from '@/components/Layout';
import { ListRow } from '@/components/ListRow';
import Constants from 'expo-constants';
import { bank } from '@/data/bank';
import { courseById, departmentById, ENGLISH_ID, subjectById } from '@/data/catalog';
import { useStore, type ThemeSetting } from '@/store/AppStore';
import { THIS_DEVICE, useLayout } from '@/theme/responsive';
import { radius, space, useTheme } from '@/theme/theme';

const APP_VERSION = Constants.expoConfig?.version ?? '1.0.0';

export default function Profile() {
  const { data, resetAll, setTheme } = useStore();
  const { desktop } = useLayout();
  const themes: [ThemeSetting, string][] = [['system', 'System'], ['light', 'Light'], ['dark', 'Dark']];
  const { c } = useTheme();
  const toast = useToast();
  const [confirm, setConfirm] = useState(false);
  const p = data.profile!;
  const subjects = [ENGLISH_ID, ...p.subjects];
  const course = p.courseId ? courseById(p.courseId)?.name : departmentById(p.department)?.name;
  return (
    <Screen tab>
      {desktop && <AkadaText variant="h1">Profile</AkadaText>}
      <Columns sideWidth={560}
        main={<>
      <Card style={desktop ? { alignItems: 'center', padding: space[32] } : { backgroundColor: 'transparent', borderWidth: 0, padding: 0 }}>
      <Stack gap={space[12]} style={{ alignItems: 'center' }}>
        <View style={{ width: 96, height: 96, borderRadius: radius.full, backgroundColor: c.primaryContainer, alignItems: 'center', justifyContent: 'center' }}>
          <AkadaText variant="display" color="primaryOnContainer">{p.name.slice(0, 1).toUpperCase()}</AkadaText>
        </View>
        <AkadaText variant="h1" align="center">{p.name}</AkadaText>
        <AkadaText variant="bodyMedium" color="textSecondary" align="center">{course}</AkadaText>
      </Stack>
      </Card>
      <Card>
        <Row><AkadaText variant="labelLarge" style={{ flex: 1 }}>My subjects</AkadaText><Button label="Change" variant="ghost" size="small" onPress={() => router.push({ pathname: '/setup/subjects', params: { edit: '1' } })} /></Row>
        <Wrap>{subjects.map(id => { const s = subjectById(id); return s ? <SubjectTag key={id} label={s.name} color={s.color} /> : null; })}</Wrap>
        <AkadaText variant="bodySmall" color="textSecondary">Exam date: {p.examDate} · Daily goal: {p.dailyGoalMin} min</AkadaText>
      </Card>
        </>}
        side={<>
      <ListCard>
        <ListRow label="Settings" icon={GearSixIcon} onPress={() => router.push('/settings')} />
        <ListRow label="Offline access" value="On" icon={DownloadSimpleIcon} onPress={() => router.push('/downloads')} />
        <ListRow label="Bookmarks" value={String(data.bookmarks.length)} icon={BookmarkSimpleIcon} onPress={() => router.push('/bookmarks')} />
        <ListRow label="Help and feedback" icon={ChatCircleDotsIcon} onPress={() => toast('Help and feedback is coming soon.')} />
        <ListRow label="About Akada" icon={InfoIcon} last onPress={() => toast(`Akada ${APP_VERSION} · ${bank.questions.length.toLocaleString()} practice questions`)} />
      </ListCard>
      {/* Computers have room for the theme choice right here (phones use Settings). */}
      {desktop && (
        <Card>
          <AkadaText variant="labelLarge">Theme</AkadaText>
          <Row gap={space[8]}>{themes.map(([v, l]) => <Chip key={v} label={l} selected={data.settings.theme === v} onPress={() => setTheme(v)} grow />)}</Row>
          <AkadaText variant="bodySmall" color="textSecondary">System follows your device’s setting.</AkadaText>
        </Card>
      )}
      <ListCard><ListRow label="Reset progress" icon={ArrowCounterClockwiseIcon} labelColor="error" chevron={false} last onPress={() => setConfirm(true)} /></ListCard>
      <AkadaText variant="bodySmall" color="textTertiary" align="center">Akada is an independent study app. All questions are original practice questions.</AkadaText>
        </>}
      />
      <Dialog visible={confirm} title="Reset everything?" body={`This deletes your name, subjects, bookmarks and all progress from ${THIS_DEVICE}. It can’t be undone.`} primaryLabel="Reset" onPrimary={() => { setConfirm(false); resetAll(); router.replace('/splash'); }} secondaryLabel="Cancel" onSecondary={() => setConfirm(false)} />
    </Screen>
  );
}
