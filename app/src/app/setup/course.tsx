import { router } from 'expo-router';
import { CheckCircleIcon, GraduationCapIcon, MagnifyingGlassIcon } from '@/components/icons';
import { useMemo, useState } from 'react';
import { AkadaText } from '@/components/AkadaText';
import { Button } from '@/components/Button';
import { Card, ListCard, Screen, Stack } from '@/components/Layout';
import { ListRow } from '@/components/ListRow';
import { Emoji } from '@/components/Emoji';
import { SetupHeader } from '@/components/SetupHeader';
import { TextField } from '@/components/TextField';
import { departmentById, ENGLISH_ID, searchCourses, subjectById } from '@/data/catalog';
import { images } from '@/data/images';
import { useStore } from '@/store/AppStore';

const short = (id: string) => ({ biology: 'Bio', chemistry: 'Chem', physics: 'Phy', mathematics: 'Maths' } as Record<string, string>)[id] ?? subjectById(id)?.name ?? id;

export default function Course() {
  const { data, updateDraft } = useStore();
  const dept = data.draft.department ?? 'science';
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState<string | null>(data.draft.courseId ?? null);
  const results = useMemo(() => searchCourses(query, query ? undefined : dept), [query, dept]);
  const go = (courseId: string | null) => {
    const course = courseId ? searchCourses('').find(c => c.id === courseId) : null;
    updateDraft({ courseId, subjects: [...new Set([ENGLISH_ID, 'mathematics', ...(course?.suggested ?? departmentById(dept)!.subjectIds.slice(0, 3))])] });
    router.push('/setup/subjects');
  };
  return (
    <Screen width="form" aside={images.study} footer={<Button label="Continue" disabled={!picked} onPress={() => go(picked)} block />}>
      <SetupHeader step={2} photo={images.study} photoHeight={96} title="What do you want to study?" body="We'll suggest subjects for it. You can swap any of them next." />
      <TextField label="Course" value={query} onChangeText={setQuery} placeholder="Search courses" icon={MagnifyingGlassIcon} helper={query ? undefined : `Popular for ${departmentById(dept)?.name}`} />
      {results.length > 0 ? (
        <ListCard>
          {results.slice(0, 6).map((c, i, arr) => (
            <ListRow key={c.id} label={c.name} value={c.suggested.map(short).join(' · ')} icon={picked === c.id ? CheckCircleIcon : GraduationCapIcon} iconActive={picked === c.id} chevron={false} last={i === arr.length - 1} onPress={() => setPicked(c.id)} />
          ))}
        </ListCard>
      ) : (
        <Card>
          <Stack>
            <Emoji name="thinking" size={48} />
            <AkadaText variant="h3">We couldn’t find that course</AkadaText>
            <AkadaText variant="bodyMedium" color="textSecondary">Try a shorter name, or skip and choose your subjects yourself.</AkadaText>
            <Button label="Choose subjects myself" variant="ghost" size="small" onPress={() => go(null)} />
          </Stack>
        </Card>
      )}
    </Screen>
  );
}
