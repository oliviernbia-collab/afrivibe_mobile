import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/colors';
import { FeedPost } from '../types/models';
import { feedApi } from '../api/feed';
import { IconAction } from './IconAction';

interface PostCardProps {
  post: FeedPost;
  onOpenSupport: (post: FeedPost) => void;
}

export function PostCard({ post, onOpenSupport }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount);

  const toggleLike = async () => {
    try {
      if (liked) {
        setLiked(false);
        setLikesCount((c) => c - 1);
        await feedApi.unlike(post.id);
      } else {
        setLiked(true);
        setLikesCount((c) => c + 1);
        await feedApi.like(post.id);
      }
    } catch {
      setLiked((prev) => !prev);
    }
  };

  const media = post.media?.[0];

  return (
    <View style={styles.card}>
      {post.isBoosted && (
        <View style={styles.sponsoredBadge}>
          <FontAwesome5 name="bolt" size={10} color="#1A1206" />
          <Text style={styles.sponsoredText}>Sponsorisé</Text>
        </View>
      )}

      {post.text && <Text style={styles.text}>{post.text}</Text>}

      {media && (
        <View style={styles.mediaWrap}>
          <Image source={{ uri: media.thumbnailUrl ?? media.url }} style={styles.media} resizeMode="cover" />
          {media.type === 'video' && (
            <View style={styles.playOverlay}>
              <FontAwesome5 name="play" size={18} color="#fff" />
            </View>
          )}
        </View>
      )}

      <View style={styles.actionsRow}>
        <IconAction icon={liked ? 'heart' : 'heart'} solid={liked} color={liked ? colors.accentPink : colors.textSecondary} label={String(likesCount)} onPress={toggleLike} />
        <IconAction icon="comment" color={colors.textSecondary} label={String(post.commentsCount)} onPress={() => {}} />
        <IconAction icon="share" color={colors.textSecondary} label={String(post.sharesCount)} onPress={() => feedApi.share(post.id, 'afrivibe')} />
        <IconAction icon="gift" color={colors.primary} label="Soutenir" filled onPress={() => onOpenSupport(post)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sponsoredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
    marginBottom: spacing.sm,
  },
  sponsoredText: { color: '#1A1206', fontSize: 10, fontWeight: '800' },
  text: { color: colors.textPrimary, fontSize: 14, lineHeight: 20, marginBottom: spacing.sm },
  mediaWrap: { borderRadius: radius.md, overflow: 'hidden', marginBottom: spacing.md },
  media: { width: '100%', height: 220, backgroundColor: colors.surfaceAlt },
  playOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: spacing.xs },
});
