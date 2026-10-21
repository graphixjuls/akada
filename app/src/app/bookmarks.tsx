import { router } from 'expo-router';
import { ArrowLeftIcon, BookmarkSimpleIcon } from '@/components/icons';
import { AkadaText } from '@/components/AkadaText';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/Feedback';
import { IconButton } from '@/components/IconButton';
import { ListCard, Row, Screen } from '@/components/Layout';
import { ListRow } from '@/components/ListRow';
import { questionById } from '@/data/bank';
import { subjectMeta } from '@/data/subjectMeta';
import { useStore } from '@/store/AppStore';

export default function Bookmarks() {
  const { data } = useStore();
  const items = data.bookmarks.map(questionById).filter(q => !!q);
  return (
    <Screen>
      <Row><IconButton icon={ArrowLeftIcon} label="Back" onPress={() => router.back()} /><AkadaText variant="h2">Bookmarks</AkadaText></Row>
      {items.length === 0
        ? <EmptyState emoji="star" title="No bookmarks yet" body="Tap the bookmark on any question to save it here for quick revision." action={<Button label="Start practising" onPress={() => router.replace('/(tabs)/practice')} />} />
        : (
          <>
            <Button label="Revise all bookmarks" variant="tonal" onPress={() => router.push({ pathname: '/review', params: { ids: data.bookmarks.join(',') } })} />
            <ListCard>
              {items.map((q, i) => <ListRow key={q!.id} label={q!.text.slice(0, 44) + (q!.text.length > 44 ? '…' : '')} value={subjectMeta(q!.subjectId).name} icon={BookmarkSimpleIcon} iconActive last={i === items.length - 1} onPress={() => router.push({ pathname: '/review', params: { ids: q!.id } })} />)}
            </ListCard>
          </>
        )}
    </Screen>
  );
}
