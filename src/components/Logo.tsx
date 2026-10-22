import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  withTagline?: boolean;
}

const SIZES = { sm: 28, md: 40, lg: 64 };

export function Logo({ size = 'md', withTagline = false }: LogoProps) {
  const dimension = SIZES[size];
  return (
    <View style={styles.row}>
      {/* eslint-disable-next-line @typescript-eslint/no-require-imports */}
      <Image source={require('../../assets/mark.png')} style={{ width: dimension, height: dimension, borderRadius: dimension / 5 }} />
      <View style={styles.textBlock}>
        <Text style={[styles.title, { fontSize: dimension * 0.5 }]}>
          Afri<Text style={styles.titleAccent}>Vibe</Text>
        </Text>
        {withTagline && <Text style={styles.tagline}>Créer. Partager. Gagner.</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  textBlock: { justifyContent: 'center' },
  title: { color: colors.textPrimary, fontWeight: '800' },
  titleAccent: { color: colors.primary },
  tagline: { color: colors.textSecondary, fontSize: 11, letterSpacing: 0.5, textTransform: 'uppercase' },
});
