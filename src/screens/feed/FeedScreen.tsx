import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors, radius, spacing } from '../../theme/colors';
import { Logo } from '../../components/Logo';
import { PostCard } from '../../components/PostCard';
import { SupportModal } from '../../components/SupportModal';
import { feedApi } from '../../api/feed';
import { FeedPost } from '../../types/models';

const TABS = ['Pour toi', 'Abonnements', "Fil d'actualité"] as const;

export function FeedScreen() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("Fil d'actualité");
  const [supportTarget, setSupportTarget] = useState<FeedPost | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await feedApi.list();
      setPosts(data);
    } catch {
      setPosts([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Logo size="sm" />
        <View style={styles.headerIcons}>
          <FontAwesome5 name="search" size={18} color={colors.textPrimary} style={{ marginRight: spacing.lg }} />
          <FontAwesome5 name="bell" size={18} color={colors.textPrimary} />
        </View>
      </View>

      <View style={styles.tabsRow}>
        {TABS.map((tab) => (
          <Pressable key={tab} onPress={() => setActiveTab(tab)} style={styles.tabItem}>
            <Text style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>{tab}</Text>
            {activeTab === tab && <View style={styles.tabIndicator} />}
          </Pressable>
        ))}
      </View>

      <FlatList
        data={posts}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => <PostCard post={item} onOpenSupport={setSupportTarget} />}
        contentContainerStyle={{ paddingTop: spacing.md, paddingBottom: spacing.xxl }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <FontAwesome5 name="newspaper" size={28} color={colors.textMuted} />
            <Text style={styles.emptyText}>Aucune publication pour l'instant. Soyez le premier à créer du contenu !</Text>
          </View>
        }
      />

      <SupportModal
        visible={!!supportTarget}
        onClose={() => setSupportTarget(null)}
        context="feed"
        postId={supportTarget?.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabItem: { marginRight: spacing.lg, paddingBottom: spacing.sm },
  tabLabel: { color: colors.textMuted, fontWeight: '700', fontSize: 13 },
  tabLabelActive: { color: colors.primary },
  tabIndicator: { height: 2, backgroundColor: colors.primary, marginTop: spacing.xs, borderRadius: radius.pill },
  empty: { alignItems: 'center', marginTop: spacing.xxl, paddingHorizontal: spacing.xl, gap: spacing.md },
  emptyText: { color: colors.textMuted, textAlign: 'center' },
});
