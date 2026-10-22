import { apiClient } from './client';
import { Vibe } from '../types/models';

export const vibesApi = {
  forYou: (limit = 10, offset = 0) =>
    apiClient.get<Vibe[]>('/vibes/for-you', { params: { limit, offset } }).then((r) => r.data),
  like: (vibeId: string) => apiClient.post(`/vibes/${vibeId}/like`).then((r) => r.data),
  unlike: (vibeId: string) => apiClient.post(`/vibes/${vibeId}/unlike`).then((r) => r.data),
  recordView: (vibeId: string, deviceFingerprint: string, watchSeconds: number) =>
    apiClient.post(`/vibes/${vibeId}/view`, { deviceFingerprint, watchSeconds }).then((r) => r.data),
};
