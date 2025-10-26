import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import { supabase, handleSupabaseError } from '@/services/supabase';
import { AuthUser, AuthSession, AuthResponse, GoogleAuthResponse, UserProfile } from '@/types';

// Configure WebBrowser for Google OAuth
WebBrowser.maybeCompleteAuthSession();

class AuthService {
  private googleConfig = {
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || 'mock-web-client-id',
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || 'mock-ios-client-id',
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || 'mock-android-client-id',
  };

  // Initialize Google Auth Request
  private createGoogleAuthRequest() {
    return Google.useAuthRequest({
      webClientId: this.googleConfig.webClientId,
      iosClientId: this.googleConfig.iosClientId,
      androidClientId: this.googleConfig.androidClientId,
      scopes: ['openid', 'profile', 'email'],
      redirectUri: makeRedirectUri({
        scheme: 'growtogether',
        path: 'auth/callback',
      }),
    });
  }

  // Mock sign in for development
  private async mockSignIn(): Promise<AuthResponse> {
    const mockUser: AuthUser = {
      id: 'mock-user-id',
      email: 'demo@growtogether.com',
      firstName: 'Demo',
      lastName: 'User',
      role: 'student',
      isAdmin: false,
      age: 16,
      currentGrade: 10,
      school: 'Demo High School',
      studentSubjectPreference: 'Math',
      availability: {
        mon: true,
        tue: true,
        wed: false,
        thu: true,
        fri: false,
        sat: true,
        sun: false,
      },
      profileCompletedAt: new Date().toISOString(),
      volunteerProfileCompletedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const mockSession: AuthSession = {
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      token_type: 'bearer',
      user: mockUser,
    };

    return {
      user: mockUser,
      session: mockSession,
      error: null,
    };
  }

  // Sign in with Google
  async signInWithGoogle(): Promise<AuthResponse> {
    try {
      // Mock authentication for development
      if (process.env.EXPO_PUBLIC_ENVIRONMENT === 'development' && 
          supabaseUrl.includes('mock-project')) {
        console.log('🔧 Using mock authentication for development');
        return this.mockSignIn();
      }

      // Create auth request
      const [request, response, promptAsync] = this.createGoogleAuthRequest();

      if (!request) {
        return {
          user: null,
          session: null,
          error: {
            message: 'Failed to initialize Google authentication',
            code: 'GOOGLE_AUTH_INIT_ERROR',
          },
        };
      }

      // Prompt for authentication
      const result = await promptAsync();

      if (result.type === 'success') {
        const { id_token } = result.params;

        if (!id_token) {
          return {
            user: null,
            session: null,
            error: {
              message: 'No ID token received from Google',
              code: 'GOOGLE_AUTH_NO_TOKEN',
            },
          };
        }

        // Sign in with Supabase using Google ID token
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: id_token,
        });

        if (error) {
          return {
            user: null,
            session: null,
            error: {
              message: handleSupabaseError(error),
              code: error.message,
            },
          };
        }

        if (data.user && data.session) {
          // Check if user profile exists
          let userProfile = await this.getUserProfile(data.user.id);

          // Create profile if it doesn't exist
          if (!userProfile.data) {
            const newProfile = await this.createUserProfile({
              id: data.user.id,
              email: data.user.email!,
              firstName: data.user.user_metadata?.given_name || '',
              lastName: data.user.user_metadata?.family_name || '',
              role: 'student',
              isAdmin: await this.checkAdminStatus(data.user.email!),
              age: 0,
              currentGrade: 1,
              school: '',
              studentSubjectPreference: '',
              availability: {
                mon: false,
                tue: false,
                wed: false,
                thu: false,
                fri: false,
                sat: false,
                sun: false,
              },
              profileCompletedAt: null,
              volunteerProfileCompletedAt: null,
              createdAt: new Date(),
              updatedAt: new Date(),
              lastActiveAt: new Date(),
            });

            if (newProfile.error) {
              return {
                user: null,
                session: null,
                error: {
                  message: newProfile.error,
                  code: 'PROFILE_CREATION_ERROR',
                },
              };
            }

            userProfile = newProfile;
          }

          // Create AuthUser and AuthSession
          const authUser: AuthUser = {
            id: data.user.id,
            email: data.user.email!,
            firstName: userProfile.data!.firstName,
            lastName: userProfile.data!.lastName,
            role: userProfile.data!.role,
            isAdmin: userProfile.data!.isAdmin,
            profileCompleted: !!userProfile.data!.profileCompletedAt,
            volunteerProfileCompleted: !!userProfile.data!.volunteerProfileCompletedAt,
          };

          const authSession: AuthSession = {
            user: authUser,
            accessToken: data.session.access_token,
            refreshToken: data.session.refresh_token,
            expiresAt: new Date(data.session.expires_at! * 1000).getTime(),
          };

          return {
            user: authUser,
            session: authSession,
            error: null,
          };
        }
      } else if (result.type === 'cancel') {
        return {
          user: null,
          session: null,
          error: {
            message: 'Authentication was cancelled',
            code: 'AUTH_CANCELLED',
          },
        };
      }

      return {
        user: null,
        session: null,
        error: {
          message: 'Authentication failed',
          code: 'AUTH_FAILED',
        },
      };
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      return {
        user: null,
        session: null,
        error: {
          message: error.message || 'An unexpected error occurred',
          code: error.code || 'UNKNOWN_ERROR',
        },
      };
    }
  }

  // Get user profile from database
  async getUserProfile(userId: string): Promise<{ data: any | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          volunteer_profiles (
            subjects_to_tutor,
            grade_levels_comfortable,
            is_complete,
            is_discoverable
          )
        `)
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        return {
          data: null,
          error: handleSupabaseError(error),
        };
      }

      return {
        data: data ? {
          id: data.id,
          email: data.email,
          firstName: data.first_name,
          lastName: data.last_name,
          role: data.role,
          isAdmin: data.is_admin,
          age: data.age,
          currentGrade: data.current_grade,
          school: data.school,
          studentSubjectPreference: data.student_subject_preference,
          availability: data.availability,
          volunteerProfile: data.volunteer_profiles?.[0] ? {
            subjectsToTutor: data.volunteer_profiles[0].subjects_to_tutor,
            gradeLevelsComfortable: data.volunteer_profiles[0].grade_levels_comfortable,
            isComplete: data.volunteer_profiles[0].is_complete,
            isDiscoverable: data.volunteer_profiles[0].is_discoverable,
          } : undefined,
          profileCompletedAt: data.profile_completed_at ? new Date(data.profile_completed_at) : null,
          volunteerProfileCompletedAt: data.volunteer_profile_completed_at ? new Date(data.volunteer_profile_completed_at) : null,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
          lastActiveAt: new Date(data.last_active_at),
        } : null,
        error: null,
      };
    } catch (error: any) {
      console.error('Get user profile error:', error);
      return {
        data: null,
        error: error.message || 'Failed to get user profile',
      };
    }
  }

  // Create new user profile
  async createUserProfile(profile: any): Promise<{ data: any | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: profile.id,
          email: profile.email,
          first_name: profile.firstName,
          last_name: profile.lastName,
          role: profile.role,
          is_admin: profile.isAdmin,
          age: profile.age,
          current_grade: profile.currentGrade,
          school: profile.school,
          student_subject_preference: profile.studentSubjectPreference,
          availability: profile.availability,
          profile_completed_at: profile.profileCompletedAt,
          volunteer_profile_completed_at: profile.volunteerProfileCompletedAt,
        })
        .select()
        .single();

      if (error) {
        return {
          data: null,
          error: handleSupabaseError(error),
        };
      }

      return {
        data: {
          id: data.id,
          email: data.email,
          firstName: data.first_name,
          lastName: data.last_name,
          role: data.role,
          isAdmin: data.is_admin,
          age: data.age,
          currentGrade: data.current_grade,
          school: data.school,
          studentSubjectPreference: data.student_subject_preference,
          availability: data.availability,
          profileCompletedAt: data.profile_completed_at ? new Date(data.profile_completed_at) : null,
          volunteerProfileCompletedAt: data.volunteer_profile_completed_at ? new Date(data.volunteer_profile_completed_at) : null,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
          lastActiveAt: new Date(data.last_active_at),
        },
        error: null,
      };
    } catch (error: any) {
      console.error('Create user profile error:', error);
      return {
        data: null,
        error: error.message || 'Failed to create user profile',
      };
    }
  }

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<any>): Promise<{ error: string | null }> {
    try {
      const updateData: any = {};

      // Map updates to database fields
      if (updates.firstName !== undefined) updateData.first_name = updates.firstName;
      if (updates.lastName !== undefined) updateData.last_name = updates.lastName;
      if (updates.age !== undefined) updateData.age = updates.age;
      if (updates.currentGrade !== undefined) updateData.current_grade = updates.currentGrade;
      if (updates.school !== undefined) updateData.school = updates.school;
      if (updates.studentSubjectPreference !== undefined) updateData.student_subject_preference = updates.studentSubjectPreference;
      if (updates.availability !== undefined) updateData.availability = updates.availability;
      if (updates.profileCompleted !== undefined) updateData.profile_completed_at = updates.profileCompleted ? new Date().toISOString() : null;
      if (updates.volunteerProfileCompleted !== undefined) updateData.volunteer_profile_completed_at = updates.volunteerProfileCompleted ? new Date().toISOString() : null;

      updateData.updated_at = new Date().toISOString();
      updateData.last_active_at = new Date().toISOString();

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId);

      if (error) {
        return { error: handleSupabaseError(error) };
      }

      return { error: null };
    } catch (error: any) {
      console.error('Update user profile error:', error);
      return { error: error.message || 'Failed to update user profile' };
    }
  }

  // Check if email is in admin allowlist
  private async checkAdminStatus(email: string): Promise<boolean> {
    const adminEmails = [
      'inform.growtogether@gmail.com',  // Main admin email
      'admin@growtogether.com',         // Additional admin emails
    ];
    
    return adminEmails.includes(email.toLowerCase());
  }

  // Sign out
  async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return { error: handleSupabaseError(error) };
      }

      return { error: null };
    } catch (error: any) {
      console.error('Sign out error:', error);
      return { error: error.message || 'Failed to sign out' };
    }
  }

  // Get current session
  async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        return { session: null, error: handleSupabaseError(error) };
      }

      return { session, error: null };
    } catch (error: any) {
      console.error('Get current session error:', error);
      return { 
        session: null, 
        error: error.message || 'Failed to get current session' 
      };
    }
  }

  // Refresh session
  async refreshSession() {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      
      if (error) {
        return { session: null, error: handleSupabaseError(error) };
      }

      return { session, error: null };
    } catch (error: any) {
      console.error('Refresh session error:', error);
      return { 
        session: null, 
        error: error.message || 'Failed to refresh session' 
      };
    }
  }
}

export const authService = new AuthService();

