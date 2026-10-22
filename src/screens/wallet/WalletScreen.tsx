import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, spacing } from '../../theme/colors';
import { Button } from '../../components/Button';
import { walletApi } from '../../api/wallet';
import { Wallet, WalletTransaction } from '../../types/models';
import { extractErrorMessage } from '../../utils/errors';

const TX_LABELS: Record<string, string> = {
  recharge: 'Recharge',
  withdrawal: 'Retrait',
  gift_sent: 'Cadeau envoyé',
  gift_received: 'Cadeau reçu',
  reward_likes: 'Gain — likes',
  reward_views: 'Gain — vues',
  boost_payment: 'Boost',
  commission: 'Commission',
  refund: 'Remboursement',
  adjustment: 'Ajustement',
};

const TX_ICONS: Record<string, keyof typeof FontAwesome5.glyphMap> = {
  recharge: 'plus-circle',
  withdrawal: 'arrow-circle-up',
  gift_sent: 'gift',
  gift_received: 'gift',
  reward_likes: 'heart',
  reward_views: 'eye',
  boost_payment: 'rocket',
  commission: 'percentage',
  refund: 'undo',
  adjustment: 'sliders-h',
};

export function WalletScreen() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);

  const load = async () => {
    try {
      const [w, tx] = await Promise.all([walletApi.me(), walletApi.transactions()]);
      setWallet(w);
      setTransactions(tx);
    } catch {
      // Portefeuille pas encore chargé (utilisateur fraîchement inscrit, etc.)
    }
  };

  useEffect(() => {
    load();
  }, []);

  const recharge = async () => {
    try {
      await walletApi.recharge(5000, 'orange_money');
      Alert.alert('Recharge initiée', 'Suivez les instructions envoyées par votre opérateur Mobile Money.');
      load();
    } catch (error) {
      Alert.alert('Erreur', extractErrorMessage(error));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Portefeuille</Text>

      <LinearGradient colors={colors.gradientGold} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Solde disponible</Text>
        <Text style={styles.balanceValue}>{Number(wallet?.balance ?? 0).toLocaleString('fr-FR')} F</Text>
        {Number(wallet?.pendingBalance ?? 0) > 0 && (
          <Text style={styles.pendingLabel}>
            + {Number(wallet?.pendingBalance).toLocaleString('fr-FR')} F en attente de validation
          </Text>
        )}
        <View style={styles.balanceActions}>
          <Button label="Recharger" onPress={recharge} variant="secondary" style={styles.balanceButton} />
        </View>
      </LinearGradient>

      <Text style={styles.sectionTitle}>Historique</Text>
      <FlatList
        data={transactions}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => {
          const amount = Number(item.amount);
          return (
            <View style={styles.txRow}>
              <View style={styles.txIcon}>
                <FontAwesome5 name={TX_ICONS[item.type] ?? 'exchange-alt'} size={14} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.txLabel}>{TX_LABELS[item.type] ?? item.type}</Text>
                <Text style={styles.txDate}>{new Date(item.createdAt).toLocaleString('fr-FR')}</Text>
              </View>
              <Text style={[styles.txAmount, amount >= 0 ? styles.txPositive : styles.txNegative]}>
                {amount >= 0 ? '+' : ''}
                {amount.toLocaleString('fr-FR')} F
              </Text>
            </View>
          );
        }}
        ListEmptyComponent={<Text style={styles.emptyText}>Aucune transaction pour l'instant.</Text>}
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  title: { color: colors.textPrimary, fontSize: 20, fontWeight: '800', marginBottom: spacing.lg },
  balanceCard: { borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.xl },
  balanceLabel: { color: '#3A2A06', fontWeight: '700', fontSize: 13 },
  balanceValue: { color: '#1A1206', fontWeight: '800', fontSize: 30, marginTop: spacing.xs },
  pendingLabel: { color: '#3A2A06', fontSize: 12, marginTop: spacing.xs },
  balanceActions: { flexDirection: 'row', marginTop: spacing.lg },
  balanceButton: { flex: 1 },
  sectionTitle: { color: colors.textPrimary, fontWeight: '700', fontSize: 15, marginBottom: spacing.md },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  txIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txLabel: { color: colors.textPrimary, fontWeight: '600', fontSize: 13 },
  txDate: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  txAmount: { fontWeight: '800', fontSize: 13 },
  txPositive: { color: colors.success },
  txNegative: { color: colors.danger },
  emptyText: { color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl },
});
