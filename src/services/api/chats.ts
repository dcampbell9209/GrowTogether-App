import { supabase, handleSupabaseError } from '@/services/supabase';
import { Chat, Message, ChatStatus } from '@/types';

class ChatsService {
  // Create a new chat between student and volunteer
  async createChat(
    studentUserId: string,
    volunteerUserId: string,
    createdBy: string
  ): Promise<{ data: Chat | null; error: string | null }> {
    try {
      // Check if there's already an active chat between these users
      const { data: existingChat } = await supabase
        .from('chats')
        .select('*')
        .eq('student_user_id', studentUserId)
        .eq('volunteer_user_id', volunteerUserId)
        .eq('status', 'active')
        .single();

      if (existingChat) {
        return {
          data: {
            id: existingChat.id,
            studentUserId: existingChat.student_user_id,
            volunteerUserId: existingChat.volunteer_user_id,
            status: existingChat.status as ChatStatus,
            createdAt: new Date(existingChat.created_at),
            updatedAt: new Date(existingChat.updated_at),
          },
          error: null,
        };
      }

      // Create new chat
      const { data, error } = await supabase
        .from('chats')
        .insert({
          student_user_id: studentUserId,
          volunteer_user_id: volunteerUserId,
          created_by: createdBy,
          status: 'active',
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
          studentUserId: data.student_user_id,
          volunteerUserId: data.volunteer_user_id,
          status: data.status as ChatStatus,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
        },
        error: null,
      };
    } catch (error: any) {
      console.error('Create chat error:', error);
      return {
        data: null,
        error: error.message || 'Failed to create chat',
      };
    }
  }

  // Get all chats for a user
  async getUserChats(userId: string): Promise<{ data: Chat[]; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('chats')
        .select(`
          *,
          student:users!chats_student_user_id_fkey(id, first_name, last_name, email, school),
          volunteer:users!chats_volunteer_user_id_fkey(id, first_name, last_name, email, school)
        `)
        .or(`student_user_id.eq.${userId},volunteer_user_id.eq.${userId}`)
        .order('updated_at', { ascending: false });

      if (error) {
        return {
          data: [],
          error: handleSupabaseError(error),
        };
      }

      const chats: Chat[] = (data || []).map(chat => ({
        id: chat.id,
        studentUserId: chat.student_user_id,
        volunteerUserId: chat.volunteer_user_id,
        status: chat.status as ChatStatus,
        createdAt: new Date(chat.created_at),
        updatedAt: new Date(chat.updated_at),
      }));

      return {
        data: chats,
        error: null,
      };
    } catch (error: any) {
      console.error('Get user chats error:', error);
      return {
        data: [],
        error: error.message || 'Failed to get chats',
      };
    }
  }

  // Get a specific chat by ID
  async getChat(chatId: string): Promise<{ data: Chat | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('chats')
        .select(`
          *,
          student:users!chats_student_user_id_fkey(id, first_name, last_name, email, school),
          volunteer:users!chats_volunteer_user_id_fkey(id, first_name, last_name, email, school)
        `)
        .eq('id', chatId)
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
          studentUserId: data.student_user_id,
          volunteerUserId: data.volunteer_user_id,
          status: data.status as ChatStatus,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
        },
        error: null,
      };
    } catch (error: any) {
      console.error('Get chat error:', error);
      return {
        data: null,
        error: error.message || 'Failed to get chat',
      };
    }
  }

  // Get messages for a chat
  async getChatMessages(chatId: string, limit = 50): Promise<{ data: Message[]; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users!messages_sender_id_fkey(id, first_name, last_name, email)
        `)
        .eq('chat_id', chatId)
        .is('deleted_at', null)
        .order('created_at', { ascending: true })
        .limit(limit);

      if (error) {
        return {
          data: [],
          error: handleSupabaseError(error),
        };
      }

      const messages: Message[] = (data || []).map(message => ({
        id: message.id,
        chatId: message.chat_id,
        senderId: message.sender_id,
        content: message.content,
        messageType: message.message_type || 'text',
        readAt: message.read_at ? new Date(message.read_at) : null,
        createdAt: new Date(message.created_at),
        updatedAt: new Date(message.updated_at),
      }));

      return {
        data: messages,
        error: null,
      };
    } catch (error: any) {
      console.error('Get chat messages error:', error);
      return {
        data: [],
        error: error.message || 'Failed to get messages',
      };
    }
  }

  // Send a message
  async sendMessage(
    chatId: string,
    senderId: string,
    content: string,
    messageType: 'text' | 'system' | 'admin' = 'text'
  ): Promise<{ data: Message | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          sender_id: senderId,
          content,
          message_type: messageType,
        })
        .select()
        .single();

      if (error) {
        return {
          data: null,
          error: handleSupabaseError(error),
        };
      }

      // Update chat's updated_at timestamp
      await supabase
        .from('chats')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', chatId);

      return {
        data: {
          id: data.id,
          chatId: data.chat_id,
          senderId: data.sender_id,
          content: data.content,
          messageType: data.message_type || 'text',
          readAt: data.read_at ? new Date(data.read_at) : null,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
        },
        error: null,
      };
    } catch (error: any) {
      console.error('Send message error:', error);
      return {
        data: null,
        error: error.message || 'Failed to send message',
      };
    }
  }

  // Mark messages as read
  async markMessagesAsRead(chatId: string, userId: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('chat_id', chatId)
        .neq('sender_id', userId)
        .is('read_at', null);

      if (error) {
        return { error: handleSupabaseError(error) };
      }

      return { error: null };
    } catch (error: any) {
      console.error('Mark messages as read error:', error);
      return { error: error.message || 'Failed to mark messages as read' };
    }
  }

  // Update chat status
  async updateChatStatus(
    chatId: string,
    status: ChatStatus,
    closedBy?: string
  ): Promise<{ error: string | null }> {
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString(),
      };

      if (status === 'student_closed' || status === 'volunteer_completed') {
        updateData.closed_at = new Date().toISOString();
        if (closedBy) {
          updateData.closed_by = closedBy;
        }
      }

      if (status === 'volunteer_completed') {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('chats')
        .update(updateData)
        .eq('id', chatId);

      if (error) {
        return { error: handleSupabaseError(error) };
      }

      return { error: null };
    } catch (error: any) {
      console.error('Update chat status error:', error);
      return { error: error.message || 'Failed to update chat status' };
    }
  }

  // Delete a message (soft delete)
  async deleteMessage(messageId: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', messageId);

      if (error) {
        return { error: handleSupabaseError(error) };
      }

      return { error: null };
    } catch (error: any) {
      console.error('Delete message error:', error);
      return { error: error.message || 'Failed to delete message' };
    }
  }

  // Get unread message count for a user
  async getUnreadMessageCount(userId: string): Promise<{ data: number; error: string | null }> {
    try {
      const { count, error } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .in('chat_id', [
          supabase
            .from('chats')
            .select('id')
            .or(`student_user_id.eq.${userId},volunteer_user_id.eq.${userId}`)
        ])
        .neq('sender_id', userId)
        .is('read_at', null)
        .is('deleted_at', null);

      if (error) {
        return {
          data: 0,
          error: handleSupabaseError(error),
        };
      }

      return {
        data: count || 0,
        error: null,
      };
    } catch (error: any) {
      console.error('Get unread message count error:', error);
      return {
        data: 0,
        error: error.message || 'Failed to get unread message count',
      };
    }
  }

  // Search messages in a chat
  async searchMessages(
    chatId: string,
    query: string,
    limit = 20
  ): Promise<{ data: Message[]; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .ilike('content', `%${query}%`)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        return {
          data: [],
          error: handleSupabaseError(error),
        };
      }

      const messages: Message[] = (data || []).map(message => ({
        id: message.id,
        chatId: message.chat_id,
        senderId: message.sender_id,
        content: message.content,
        messageType: message.message_type || 'text',
        readAt: message.read_at ? new Date(message.read_at) : null,
        createdAt: new Date(message.created_at),
        updatedAt: new Date(message.updated_at),
      }));

      return {
        data: messages,
        error: null,
      };
    } catch (error: any) {
      console.error('Search messages error:', error);
      return {
        data: [],
        error: error.message || 'Failed to search messages',
      };
    }
  }

  // Get chat statistics for admin
  async getChatStats(): Promise<{ 
    data: {
      totalChats: number;
      activeChats: number;
      completedChats: number;
      totalMessages: number;
    } | null; 
    error: string | null 
  }> {
    try {
      // Get total chats
      const { count: totalChats, error: totalError } = await supabase
        .from('chats')
        .select('id', { count: 'exact', head: true });

      if (totalError) {
        return { data: null, error: handleSupabaseError(totalError) };
      }

      // Get active chats
      const { count: activeChats, error: activeError } = await supabase
        .from('chats')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'active');

      if (activeError) {
        return { data: null, error: handleSupabaseError(activeError) };
      }

      // Get completed chats
      const { count: completedChats, error: completedError } = await supabase
        .from('chats')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'volunteer_completed');

      if (completedError) {
        return { data: null, error: handleSupabaseError(completedError) };
      }

      // Get total messages
      const { count: totalMessages, error: messagesError } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .is('deleted_at', null);

      if (messagesError) {
        return { data: null, error: handleSupabaseError(messagesError) };
      }

      return {
        data: {
          totalChats: totalChats || 0,
          activeChats: activeChats || 0,
          completedChats: completedChats || 0,
          totalMessages: totalMessages || 0,
        },
        error: null,
      };
    } catch (error: any) {
      console.error('Get chat stats error:', error);
      return {
        data: null,
        error: error.message || 'Failed to get chat statistics',
      };
    }
  }
}

export const chatsService = new ChatsService();





