import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors, spacing } from '../theme/colors';
import { Vibe } from '../types/models';
import { vibesApi } from '../api/vibes';
import { IconAction } from './IconAction';
import { SupportModal } from './SupportModal';
import { getDeviceFingerprint } from '../utils/device';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface VibeCardProps {
  vibe: Vibe;
  isActive: boolean;
}

export function VibeCard({ vibe, isActive }: VibeCardProps) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(vibe.likesCount);
  const [supportVisible, setSupportVisible] = useState(false);
  const watchSecondsRef = useRef(0);
  const hasReportedRef = useRef(false);

  const player = useVideoPlayer(vibe.videoUrl, (p) => {
    p.loop = true;
    p.muted = false;
    p.timeUpdateEventInterval = 0.25;
  });

  const { currentTime } = useEvent(player, 'timeUpdate', {
    currentTime: 0,
    currentLiveTimestamp: null,
    currentOffsetFromLive: null,
    bufferedPosition: 0,
  });

  useEffect(() => {
    if (player.playing) {
      watchSecondsRef.current = currentTime;
    }
  }, [currentTime, player]);

  useEffect(() => {
    if (isActive) {
      player.play();
    } else {
      player.pause();
      reportView();
    }
    return () => {
      if (isActive) reportView();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  const reportView = async () => {
    if (hasReportedRef.current || watchSecondsRef.current < 1) return;
    hasReportedRef.current = true;
    const fingerprint = await getDeviceFingerprint();
    vibesApi.recordView(vibe.id, fingerprint, Math.round(watchSecondsRef.current)).catch(() => {});
  };

  const toggleLike = async () => {
    try {
      if (liked) {
        setLiked(false);
        setLikesCount((c) => c - 1);
        await vibesApi.unlike(vibe.id);
      } else {
        setLiked(true);
        setLikesCount((c) => c + 1);
        await vibesApi.like(vibe.id);
      }
    } catch {
      setLiked((prev) => !prev);
    }
  };

  return (
    <View style={styles.page}>
      <VideoView player={player} style={StyleSheet.absoluteFill} contentFit="cover" nativeControls={false} />

      <View style={styles.overlay}>
        <View style={styles.bottomInfo}>
          <Text style={styles.caption} numberOfLines={3}>
            {vibe.caption}
          </Text>
          <Text style={styles.views}>{vibe.viewsCount} vues</Text>
        </View>

        <View style={styles.actionsColumn}>
          <IconAction icon="heart" solid={liked} color={liked ? colors.accentPink : '#fff'} label={String(likesCount)} onPress={toggleLike} />
          <IconAction icon="comment" color="#fff" label={String(vibe.commentsCount)} onPress={() => {}} />
          <IconAction icon="bookmark" color="#fff" onPress={() => {}} />
          <Pressable onPress={() => setSupportVisible(true)} style={styles.giftButton}>
            <FontAwesome5 name="gift" size={18} color="#1A1206" />
          </Pressable>
        </View>
      </View>

      <SupportModal visible={supportVisible} onClose={() => setSupportVisible(false)} context="vibes" vibeId={vibe.id} />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { height: SCREEN_HEIGHT, backgroundColor: '#000' },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  bottomInfo: { flex: 1, justifyContent: 'flex-end', paddingRight: spacing.lg },
  caption: { color: '#fff', fontSize: 14, marginBottom: spacing.xs },
  views: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
  actionsColumn: { alignItems: 'center', justifyContent: 'flex-end', gap: spacing.md },
  giftButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
});
