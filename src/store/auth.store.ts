import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '../types';
import { authApi } from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => Promise<void>;
  refreshToken: () => Promise<string | null>;
  checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      setAuth: (user, token) => {
        if (!token) {
          console.error('No token provided to setAuth');
          return;
        }
        localStorage.setItem('token', token);
        set({ 
          user, 
          token,
          isAuthenticated: true,
          isLoading: false
        });
      },

      logout: async () => {
        try {
          // First clear the token and auth state
          localStorage.removeItem('token');
          localStorage.removeItem('auth-storage');
          
          // Reset the auth state
          set({ 
            user: null, 
            token: null,
            isAuthenticated: false,
            isLoading: false
          });

          // Then make the logout API call
          await authApi.logout().catch(error => {
            console.error('Error calling logout API:', error);
          });

          // Redirect to login
          window.location.href = '/login';
        } catch (error) {
          console.error('Error during logout:', error);
          // Ensure state is cleared even if there's an error
          set({ 
            user: null, 
            token: null,
            isAuthenticated: false,
            isLoading: false
          });
          window.location.href = '/login';
        }
      },

      refreshToken: async () => {
        try {
          const response = await authApi.refresh();
          if (response?.data?.token) {
            const { token } = response.data;
            localStorage.setItem('token', token);
            set({ token, isAuthenticated: true });
            return token;
          }
          throw new Error('No token in refresh response');
        } catch (error) {
          console.error('Error refreshing token:', error);
          await get().logout();
          return null;
        }
      },

      checkAuth: async () => {
        try {
          set({ isLoading: true });
          const token = localStorage.getItem('token');
          
          if (!token) {
            set({ isAuthenticated: false, isLoading: false });
            return false;
          }

          const response = await authApi.getProfile();
          
          if (response?.data) {
            set({ 
              user: response.data,
              token,
              isAuthenticated: true,
              isLoading: false
            });
            return true;
          }
          
          throw new Error('Invalid profile response');
        } catch (error) {
          console.error('Error checking auth:', error);
          try {
            const newToken = await get().refreshToken();
            if (newToken) {
              return true;
            }
          } catch (refreshError) {
            console.error('Error refreshing token:', refreshError);
          }
          await get().logout();
          return false;
        } finally {
          set({ isLoading: false });
        }
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
