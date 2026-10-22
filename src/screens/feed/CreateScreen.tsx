import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors, radius, spacing } from '../../theme/colors';
import { TextField } from '../../components/TextField';
import { Button } from '../../components/Button';
import { feedApi } from '../../api/feed';
import { extractErrorMessage } from '../../utils/errors';

export function CreateScreen() {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const publish = async () => {
    if (!text.trim()) {
      Alert.alert('Publication vide', 'Ajoutez un texte, une photo ou une vidéo avant de publier.');
      return;
    }
    setSubmitting(true);
    try {
      await feedApi.create({ text: text.trim() });
      setText('');
      Alert.alert('Publié !', 'Votre publication est maintenant visible sur le fil.');
    } catch (error) {
      Alert.alert('Erreur', extractErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer</Text>

      <TextField
        placeholder="Quoi de neuf ?"
        multiline
        numberOfLines={5}
        style={styles.textarea}
        value={text}
        onChangeText={setText}
      />

      <View style={styles.toolsRow}>
        <View style={styles.tool}>
          <FontAwesome5 name="image" size={16} color={colors.textSecondary} />
          <Text style={styles.toolLabel}>Photo</Text>
        </View>
        <View style={styles.tool}>
          <FontAwesome5 name="video" size={16} color={colors.textSecondary} />
          <Text style={styles.toolLabel}>Vidéo</Text>
        </View>
        <View style={styles.tool}>
          <FontAwesome5 name="hashtag" size={16} color={colors.textSecondary} />
          <Text style={styles.toolLabel}>Hashtag</Text>
        </View>
        <View style={styles.tool}>
          <FontAwesome5 name="map-marker-alt" size={16} color={colors.textSecondary} />
          <Text style={styles.toolLabel}>Lieu</Text>
        </View>
      </View>

      <Button label="Publier" onPress={publish} loading={submitting} />

      <Text style={styles.hint}>
        Astuce : pour publier une Vibe (vidéo courte verticale), utilisez le bouton Créer depuis l'onglet Vibes.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  title: { color: colors.textPrimary, fontSize: 20, fontWeight: '800', marginBottom: spacing.lg },
  textarea: { height: 120, textAlignVertical: 'top' },
  toolsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.xl },
  tool: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toolLabel: { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
  hint: { color: colors.textMuted, fontSize: 12, marginTop: spacing.lg, textAlign: 'center' },
});
