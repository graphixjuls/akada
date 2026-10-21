import { router } from 'expo-router';
import { useState } from 'react';
import { Button } from '@/components/Button';
import { Screen, Stack } from '@/components/Layout';
import { DepartmentCard } from '@/components/ListRow';
import { SetupHeader } from '@/components/SetupHeader';
import { departments } from '@/data/catalog';
import { images } from '@/data/images';
import type { DepartmentId } from '@/data/types';
import { useStore } from '@/store/AppStore';
import { space } from '@/theme/theme';

const PHOTO = { science: images.science, social: images.social, arts: images.arts } as const;

export default function Department() {
  const { data, updateDraft } = useStore();
  const [picked, setPicked] = useState<DepartmentId>(data.draft.department ?? 'science');
  return (
    <Screen width="form" aside={images.science} footer={<Button label="Continue" block onPress={() => { updateDraft({ department: picked }); router.push('/setup/course'); }} />}>
      <SetupHeader step={1} title="What's your department?" body="We'll suggest subjects that fit it. You can change this later." />
      <Stack gap={space[12]}>
        {departments.map(d => <DepartmentCard key={d.id} title={d.name} description={d.blurb} image={PHOTO[d.id]} selected={picked === d.id} onPress={() => setPicked(d.id)} />)}
      </Stack>
    </Screen>
  );
}
