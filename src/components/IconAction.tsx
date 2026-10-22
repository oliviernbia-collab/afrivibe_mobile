import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/colors';

interface IconActionProps {
  icon: keyof typeof FontAwesome5.glyphMap;
  label?: string;
  color?: string;
  solid?: boolean;
  filled?: boolean;
  onPress: () => void;
}

export function IconAction({ icon, label, color = colors.textSecondary, solid, filled, onPress }: IconActionProps) {
  return (
    <Pressable onPress={onPress} style={[styles.base, filled && { backgroundColor: colors.primary + '22', borderRadius: radius.pill, paddingHorizontal: spacing.md }]}>
      <FontAwesome5 name={icon} size={16} color={color} solid={solid} />
      {label && <Text style={[styles.label, { color }]}>{label}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6 },
  label: { fontSize: 13, fontWeight: '600' },
});
