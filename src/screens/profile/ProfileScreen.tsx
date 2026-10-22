import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors, radius, spacing } from '../../theme/colors';
import { useAuthStore } from '../../store/auth.store';

const MENU_ITEMS: { icon: keyof typeof FontAwesome5.glyphMap; label: string }[] = [
  { icon: 'id-card', label: 'Vérification (KYC)' },
  { icon: 'medal', label: 'Mes badges' },
  { icon: 'rocket', label: 'Mes boosts' },
  { icon: 'bell', label: 'Notifications' },
  { icon: 'lock', label: 'Confidentialité & sécurité' },
  { icon: 'language', label: 'Langue' },
  { icon: 'question-circle', label: 'Aide & support' },
];

export function ProfileScreen() {
  const { user, logout } = useAuthStore();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {user?.avatarUrl ? (
          <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <FontAwesome5 name="user" size={28} color={colors.textMuted} />
          </View>
        )}
        <View style={{ flex: 1 }}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{user?.pseudo}</Text>
            {user?.isVerified && <FontAwesome5 name="check-circle" solid size={14} color={colors.info} />}
          </View>
          <Text style={styles.fullName}>{user?.fullName}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <Stat label="Abonnés" value="0" />
        <Stat label="Abonnements" value="0" />
        <Stat label="Likes" value="0" />
      </View>

      <View style={styles.menu}>
        {MENU_ITEMS.map((item) => (
          <Pressable key={item.label} style={styles.menuRow}>
            <FontAwesome5 name={item.icon} size={16} color={colors.textSecondary} style={{ width: 28 }} />
            <Text style={styles.menuLabel}>{item.label}</Text>
            <FontAwesome5 name="chevron-right" size={12} color={colors.textMuted} />
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.logoutButton} onPress={logout}>
        <FontAwesome5 name="sign-out-alt" size={16} color={colors.danger} />
        <Text style={styles.logoutLabel}>Se déconnecter</Text>
      </Pressable>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg },
  avatar: { width: 72, height: 72, borderRadius: 36 },
  avatarFallback: { backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  name: { color: colors.textPrimary, fontSize: 18, fontWeight: '800' },
  fullName: { color: colors.textSecondary, fontSize: 13 },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stat: { alignItems: 'center' },
  statValue: { color: colors.textPrimary, fontWeight: '800', fontSize: 16 },
  statLabel: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  menu: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuLabel: { flex: 1, color: colors.textPrimary, fontSize: 14, fontWeight: '500' },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
  },
  logoutLabel: { color: colors.danger, fontWeight: '700' },
});
