import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Logo } from '../../components/Logo';
import { TextField } from '../../components/TextField';
import { Button } from '../../components/Button';
import { useAuthStore } from '../../store/auth.store';
import { colors, spacing } from '../../theme/colors';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { extractErrorMessage } from '../../utils/errors';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export function RegisterScreen() {
  const navigation = useNavigation<Nav>();
  const { register, isLoading } = useAuthStore();
  const [pseudo, setPseudo] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async () => {
    try {
      await register({ pseudo: pseudo.trim(), fullName: fullName.trim(), phone: phone.trim(), password });
    } catch (error) {
      Alert.alert('Inscription impossible', extractErrorMessage(error));
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.logoWrap}>
          <Logo size="md" />
        </View>

        <Text style={styles.title}>Rejoindre AfriVibe</Text>
        <Text style={styles.subtitle}>Créez votre compte créateur et commencez à gagner.</Text>

        <TextField label="Pseudo" placeholder="ex: Mariam_224" autoCapitalize="none" value={pseudo} onChangeText={setPseudo} />
        <TextField label="Nom complet" placeholder="ex: Mariam Koné" value={fullName} onChangeText={setFullName} />
        <TextField
          label="Téléphone"
          placeholder="ex: +225 07 00 00 00 00"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        <TextField label="Mot de passe" placeholder="8 caractères minimum" secureTextEntry value={password} onChangeText={setPassword} />

        <Button label="Créer mon compte" onPress={onSubmit} loading={isLoading} style={{ marginTop: spacing.sm }} />

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Déjà inscrit ?</Text>
          <Text style={styles.footerLink} onPress={() => navigation.navigate('Login')}>
            {' '}
            Se connecter
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { flexGrow: 1, padding: spacing.xl, justifyContent: 'center' },
  logoWrap: { alignItems: 'center', marginBottom: spacing.xl },
  title: { color: colors.textPrimary, fontSize: 22, fontWeight: '800', marginBottom: spacing.xs },
  subtitle: { color: colors.textSecondary, fontSize: 14, marginBottom: spacing.xl },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg },
  footerText: { color: colors.textSecondary },
  footerLink: { color: colors.primary, fontWeight: '700' },
});
