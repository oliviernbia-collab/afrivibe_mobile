import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/colors';
import { giftsApi } from '../api/wallet';
import { GiftCatalogItem } from '../types/models';
import { extractErrorMessage } from '../utils/errors';

interface SupportModalProps {
  visible: boolean;
  onClose: () => void;
  context: 'feed' | 'vibes' | 'live';
  postId?: string;
  vibeId?: string;
}

const GIFT_ICON_MAP: Record<string, keyof typeof FontAwesome5.glyphMap> = {
  'fa-solid fa-seedling': 'seedling',
  'fa-solid fa-egg': 'egg',
  'fa-solid fa-fish': 'fish',
  'fa-solid fa-bag-shopping': 'shopping-bag',
  'fa-solid fa-pen': 'pen',
  'fa-solid fa-book': 'book',
  'fa-solid fa-car': 'car',
  'fa-solid fa-chair': 'chair',
  'fa-solid fa-motorcycle': 'motorcycle',
  'fa-solid fa-helicopter': 'helicopter',
  'fa-solid fa-paw': 'paw',
};

export function SupportModal({ visible, onClose, context, postId, vibeId }: SupportModalProps) {
  const [gifts, setGifts] = useState<GiftCatalogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      giftsApi.catalog().then(setGifts).catch(() => setGifts([]));
      setFeedback(null);
    }
  }, [visible]);

  const priceFor = (gift: GiftCatalogItem) =>
    context === 'feed' ? gift.priceFeed : context === 'vibes' ? gift.priceVibes : gift.priceLive;

  const send = async (gift: GiftCatalogItem) => {
    setSendingCode(gift.code);
    setFeedback(null);
    try {
      await giftsApi.send({ giftCode: gift.code, context, postId, vibeId });
      setFeedback(`${gift.name} envoyé ! Merci pour votre soutien 🎉`);
    } catch (error) {
      setFeedback(extractErrorMessage(error));
    } finally {
      setSendingCode(null);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Soutenir avec un cadeau</Text>
            <Pressable onPress={onClose}>
              <FontAwesome5 name="times" size={18} color={colors.textSecondary} />
            </Pressable>
          </View>

          {feedback && <Text style={styles.feedback}>{feedback}</Text>}

          {gifts.length === 0 ? (
            <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing.xl }} />
          ) : (
            <FlatList
              data={gifts}
              numColumns={3}
              keyExtractor={(g) => g.id}
              contentContainerStyle={{ paddingVertical: spacing.md }}
              renderItem={({ item }) => (
                <Pressable style={styles.giftCell} onPress={() => send(item)} disabled={!!sendingCode}>
                  <View style={styles.giftIconWrap}>
                    {sendingCode === item.code ? (
                      <ActivityIndicator color={colors.primary} />
                    ) : (
                      <FontAwesome5 name={GIFT_ICON_MAP[item.icon] ?? 'gift'} size={22} color={colors.primary} />
                    )}
                  </View>
                  <Text style={styles.giftName}>{item.name}</Text>
                  <Text style={styles.giftPrice}>{priceFor(item)} F</Text>
                </Pressable>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.backgroundElevated,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
    maxHeight: '75%',
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  title: { color: colors.textPrimary, fontSize: 17, fontWeight: '800' },
  feedback: { color: colors.success, marginBottom: spacing.sm },
  giftCell: {
    flex: 1 / 3,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  giftIconWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  giftName: { color: colors.textPrimary, fontSize: 12, fontWeight: '600' },
  giftPrice: { color: colors.primary, fontSize: 12, fontWeight: '700' },
});
