import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Database } from '@/types/database';

// Use environment variables or fallback to mock values for development
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://mock-project.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key-for-development';

console.log('🔧 Supabase Configuration:', {
  url: supabaseUrl,
  hasKey: !!supabaseAnonKey,
  isMock: supabaseUrl.includes('mock-project')
});

// Custom storage adapter for Expo SecureStore
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    return SecureStore.deleteItemAsync(key);
  },
};

// Create Supabase client with custom auth storage
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storage: ExpoSecureStoreAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        'X-Client-Info': 'growtogether-mobile',
      },
    },
  }
);

// Helper functions for common operations
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const refreshSession = async () => {
  const { data: { session }, error } = await supabase.auth.refreshSession();
  return { session, error };
};

// Real-time subscription helpers
export const subscribeToTable = <T>(
  table: keyof Database['public']['Tables'],
  callback: (payload: any) => void,
  filter?: string
) => {
  let subscription = supabase
    .channel(`${table}-changes`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: table as string,
        filter: filter,
      },
      callback
    );

  return subscription.subscribe();
};

export const unsubscribeFromChannel = (subscription: any) => {
  return supabase.removeChannel(subscription);
};

// Error handling helper
export const handleSupabaseError = (error: any): string => {
  if (!error) return '';
  
  // Handle common Supabase error codes
  switch (error.code) {
    case '23505':
      return 'This record already exists.';
    case '23503':
      return 'Referenced record not found.';
    case 'PGRST116':
      return 'No records found.';
    case 'PGRST301':
      return 'Row level security violation.';
    default:
      return error.message || 'An unexpected error occurred.';
  }
};

// Type-safe query builders
export const createTypedQuery = () => {
  return {
    users: () => supabase.from('users'),
    volunteer_profiles: () => supabase.from('volunteer_profiles'),
    chats: () => supabase.from('chats'),
    messages: () => supabase.from('messages'),
    admin_action_logs: () => supabase.from('admin_action_logs'),
    schools: () => supabase.from('schools'),
    subjects: () => supabase.from('subjects'),
  };
};

export const db = createTypedQuery();

