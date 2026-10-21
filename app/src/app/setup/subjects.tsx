import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { AkadaText } from '@/components/AkadaText';
import { Button } from '@/components/Button';
import { Chip, SubjectTag, Wrap } from '@/components/Chips';
import { useToast } from '@/components/Feedback';
import { Screen, Stack } from '@/components/Layout';
import { SetupHeader } from '@/components/SetupHeader';
import { courseById, departmentById, subjectById } from '@/data/catalog';
import { images } from '@/data/images';
import { useStore } from '@/store/AppStore';
import { space } from '@/theme/theme';

export default function Subjects() {
  const { edit } = useLocalSearchParams<{ edit?: string }>();
  const { data, updateDraft, update } = useStore();
  const toast = useToast();
  // Edit mode (from Profile) works on the saved profile; onboarding works on the draft.
  const source = edit && data.profile ? data.profile : data.draft;
  const dept = departmentById(source.department ?? 'science')!;
  const course = source.courseId ? courseById(source.courseId) : undefined;
  const [picked, setPicked] = useState<string[]>(source.subjects ?? []);
  const save = () => {
    if (edit && data.profile) { update(d => ({ ...d, profile: { ...d.profile!, subjects: picked } })); toast('Subjects updated', 'success'); router.back(); }
    else { updateDraft({ subjects: picked }); router.push('/setup/exam'); }
  };
  // Show the department's list plus any suggested subject from another department (e.g. Economics for Computer Science).
  const options = [...new Set([...(course?.suggested ?? []), ...dept.subjectIds])];
  const toggle = (id: string) => {
    if (picked.includes(id)) setPicked(picked.filter(s => s !== id));
    else if (picked.length >= 3) toast('You can pick 3. Unselect one to swap it.', 'error');
    else setPicked([...picked, id]);
  };
  const body = course
    ? `${course.note ?? `Suggested for ${course.name}.`} Tap a subject to swap it, and check your school’s requirements.`
    : 'Pick 3 subjects to focus on, besides English.';
  return (
    <Screen footer={<Button label={picked.length === 3 ? (edit ? 'Save subjects' : 'Continue') : `Pick ${3 - picked.length} more`} disabled={picked.length !== 3} onPress={save} block />}>
      <SetupHeader step={edit ? undefined : 3} photo={images.science} title="Your subjects" body={body} />
      <Stack>
        <AkadaText variant="labelMedium">Compulsory</AkadaText>
        <SubjectTag label="English Language" color="english" />
      </Stack>
      <Stack gap={space[12]}>
        <AkadaText variant="labelMedium">{dept.name} subjects · {picked.length} of 3 selected</AkadaText>
        <Wrap>{options.map(id => <Chip key={id} label={subjectById(id)?.name ?? id} selected={picked.includes(id)} onPress={() => toggle(id)} />)}</Wrap>
      </Stack>
    </Screen>
  );
}
