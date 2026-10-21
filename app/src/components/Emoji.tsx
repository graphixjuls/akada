import { Image } from 'react-native';
import { emoji } from '../theme/theme';

export type EmojiName = keyof typeof emoji;

/** Fluent 3D emoji, for delight only (32–96 px). Never use as a navigation or action icon. */
export function Emoji({ name, size = 40 }: { name: EmojiName; size?: number }) {
  return <Image source={emoji[name]} style={{ width: size, height: size }} accessibilityIgnoresInvertColors accessible={false} />;
}
