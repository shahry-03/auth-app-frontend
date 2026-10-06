import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: Record<string, unknown> | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (user: Record<string, unknown>, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      login: (user, accessToken) => set({ user, accessToken, isAuthenticated: true }),
      logout: () => set({ user: null, accessToken: null, isAuthenticated: false }),
    }),
    { name: 'auth-storage' }
  )
);