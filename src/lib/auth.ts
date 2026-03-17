import apiRoutes from '@/api/apiRoutes.ts';
import apiService from '@/api/apiService.ts';
import { type UserModelTypes } from "@/types/UserModelTypes"
import { create } from 'zustand';
import { persist } from 'zustand/middleware';



interface AuthState {
  user: UserModelTypes | null;
  isAuthenticated: boolean;
  login: (user: UserModelTypes) => Promise<void>;
  logout: (userToken?: string | null) => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (user: UserModelTypes) => {
        try {
          set({
            user: user,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('Login error:', error);
        }
      },
      logout: async (userToken?: string | null) => {
        if (userToken) {
          try {
            await apiService.post({ url: apiRoutes.admin.app.profile.logout }, { userToken: userToken ?? "" });
            set({ user: null, isAuthenticated: false });
          } catch (error) {
            set({ user: null, isAuthenticated: false });
          }
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
