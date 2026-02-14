import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, CurrentUser, Tokens } from '@/types/models';

interface AuthState {
  user: User | null;
  currentUser: CurrentUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setCurrentUser: (currentUser: CurrentUser | null) => void;
  setTokens: (tokens: Tokens) => void;
  setIsLoading: (isLoading: boolean) => void;
  login: (user: User, tokens: Tokens) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      currentUser: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setCurrentUser: (currentUser) => set({ currentUser }),
      
      setTokens: (tokens) => {
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
      },
      
      setIsLoading: (isLoading) => set({ isLoading }),
      
      login: (user, tokens) => {
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        set({ 
          user, 
          isAuthenticated: true,
          currentUser: {
            userId: user.id,
            email: user.email,
            username: user.username,
          }
        });
      },
      
      logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({ 
          user: null, 
          currentUser: null, 
          isAuthenticated: false 
        });
      },
      
      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null,
      })),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
