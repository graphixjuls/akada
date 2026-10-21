import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { FlatList, useWindowDimensions, View } from 'react-native';
import { AkadaText } from '@/components/AkadaText';
import { Button } from '@/components/Button';
import { Photo, Screen } from '@/components/Layout';
import { PageDots } from '@/components/Progress';
import { BookOpenTextIcon, FireIcon, TimerIcon, type Icon } from '@/components/icons';
import { AkadaIcon } from '@/components/AkadaIcon';
import { Logo } from '@/components/Logo';
import { subjects } from '@/data/catalog';
import { images } from '@/data/images';
import { useLayout } from '@/theme/responsive';
import { radius, space, useTheme } from '@/theme/theme';

const SLIDES = [
  { image: images.study, title: 'Practise every subject', body: 'Questions for SS1 to SS3 in Science, Social Science and Arts, each with a clear explanation.' },
  { image: images.cbt, title: 'Take timed mock tests', body: 'Answer questions against the clock, so exam day feels familiar.' },
  { image: images.celebrate, title: 'Build a daily habit', body: 'Set a goal, keep your streak going and watch your scores grow.' },
];

const FEATURES: [Icon, string, string][] = [
  [BookOpenTextIcon, `3,000+ questions in ${subjects.length} subjects`, 'Organised by SS1, SS2 and SS3 topics'],
  [TimerIcon, 'Timed mock tests', 'Answer against the clock, so exam day feels familiar'],
  [FireIcon, 'A daily habit', 'Set a goal and keep your streak going'],
];

/** Computers: one split screen instead of the swipeable slides. */
function DesktopWelcome() {
  const { c } = useTheme();
  return (
    <Screen width="form" aside={images.study} footer={<>
      <Button label="Get started" onPress={() => router.replace('/get-started')} block />
      <AkadaText variant="bodySmall" color="textTertiary" align="center">Free · works offline · no account needed</AkadaText>
    </>}>
      <Logo size={44} />
      <View style={{ gap: space[12] }}>
        <AkadaText variant="display">Practise every subject</AkadaText>
        <AkadaText variant="bodyLarge" color="textSecondary">Free practice questions for SS1 to SS3 in Science, Social Science and Arts, each with a clear explanation.</AkadaText>
      </View>
      <View style={{ gap: space[16] }}>
        {FEATURES.map(([icon, title, sub]) => (
          <View key={title} style={{ flexDirection: 'row', alignItems: 'center', gap: space[12] }}>
            <View style={{ width: 44, height: 44, borderRadius: radius.md, backgroundColor: c.primaryContainer, alignItems: 'center', justifyContent: 'center' }}><AkadaIcon icon={icon} /></View>
            <View style={{ flex: 1, gap: space[4] }}>
              <AkadaText variant="labelLarge">{title}</AkadaText>
              <AkadaText variant="bodySmall" color="textSecondary">{sub}</AkadaText>
            </View>
          </View>
        ))}
      </View>
    </Screen>
  );
}

export default function Welcome() {
  const { desktop } = useLayout();
  return desktop ? <DesktopWelcome /> : <Slides />;
}

function Slides() {
  const window = useWindowDimensions();
  const height = window.height;
  // Slides are as wide as the list itself, which on the web is the app column, not the whole browser window.
  const [width, setWidth] = useState(window.width);
  const [index, setIndex] = useState(0);
  const list = useRef<FlatList>(null);
  const last = index === SLIDES.length - 1;
  const next = () => {
    if (last) { router.replace('/get-started'); return; }
    list.current?.scrollToIndex({ index: index + 1 });
    setIndex(index + 1);
  };
  return (
    <Screen
      scroll={false}
      footer={<><PageDots count={SLIDES.length} active={index} /><Button label={last ? 'Get started' : 'Next'} onPress={next} block /></>}
    >
      <View style={{ height: 48, alignItems: 'flex-end', justifyContent: 'center' }}>
        {/* Buttons align themselves to the start, so wrap Skip to push it to the right. */}
        {!last && <View style={{ alignSelf: 'flex-end' }}><Button label="Skip" variant="ghost" size="small" onPress={() => router.replace('/get-started')} /></View>}
      </View>
      <FlatList
        ref={list}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={s => s.title}
        style={{ marginHorizontal: -space[20] }}
        onLayout={e => setWidth(e.nativeEvent.layout.width)}
        // onScroll (not onMomentumScrollEnd) so the dots also follow on the web, where momentum events don't fire.
        onScroll={e => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        scrollEventThrottle={32}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        renderItem={({ item }) => (
          <View style={{ width, paddingHorizontal: space[20], gap: space[24] }}>
            <Photo source={item.image} height={Math.max(220, height * 0.42)} />
            <View style={{ gap: space[12] }}>
              <AkadaText variant="h1" align="center">{item.title}</AkadaText>
              <AkadaText variant="bodyLarge" color="textSecondary" align="center">{item.body}</AkadaText>
            </View>
          </View>
        )}
      />
    </Screen>
  );
}
