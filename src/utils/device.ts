import * as SecureStore from 'expo-secure-store';

/**
 * Identifiant d'appareil persistant utilisé comme signal anti-fraude côté
 * API (§3 : "un compte par appareil", vues/likes uniques). Une intégration
 * production branchera un identifiant matériel (expo-application) en plus
 * de cette valeur générée.
 */
export async function getDeviceFingerprint(): Promise<string> {
  const key = 'afrivibe_device_fingerprint';
  const existing = await SecureStore.getItemAsync(key);
  if (existing) return existing;

  const generated = `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
  await SecureStore.setItemAsync(key, generated);
  return generated;
}
