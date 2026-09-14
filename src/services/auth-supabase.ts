import { supabase } from './supabase';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

// Complete auth session for OAuth
WebBrowser.maybeCompleteAuthSession();

/**
 * Sign in with Google using Supabase Auth
 * This opens a web browser for Google OAuth
 */
export const signInWithGoogle = async () => {
  try {
    // Get the redirect URL for your app
    const redirectUrl = Linking.createURL('/');
    
    console.log('🔐 Starting Google Sign-In with redirect:', redirectUrl);
    
    // Start OAuth flow
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: false,
      },
    });

    if (error) {
      console.error('❌ Google Sign-In Error:', error);
      throw error;
    }

    // Open the OAuth URL in browser
    if (data?.url) {
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUrl
      );

      if (result.type === 'success') {
        // Extract the token from the URL
        const url = result.url;
        console.log('✅ OAuth Success! URL:', url);
        
        // Supabase will automatically handle the session
        return { success: true };
      } else {
        console.log('⚠️ OAuth cancelled or failed:', result.type);
        return { success: false, cancelled: true };
      }
    }

    return { success: false };
  } catch (error) {
    console.error('❌ Sign-in with Google failed:', error);
    throw error;
  }
};

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return { user: data.user, session: data.session, error: null };
  } catch (error: any) {
    return { user: null, session: null, error: error.message };
  }
};

/**
 * Sign up with email and password
 */
export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    return { user: data.user, session: data.session, error: null };
  } catch (error: any) {
    return { user: null, session: null, error: error.message };
  }
};

/**
 * Sign out current user
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

/**
 * Get current session
 */
export const getSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { session, error: null };
  } catch (error: any) {
    return { session: null, error: error.message };
  }
};

/**
 * Get current user
 */
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

/**
 * Check if email is admin
 */
export const checkAdminStatus = (email: string): boolean => {
  const adminEmails = [
    'inform.growtogether@gmail.com',
    // Add more admin emails here if needed
  ];
  return adminEmails.includes(email.toLowerCase());
};

/**
 * Listen to auth state changes
 */
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback);
};


