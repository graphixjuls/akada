import type { Icon } from 'phosphor-react-native';
import { useState } from 'react';
import { TextInput, View, type KeyboardTypeOptions } from 'react-native';
import { radius, space, type as typeScale, useTheme } from '../theme/theme';
import { AkadaIcon } from './AkadaIcon';
import { AkadaText } from './AkadaText';

interface Props {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  helper?: string;
  error?: string | null;
  icon?: Icon;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  autoFocus?: boolean;
  disabled?: boolean;
}

/** Label above, 52-tall field (radius 12), helper or error below. States: Default, Focused, Error, Disabled. */
export function TextField({ label, value, onChangeText, placeholder, helper, error, icon, keyboardType, maxLength, autoFocus, disabled }: Props) {
  const { c } = useTheme();
  const [focused, setFocused] = useState(false);
  const border = error ? c.error : focused ? c.borderFocus : c.borderDefault;
  return (
    <View style={{ gap: space[8] }}>
      <AkadaText variant="labelMedium">{label}</AkadaText>
      <View style={{ height: 52, borderRadius: radius.md, borderWidth: focused || error ? 2 : 1, borderColor: border, backgroundColor: disabled ? c.bgSunken : c.bgSurface, flexDirection: 'row', alignItems: 'center', paddingHorizontal: space[12], gap: space[12] }}>
        {icon && <AkadaIcon icon={icon} color={error ? c.error : c.textSecondary} />}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={c.textTertiary}
          keyboardType={keyboardType}
          maxLength={maxLength}
          autoFocus={autoFocus}
          editable={!disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          accessibilityLabel={label}
          style={[typeScale.bodyLarge, { flex: 1, color: c.textPrimary, paddingVertical: 0 }]}
        />
      </View>
      {(error || helper) && <AkadaText variant="bodySmall" color={error ? 'error' : 'textSecondary'}>{error || helper}</AkadaText>}
    </View>
  );
}
