import { create } from 'zustand';

interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: 'student' | 'volunteer' | 'admin';
  phone?: string;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, data: any) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ isLoading: loading }),

  initializeAuth: () => {
    // Mock initialization - just set loading to false
    set({ isLoading: false });
  },

  signIn: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      // Mock sign in - create a fake user
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({
        user: {
          id: '1',
          email: email,
          firstName: 'Test',
          lastName: 'User',
          role: 'student',
        },
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signUp: async (email: string, password: string, data: any) => {
    set({ isLoading: true });
    try {
      // Mock sign up - create a fake user
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({
        user: {
          id: '1',
          email: email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
        },
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signInWithGoogle: async () => {
    set({ isLoading: true });
    try {
      // Mock Google sign in
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({
        user: {
          id: '1',
          email: 'test@gmail.com',
          firstName: 'Google',
          lastName: 'User',
          role: 'student',
        },
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signOut: async () => {
    set({ user: null, isLoading: false });
  },
}));
