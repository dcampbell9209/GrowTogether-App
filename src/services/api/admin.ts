import { supabase, handleSupabaseError } from '@/services/supabase';

// Types for admin functionality
export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'volunteer';
  isAdmin: boolean;
  age: number;
  currentGrade: number;
  school: string;
  studentSubjectPreference: string;
  availability: any;
  profileCompleted: boolean;
  volunteerProfileCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastActiveAt: Date;
}

export interface AdminChat {
  id: string;
  studentUserId: string;
  volunteerUserId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  studentName: string;
  volunteerName: string;
  messageCount: number;
}

export interface AdminStats {
  totalUsers: number;
  totalStudents: number;
  totalVolunteers: number;
  totalChats: number;
  activeChats: number;
  completedChats: number;
  totalMessages: number;
  totalVolunteerHours: number;
}

export interface AdminActionLog {
  id: string;
  adminUserId: string;
  actionType: 'PROMOTE' | 'DEMOTE' | 'ADMIN_MESSAGE' | 'CHAT_ARCHIVE';
  targetUserId?: string;
  targetEmail?: string;
  metadata: any;
  description?: string;
  createdAt: Date;
}

class AdminService {
  // Get all users with admin details
  async getAllUsers(): Promise<{ data: AdminUser[]; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return {
          data: [],
          error: handleSupabaseError(error),
        };
      }

      const users: AdminUser[] = (data || []).map(user => ({
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        isAdmin: user.is_admin,
        age: user.age,
        currentGrade: user.current_grade,
        school: user.school,
        studentSubjectPreference: user.student_subject_preference,
        availability: user.availability,
        profileCompleted: !!user.profile_completed_at,
        volunteerProfileCompleted: !!user.volunteer_profile_completed_at,
        createdAt: new Date(user.created_at),
        updatedAt: new Date(user.updated_at),
        lastActiveAt: new Date(user.last_active_at),
      }));

      return {
        data: users,
        error: null,
      };
    } catch (error: any) {
      console.error('Get all users error:', error);
      return {
        data: [],
        error: error.message || 'Failed to get users',
      };
    }
  }

  // Get user by ID
  async getUserById(userId: string): Promise<{ data: AdminUser | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        return {
          data: null,
          error: handleSupabaseError(error),
        };
      }

      const user: AdminUser = {
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
        profileCompleted: !!data.profile_completed_at,
        volunteerProfileCompleted: !!data.volunteer_profile_completed_at,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        lastActiveAt: new Date(data.last_active_at),
      };

      return {
        data: user,
        error: null,
      };
    } catch (error: any) {
      console.error('Get user by ID error:', error);
      return {
        data: null,
        error: error.message || 'Failed to get user',
      };
    }
  }

  // Update user role
  async updateUserRole(
    userId: string,
    role: 'student' | 'volunteer',
    adminUserId: string
  ): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          role,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) {
        return { error: handleSupabaseError(error) };
      }

      // Log the action
      await this.logAdminAction({
        adminUserId,
        actionType: role === 'volunteer' ? 'PROMOTE' : 'DEMOTE',
        targetUserId: userId,
        description: `Changed user role to ${role}`,
        metadata: { newRole: role },
      });

      return { error: null };
    } catch (error: any) {
      console.error('Update user role error:', error);
      return { error: error.message || 'Failed to update user role' };
    }
  }

  // Toggle admin status
  async toggleAdminStatus(
    userId: string,
    adminUserId: string
  ): Promise<{ error: string | null }> {
    try {
      // Get current admin status
      const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', userId)
        .single();

      if (fetchError) {
        return { error: handleSupabaseError(fetchError) };
      }

      const newAdminStatus = !user.is_admin;

      const { error } = await supabase
        .from('users')
        .update({
          is_admin: newAdminStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) {
        return { error: handleSupabaseError(error) };
      }

      // Log the action
      await this.logAdminAction({
        adminUserId,
        actionType: newAdminStatus ? 'PROMOTE' : 'DEMOTE',
        targetUserId: userId,
        description: `${newAdminStatus ? 'Granted' : 'Revoked'} admin privileges`,
        metadata: { isAdmin: newAdminStatus },
      });

      return { error: null };
    } catch (error: any) {
      console.error('Toggle admin status error:', error);
      return { error: error.message || 'Failed to toggle admin status' };
    }
  }

  // Get all chats with user details
  async getAllChats(): Promise<{ data: AdminChat[]; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('chats')
        .select(`
          *,
          student:users!chats_student_user_id_fkey(first_name, last_name),
          volunteer:users!chats_volunteer_user_id_fkey(first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        return {
          data: [],
          error: handleSupabaseError(error),
        };
      }

      const chats: AdminChat[] = (data || []).map(chat => ({
        id: chat.id,
        studentUserId: chat.student_user_id,
        volunteerUserId: chat.volunteer_user_id,
        status: chat.status,
        createdAt: new Date(chat.created_at),
        updatedAt: new Date(chat.updated_at),
        studentName: `${chat.student?.first_name || ''} ${chat.student?.last_name || ''}`.trim(),
        volunteerName: `${chat.volunteer?.first_name || ''} ${chat.volunteer?.last_name || ''}`.trim(),
        messageCount: 0, // This would need a separate query to get actual count
      }));

      return {
        data: chats,
        error: null,
      };
    } catch (error: any) {
      console.error('Get all chats error:', error);
      return {
        data: [],
        error: error.message || 'Failed to get chats',
      };
    }
  }

  // Archive a chat
  async archiveChat(
    chatId: string,
    adminUserId: string
  ): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('chats')
        .update({
          status: 'archived',
          updated_at: new Date().toISOString(),
        })
        .eq('id', chatId);

      if (error) {
        return { error: handleSupabaseError(error) };
      }

      // Log the action
      await this.logAdminAction({
        adminUserId,
        actionType: 'CHAT_ARCHIVE',
        description: `Archived chat ${chatId}`,
        metadata: { chatId },
      });

      return { error: null };
    } catch (error: any) {
      console.error('Archive chat error:', error);
      return { error: error.message || 'Failed to archive chat' };
    }
  }

  // Send admin message to a user
  async sendAdminMessage(
    userId: string,
    message: string,
    adminUserId: string
  ): Promise<{ error: string | null }> {
    try {
      // This would create a system message in a chat or notification
      // For now, we'll log the action
      await this.logAdminAction({
        adminUserId,
        actionType: 'ADMIN_MESSAGE',
        targetUserId: userId,
        description: `Sent admin message: ${message}`,
        metadata: { message },
      });

      return { error: null };
    } catch (error: any) {
      console.error('Send admin message error:', error);
      return { error: error.message || 'Failed to send admin message' };
    }
  }

  // Get admin statistics
  async getAdminStats(): Promise<{ data: AdminStats | null; error: string | null }> {
    try {
      // Get user counts
      const { count: totalUsers, error: usersError } = await supabase
        .from('users')
        .select('id', { count: 'exact', head: true });

      if (usersError) {
        return { data: null, error: handleSupabaseError(usersError) };
      }

      const { count: totalStudents, error: studentsError } = await supabase
        .from('users')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'student');

      if (studentsError) {
        return { data: null, error: handleSupabaseError(studentsError) };
      }

      const { count: totalVolunteers, error: volunteersError } = await supabase
        .from('users')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'volunteer');

      if (volunteersError) {
        return { data: null, error: handleSupabaseError(volunteersError) };
      }

      // Get chat counts
      const { count: totalChats, error: chatsError } = await supabase
        .from('chats')
        .select('id', { count: 'exact', head: true });

      if (chatsError) {
        return { data: null, error: handleSupabaseError(chatsError) };
      }

      const { count: activeChats, error: activeChatsError } = await supabase
        .from('chats')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'active');

      if (activeChatsError) {
        return { data: null, error: handleSupabaseError(activeChatsError) };
      }

      const { count: completedChats, error: completedChatsError } = await supabase
        .from('chats')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'volunteer_completed');

      if (completedChatsError) {
        return { data: null, error: handleSupabaseError(completedChatsError) };
      }

      // Get message count
      const { count: totalMessages, error: messagesError } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .is('deleted_at', null);

      if (messagesError) {
        return { data: null, error: handleSupabaseError(messagesError) };
      }

      const stats: AdminStats = {
        totalUsers: totalUsers || 0,
        totalStudents: totalStudents || 0,
        totalVolunteers: totalVolunteers || 0,
        totalChats: totalChats || 0,
        activeChats: activeChats || 0,
        completedChats: completedChats || 0,
        totalMessages: totalMessages || 0,
        totalVolunteerHours: (completedChats || 0) * 1, // Assume 1 hour per completed chat
      };

      return {
        data: stats,
        error: null,
      };
    } catch (error: any) {
      console.error('Get admin stats error:', error);
      return {
        data: null,
        error: error.message || 'Failed to get admin statistics',
      };
    }
  }

  // Get admin action logs
  async getAdminActionLogs(): Promise<{ data: AdminActionLog[]; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('admin_action_logs')
        .select(`
          *,
          admin_user:users!admin_action_logs_admin_user_id_fkey(first_name, last_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        return {
          data: [],
          error: handleSupabaseError(error),
        };
      }

      const logs: AdminActionLog[] = (data || []).map(log => ({
        id: log.id,
        adminUserId: log.admin_user_id,
        actionType: log.action_type,
        targetUserId: log.target_user_id,
        targetEmail: log.target_email,
        metadata: log.metadata,
        description: log.description,
        createdAt: new Date(log.created_at),
      }));

      return {
        data: logs,
        error: null,
      };
    } catch (error: any) {
      console.error('Get admin action logs error:', error);
      return {
        data: [],
        error: error.message || 'Failed to get admin action logs',
      };
    }
  }

  // Log admin action
  private async logAdminAction(action: {
    adminUserId: string;
    actionType: 'PROMOTE' | 'DEMOTE' | 'ADMIN_MESSAGE' | 'CHAT_ARCHIVE';
    targetUserId?: string;
    targetEmail?: string;
    metadata?: any;
    description?: string;
  }): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('admin_action_logs')
        .insert({
          admin_user_id: action.adminUserId,
          action_type: action.actionType,
          target_user_id: action.targetUserId,
          target_email: action.targetEmail,
          metadata: action.metadata || {},
          description: action.description,
        });

      if (error) {
        return { error: handleSupabaseError(error) };
      }

      return { error: null };
    } catch (error: any) {
      console.error('Log admin action error:', error);
      return { error: error.message || 'Failed to log admin action' };
    }
  }

  // Search users
  async searchUsers(query: string): Promise<{ data: AdminUser[]; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) {
        return {
          data: [],
          error: handleSupabaseError(error),
        };
      }

      const users: AdminUser[] = (data || []).map(user => ({
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        isAdmin: user.is_admin,
        age: user.age,
        currentGrade: user.current_grade,
        school: user.school,
        studentSubjectPreference: user.student_subject_preference,
        availability: user.availability,
        profileCompleted: !!user.profile_completed_at,
        volunteerProfileCompleted: !!user.volunteer_profile_completed_at,
        createdAt: new Date(user.created_at),
        updatedAt: new Date(user.updated_at),
        lastActiveAt: new Date(user.last_active_at),
      }));

      return {
        data: users,
        error: null,
      };
    } catch (error: any) {
      console.error('Search users error:', error);
      return {
        data: [],
        error: error.message || 'Failed to search users',
      };
    }
  }
}

export const adminService = new AdminService();





