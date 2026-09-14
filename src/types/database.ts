// Generated types from Supabase - will be replaced by actual generation
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          role: 'student' | 'volunteer'
          is_admin: boolean
          age: number
          current_grade: number
          school: string
          student_subject_preference: string
          availability: Json
          profile_completed_at: string | null
          volunteer_profile_completed_at: string | null
          created_at: string
          updated_at: string
          last_active_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          email: string
          first_name: string
          last_name: string
          role?: 'student' | 'volunteer'
          is_admin?: boolean
          age: number
          current_grade: number
          school: string
          student_subject_preference: string
          availability?: Json
          profile_completed_at?: string | null
          volunteer_profile_completed_at?: string | null
          created_at?: string
          updated_at?: string
          last_active_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          role?: 'student' | 'volunteer'
          is_admin?: boolean
          age?: number
          current_grade?: number
          school?: string
          student_subject_preference?: string
          availability?: Json
          profile_completed_at?: string | null
          volunteer_profile_completed_at?: string | null
          created_at?: string
          updated_at?: string
          last_active_at?: string
          deleted_at?: string | null
        }
      }
      volunteer_profiles: {
        Row: {
          id: string
          user_id: string
          subjects_to_tutor: Json
          grade_levels_comfortable: Json
          is_complete: boolean
          is_discoverable: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subjects_to_tutor?: Json
          grade_levels_comfortable?: Json
          is_complete?: boolean
          is_discoverable?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subjects_to_tutor?: Json
          grade_levels_comfortable?: Json
          is_complete?: boolean
          is_discoverable?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      chats: {
        Row: {
          id: string
          student_user_id: string
          volunteer_user_id: string
          created_by: string
          status: 'active' | 'student_closed' | 'volunteer_completed' | 'archived'
          closed_by: string | null
          closed_at: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_user_id: string
          volunteer_user_id: string
          created_by: string
          status?: 'active' | 'student_closed' | 'volunteer_completed' | 'archived'
          closed_by?: string | null
          closed_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_user_id?: string
          volunteer_user_id?: string
          created_by?: string
          status?: 'active' | 'student_closed' | 'volunteer_completed' | 'archived'
          closed_by?: string | null
          closed_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          chat_id: string
          sender_id: string
          content: string
          message_type: 'text' | 'system' | 'admin'
          read_at: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          chat_id: string
          sender_id: string
          content: string
          message_type?: 'text' | 'system' | 'admin'
          read_at?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          chat_id?: string
          sender_id?: string
          content?: string
          message_type?: 'text' | 'system' | 'admin'
          read_at?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      admin_action_logs: {
        Row: {
          id: string
          admin_user_id: string
          action_type: 'PROMOTE' | 'DEMOTE' | 'ADMIN_MESSAGE' | 'CHAT_ARCHIVE'
          target_user_id: string | null
          target_email: string | null
          metadata: Json
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          admin_user_id: string
          action_type: 'PROMOTE' | 'DEMOTE' | 'ADMIN_MESSAGE' | 'CHAT_ARCHIVE'
          target_user_id?: string | null
          target_email?: string | null
          metadata?: Json
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          admin_user_id?: string
          action_type?: 'PROMOTE' | 'DEMOTE' | 'ADMIN_MESSAGE' | 'CHAT_ARCHIVE'
          target_user_id?: string | null
          target_email?: string | null
          metadata?: Json
          description?: string | null
          created_at?: string
        }
      }
      schools: {
        Row: {
          id: string
          name: string
          district: string | null
          type: 'elementary' | 'middle' | 'high' | 'k12'
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          district?: string | null
          type?: 'elementary' | 'middle' | 'high' | 'k12'
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          district?: string | null
          type?: 'elementary' | 'middle' | 'high' | 'k12'
          is_active?: boolean
          created_at?: string
        }
      }
      subjects: {
        Row: {
          id: string
          name: string
          category: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      volunteer_matches: {
        Row: {
          student_id: string
          volunteer_id: string
          student_name: string
          volunteer_name: string
          current_grade: number
          school: string
          student_subject_preference: string
          subjects_to_tutor: Json
          grade_levels_comfortable: Json
          overlapping_days: number
          subject_match_score: number
        }
      }
    }
    Functions: {
      get_volunteer_matches: {
        Args: { student_id: string }
        Returns: {
          volunteer_id: string
          volunteer_name: string
          subjects: Json
          grade_levels: Json
          school: string
          overlapping_days: number
          subject_match_score: number
        }[]
      }
    }
  }
}

