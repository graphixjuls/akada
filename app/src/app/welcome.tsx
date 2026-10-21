import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { FlatList, useWindowDimensions, View } from 'react-native';
import { AkadaText } from '@/components/AkadaText';
import { Button } from '@/components/Button';
import { Photo, Screen } from '@/components/Layout';
import { PageDots } from '@/components/Progress';
import { images } from '@/data/images';
import { space } from '@/theme/theme';

const SLIDES = [
  { image: images.study, title: 'Practise every subject', body: 'Questions for SS1 to SS3 in Science, Social Science and Arts, each with a clear explanation.' },
  { image: images.cbt, title: 'Take timed mock tests', body: 'Answer questions against the clock, so exam day feels familiar.' },
  { image: images.celebrate, title: 'Build a daily habit', body: 'Set a goal, keep your streak going and watch your scores grow.' },
];

export default function Welcome() {
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
