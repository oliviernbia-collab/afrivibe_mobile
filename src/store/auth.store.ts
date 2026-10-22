import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { apiClient } from '../api/client';

export interface AuthUser {
  id: string;
  pseudo: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: string;
  isVerified: boolean;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isHydrated: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (payload: {
    phone?: string;
    email?: string;
    password: string;
    pseudo: string;
    fullName?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isHydrated: false,

  hydrate: async () => {
    const token = await SecureStore.getItemAsync('afrivibe_token');
    const userJson = await SecureStore.getItemAsync('afrivibe_user');
    if (token && userJson) {
      set({ user: JSON.parse(userJson) });
    }
    set({ isHydrated: true });
  },

  login: async (identifier, password) => {
    set({ isLoading: true });
    try {
      const { data } = await apiClient.post('/auth/login', { identifier, password });
      await SecureStore.setItemAsync('afrivibe_token', data.accessToken);
      await SecureStore.setItemAsync('afrivibe_user', JSON.stringify(data.user));
      set({ user: data.user });
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (payload) => {
    set({ isLoading: true });
    try {
      const { data } = await apiClient.post('/auth/register', payload);
      await SecureStore.setItemAsync('afrivibe_token', data.accessToken);
      await SecureStore.setItemAsync('afrivibe_user', JSON.stringify(data.user));
      set({ user: data.user });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('afrivibe_token');
    await SecureStore.deleteItemAsync('afrivibe_user');
    set({ user: null });
  },
}));
