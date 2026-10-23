import { useEffect, useState, type ReactNode } from 'react';
import { Animated, type StyleProp, type ViewStyle } from 'react-native';
import { duration, easing, nativeDriver, useReducedMotion } from '../theme/motion';

/** Fades content in and lifts it 8 px into place when it first appears. */
export function FadeIn({ children, delay = 0, style }: { children: ReactNode; delay?: number; style?: StyleProp<ViewStyle> }) {
  const reduced = useReducedMotion();
  const [v] = useState(() => new Animated.Value(0));
  useEffect(() => {
    if (reduced) { v.setValue(1); return; }
    Animated.timing(v, { toValue: 1, duration: duration.base, delay, easing: easing.out, useNativeDriver: nativeDriver }).start();
  }, [v, delay, reduced]);
  const translateY = v.interpolate({ inputRange: [0, 1], outputRange: [8, 0] });
  return <Animated.View style={[style, { opacity: v, transform: [{ translateY }] }]}>{children}</Animated.View>;
}

/**
 * Plays a small reaction when `trigger` becomes true:
 * `pop` grows to 103% and settles back, `shake` nudges sideways three times.
 */
export function Reaction({ children, trigger, kind, style }: { children: ReactNode; trigger: boolean; kind: 'pop' | 'shake'; style?: StyleProp<ViewStyle> }) {
  const reduced = useReducedMotion();
  const [v] = useState(() => new Animated.Value(0));
  useEffect(() => {
    if (!trigger || reduced) return;
    v.setValue(0);
    Animated.timing(v, { toValue: 1, duration: kind === 'pop' ? duration.base : duration.slow, easing: easing.inOut, useNativeDriver: nativeDriver }).start();
  }, [trigger, reduced, kind, v]);
  const transform = kind === 'pop'
    ? [{ scale: v.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.03, 1] }) }]
    : [{ translateX: v.interpolate({ inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1], outputRange: [0, -6, 5, -3, 2, 0] }) }];
  return <Animated.View style={[style, { transform }]}>{children}</Animated.View>;
}

/** A gentle bounce, once, for small rewards such as the streak flame. */
export function Bounce({ children, delay = duration.base }: { children: ReactNode; delay?: number }) {
  const reduced = useReducedMotion();
  const [v] = useState(() => new Animated.Value(0));
  useEffect(() => {
    if (reduced) return;
    Animated.sequence([
      Animated.delay(delay),
      Animated.spring(v, { toValue: 1, friction: 4, tension: 120, useNativeDriver: nativeDriver }),
    ]).start();
  }, [v, delay, reduced]);
  const scale = reduced ? 1 : v.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] });
  return <Animated.View style={{ transform: [{ scale }] }}>{children}</Animated.View>;
}
