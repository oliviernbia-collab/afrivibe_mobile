import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// En développement : adresse de la machine hôte XAMPP (adapter selon l'environnement
// — localhost ne fonctionne pas depuis un appareil/émulateur physique).
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('afrivibe_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface ApiErrorBody {
  message: string | string[];
  statusCode: number;
}
