import { router } from 'expo-router';
import { CalendarBlankIcon } from 'phosphor-react-native';
import { useState } from 'react';
import { AkadaText } from '@/components/AkadaText';
import { Button } from '@/components/Button';
import { Chip, Wrap } from '@/components/Chips';
import { Screen, Stack } from '@/components/Layout';
import { SetupHeader } from '@/components/SetupHeader';
import { TextField } from '@/components/TextField';
import { images } from '@/data/images';
import { useStore } from '@/store/AppStore';
import { space } from '@/theme/theme';

const GOALS = [{ min: 15, label: '15 min', q: 10 }, { min: 30, label: '30 min', q: 20 }, { min: 45, label: '45 min', q: 30 }, { min: 60, label: '1 hour', q: 40 }];

export default function ExamDate() {
  const { data, updateDraft } = useStore();
  const [date, setDate] = useState(data.draft.examDate ?? '');
  const [goal, setGoal] = useState(data.draft.dailyGoalMin ?? 30);
  const g = GOALS.find(x => x.min === goal)!;
  return (
    <Screen footer={<Button label="Continue" block onPress={() => { updateDraft({ examDate: date.trim() || 'Not set yet', dailyGoalMin: goal }); router.push('/setup/done'); }} />}>
      <SetupHeader step={4} photo={images.examGoal} photoHeight={140} title="When is your exam?" body="We'll plan your practice so you're ready in time." />
      <TextField label="Exam date" value={date} onChangeText={setDate} placeholder="e.g. 15 Apr 2027" icon={CalendarBlankIcon} helper="Check your school timetable for the date. You can skip this for now." />
      <Stack gap={space[12]}>
        <AkadaText variant="labelMedium">Daily goal</AkadaText>
        <Wrap>{GOALS.map(x => <Chip key={x.min} label={x.label} selected={goal === x.min} onPress={() => setGoal(x.min)} />)}</Wrap>
        <AkadaText variant="bodySmall" color="textSecondary">About {g.q} questions a day.</AkadaText>
      </Stack>
    </Screen>
  );
}
