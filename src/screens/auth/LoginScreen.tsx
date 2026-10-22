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

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const { login, isLoading } = useAuthStore();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async () => {
    try {
      await login(identifier.trim(), password);
    } catch (error) {
      Alert.alert('Connexion impossible', extractErrorMessage(error));
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.logoWrap}>
          <Logo size="lg" withTagline />
        </View>

        <Text style={styles.title}>Content de vous revoir</Text>
        <Text style={styles.subtitle}>Connectez-vous pour continuer à créer, partager et gagner.</Text>

        <TextField
          label="Téléphone, e-mail ou pseudo"
          placeholder="ex: +225 07 00 00 00 00"
          autoCapitalize="none"
          value={identifier}
          onChangeText={setIdentifier}
        />
        <TextField
          label="Mot de passe"
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Button label="Se connecter" onPress={onSubmit} loading={isLoading} style={{ marginTop: spacing.sm }} />

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Pas encore de compte ?</Text>
          <Text style={styles.footerLink} onPress={() => navigation.navigate('Register')}>
            {' '}
            Créer un compte
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { flexGrow: 1, padding: spacing.xl, justifyContent: 'center' },
  logoWrap: { alignItems: 'center', marginBottom: spacing.xxl },
  title: { color: colors.textPrimary, fontSize: 22, fontWeight: '800', marginBottom: spacing.xs },
  subtitle: { color: colors.textSecondary, fontSize: 14, marginBottom: spacing.xl },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg },
  footerText: { color: colors.textSecondary },
  footerLink: { color: colors.primary, fontWeight: '700' },
});
