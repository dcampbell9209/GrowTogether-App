import { supabase, handleSupabaseError } from '@/services/supabase';
import { VolunteerProfile, UserMatch } from '@/types';

class VolunteersService {
  // Create or update volunteer profile
  async createVolunteerProfile(
    userId: string, 
    profileData: {
      subjectsToTutor: string[];
      gradeLevelsComfortable: number[];
      isComplete: boolean;
      isDiscoverable: boolean;
    }
  ): Promise<{ data: VolunteerProfile | null; error: string | null }> {
    try {
      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('volunteer_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      let result;

      if (existingProfile) {
        // Update existing profile
        result = await supabase
          .from('volunteer_profiles')
          .update({
            subjects_to_tutor: profileData.subjectsToTutor,
            grade_levels_comfortable: profileData.gradeLevelsComfortable,
            is_complete: profileData.isComplete,
            is_discoverable: profileData.isDiscoverable,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId)
          .select()
          .single();
      } else {
        // Create new profile
        result = await supabase
          .from('volunteer_profiles')
          .insert({
            user_id: userId,
            subjects_to_tutor: profileData.subjectsToTutor,
            grade_levels_comfortable: profileData.gradeLevelsComfortable,
            is_complete: profileData.isComplete,
            is_discoverable: profileData.isDiscoverable,
          })
          .select()
          .single();
      }

      if (result.error) {
        return {
          data: null,
          error: handleSupabaseError(result.error),
        };
      }

      return {
        data: {
          subjectsToTutor: result.data.subjects_to_tutor,
          gradeLevelsComfortable: result.data.grade_levels_comfortable,
          isComplete: result.data.is_complete,
          isDiscoverable: result.data.is_discoverable,
        },
        error: null,
      };
    } catch (error: any) {
      console.error('Create volunteer profile error:', error);
      return {
        data: null,
        error: error.message || 'Failed to create volunteer profile',
      };
    }
  }

  // Get volunteer profile
  async getVolunteerProfile(userId: string): Promise<{ data: VolunteerProfile | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('volunteer_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        return {
          data: null,
          error: handleSupabaseError(error),
        };
      }

      if (!data) {
        return {
          data: null,
          error: null,
        };
      }

      return {
        data: {
          subjectsToTutor: data.subjects_to_tutor,
          gradeLevelsComfortable: data.grade_levels_comfortable,
          isComplete: data.is_complete,
          isDiscoverable: data.is_discoverable,
        },
        error: null,
      };
    } catch (error: any) {
      console.error('Get volunteer profile error:', error);
      return {
        data: null,
        error: error.message || 'Failed to get volunteer profile',
      };
    }
  }

  // Get volunteer matches for a student
  async getVolunteerMatches(studentId: string): Promise<{ data: UserMatch[]; error: string | null }> {
    try {
      // Use the database function for optimized matching
      const { data, error } = await supabase
        .rpc('get_volunteer_matches', { student_id: studentId });

      if (error) {
        return {
          data: [],
          error: handleSupabaseError(error),
        };
      }

      const matches: UserMatch[] = data.map((match: any) => ({
        volunteerId: match.volunteer_id,
        volunteerName: match.volunteer_name,
        subjects: Array.isArray(match.subjects) ? match.subjects : [],
        gradeLevels: Array.isArray(match.grade_levels) ? match.grade_levels : [],
        school: match.school,
        overlappingDays: match.overlapping_days,
        subjectMatchScore: match.subject_match_score,
      }));

      return {
        data: matches,
        error: null,
      };
    } catch (error: any) {
      console.error('Get volunteer matches error:', error);
      return {
        data: [],
        error: error.message || 'Failed to get volunteer matches',
      };
    }
  }

  // Update volunteer discoverability
  async updateDiscoverability(
    userId: string, 
    isDiscoverable: boolean
  ): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('volunteer_profiles')
        .update({
          is_discoverable: isDiscoverable,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (error) {
        return { error: handleSupabaseError(error) };
      }

      return { error: null };
    } catch (error: any) {
      console.error('Update discoverability error:', error);
      return { error: error.message || 'Failed to update discoverability' };
    }
  }

  // Get all discoverable volunteers (for admin use)
  async getDiscoverableVolunteers(): Promise<{ data: any[]; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          first_name,
          last_name,
          email,
          school,
          volunteer_profiles!inner (
            subjects_to_tutor,
            grade_levels_comfortable,
            is_complete,
            is_discoverable
          )
        `)
        .eq('role', 'volunteer')
        .eq('volunteer_profiles.is_discoverable', true)
        .eq('volunteer_profiles.is_complete', true);

      if (error) {
        return {
          data: [],
          error: handleSupabaseError(error),
        };
      }

      return {
        data: data || [],
        error: null,
      };
    } catch (error: any) {
      console.error('Get discoverable volunteers error:', error);
      return {
        data: [],
        error: error.message || 'Failed to get discoverable volunteers',
      };
    }
  }

  // Search volunteers by criteria
  async searchVolunteers(criteria: {
    subject?: string;
    gradeLevel?: number;
    school?: string;
  }): Promise<{ data: any[]; error: string | null }> {
    try {
      let query = supabase
        .from('users')
        .select(`
          id,
          first_name,
          last_name,
          school,
          availability,
          volunteer_profiles!inner (
            subjects_to_tutor,
            grade_levels_comfortable,
            is_complete,
            is_discoverable
          )
        `)
        .eq('role', 'volunteer')
        .eq('volunteer_profiles.is_discoverable', true)
        .eq('volunteer_profiles.is_complete', true);

      // Apply filters
      if (criteria.school) {
        query = query.eq('school', criteria.school);
      }

      const { data, error } = await query;

      if (error) {
        return {
          data: [],
          error: handleSupabaseError(error),
        };
      }

      // Filter by subject and grade level on the client side
      // (since JSONB queries can be complex in Supabase)
      let filteredData = data || [];

      if (criteria.subject) {
        filteredData = filteredData.filter(volunteer => 
          volunteer.volunteer_profiles[0]?.subjects_to_tutor?.includes(criteria.subject)
        );
      }

      if (criteria.gradeLevel) {
        filteredData = filteredData.filter(volunteer => 
          volunteer.volunteer_profiles[0]?.grade_levels_comfortable?.includes(criteria.gradeLevel)
        );
      }

      return {
        data: filteredData,
        error: null,
      };
    } catch (error: any) {
      console.error('Search volunteers error:', error);
      return {
        data: [],
        error: error.message || 'Failed to search volunteers',
      };
    }
  }

  // Get volunteer statistics (for admin dashboard)
  async getVolunteerStats(): Promise<{ 
    data: {
      totalVolunteers: number;
      activeVolunteers: number;
      totalSessions: number;
      totalHours: number;
    } | null; 
    error: string | null 
  }> {
    try {
      // Get total volunteers
      const { count: totalVolunteers, error: totalError } = await supabase
        .from('users')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'volunteer');

      if (totalError) {
        return { data: null, error: handleSupabaseError(totalError) };
      }

      // Get active volunteers (discoverable)
      const { count: activeVolunteers, error: activeError } = await supabase
        .from('volunteer_profiles')
        .select('id', { count: 'exact', head: true })
        .eq('is_discoverable', true)
        .eq('is_complete', true);

      if (activeError) {
        return { data: null, error: handleSupabaseError(activeError) };
      }

      // Get completed chats (sessions)
      const { count: totalSessions, error: sessionsError } = await supabase
        .from('chats')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'volunteer_completed');

      if (sessionsError) {
        return { data: null, error: handleSupabaseError(sessionsError) };
      }

      return {
        data: {
          totalVolunteers: totalVolunteers || 0,
          activeVolunteers: activeVolunteers || 0,
          totalSessions: totalSessions || 0,
          totalHours: (totalSessions || 0) * 1, // Assume 1 hour per session for now
        },
        error: null,
      };
    } catch (error: any) {
      console.error('Get volunteer stats error:', error);
      return {
        data: null,
        error: error.message || 'Failed to get volunteer statistics',
      };
    }
  }
}

export const volunteersService = new VolunteersService();






