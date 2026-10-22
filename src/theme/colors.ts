/**
 * Thème AfriVibe — fidèle à l'identité du logo et à la maquette fournie :
 * fond sombre, dégradé multicolore africain, accent or/ambre. Pas de fond
 * blanc nulle part dans l'app (mode sombre uniquement pour ce build).
 */
export const colors = {
  background: '#0B0B10',
  backgroundElevated: '#131319',
  surface: '#1A1A22',
  surfaceAlt: '#20202A',
  border: '#2A2A35',

  textPrimary: '#F5F5F7',
  textSecondary: '#9A9AA5',
  textMuted: '#6B6B76',

  primary: '#F5A623',
  primaryDark: '#C97E0E',
  accentPink: '#E8457C',
  accentOrange: '#F5820B',
  accentYellow: '#F7C948',
  accentGreen: '#36B37E',
  accentPurple: '#8E3EDB',

  success: '#36B37E',
  danger: '#E8544B',
  info: '#3E9BE8',

  gradientBrand: ['#E8457C', '#F5820B', '#F7C948', '#36B37E', '#8E3EDB'] as const,
  gradientGold: ['#F7C948', '#F5A623'] as const,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 18,
  pill: 999,
} as const;

export const typography = {
  h1: { fontSize: 24, fontWeight: '800' as const },
  h2: { fontSize: 19, fontWeight: '700' as const },
  body: { fontSize: 14, fontWeight: '400' as const },
  bodyBold: { fontSize: 14, fontWeight: '600' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
};
