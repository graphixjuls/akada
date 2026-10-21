import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { AkadaText } from '@/components/AkadaText';
import { Button } from '@/components/Button';
import { Chip, Wrap } from '@/components/Chips';
import { useToast } from '@/components/Feedback';
import { Screen, Stack } from '@/components/Layout';
import { SetupHeader } from '@/components/SetupHeader';
import { courseById, departmentById, ENGLISH_ID, subjectById, subjects as allSubjects } from '@/data/catalog';
import { images } from '@/data/images';
import { useStore } from '@/store/AppStore';
import { space } from '@/theme/theme';

/** Open choice: any number of subjects, nothing compulsory. The department and course only decide the suggestions. */
export default function Subjects() {
  const { edit } = useLocalSearchParams<{ edit?: string }>();
  const { data, updateDraft, update } = useStore();
  const toast = useToast();
  // Edit mode (from Profile) works on the saved profile; onboarding works on the draft.
  const source = edit && data.profile ? data.profile : data.draft;
  const dept = departmentById(source.department ?? 'science')!;
  const course = source.courseId ? courseById(source.courseId) : undefined;
  // English and Maths are taken by almost every SS student, so they lead the suggestions.
  const suggested = [...new Set([ENGLISH_ID, 'mathematics', ...(course?.suggested ?? []), ...dept.subjectIds])];
  const others = allSubjects.map(s => s.id).filter(id => !suggested.includes(id));
  const [picked, setPicked] = useState<string[]>(source.subjects ?? [ENGLISH_ID, 'mathematics', ...(course?.suggested ?? dept.subjectIds.slice(0, 3))].filter((id, i, a) => a.indexOf(id) === i));
  const save = () => {
    if (edit && data.profile) { update(d => ({ ...d, profile: { ...d.profile!, subjects: picked } })); toast('Subjects updated', 'success'); router.back(); }
    else { updateDraft({ subjects: picked }); router.push('/setup/exam'); }
  };
  const toggle = (id: string) => setPicked(picked.includes(id) ? picked.filter(s => s !== id) : [...picked, id]);
  const chips = (ids: string[]) => <Wrap>{ids.map(id => <Chip key={id} label={subjectById(id)?.name ?? id} selected={picked.includes(id)} onPress={() => toggle(id)} />)}</Wrap>;
  const body = course
    ? `${course.note ?? `Suggested for ${course.name}.`} Add or remove any subject you take at school.`
    : 'Pick every subject you take at school. You can change them any time.';
  const count = picked.length;
  return (
    <Screen width="form" aside={images.science} footer={<Button label={count ? `${edit ? 'Save' : 'Continue'} · ${count} ${count === 1 ? 'subject' : 'subjects'}` : 'Pick at least one subject'} disabled={!count} onPress={save} block />}>
      <SetupHeader step={edit ? undefined : 3} photo={images.science} title="Your subjects" body={body} />
      <Stack gap={space[12]}>
        <AkadaText variant="labelMedium">Suggested for {course ? course.name : dept.name}</AkadaText>
        {chips(suggested)}
      </Stack>
      <Stack gap={space[12]}>
        <AkadaText variant="labelMedium">Other subjects</AkadaText>
        {chips(others)}
      </Stack>
    </Screen>
  );
}
