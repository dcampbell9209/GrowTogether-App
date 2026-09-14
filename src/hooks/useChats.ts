import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/services/supabase';
import { chatsService } from '@/services/api/chats';
import { Chat, Message, ChatStatus } from '@/types';
import { useAuthStore } from '@/store/authStore';

export interface UseChatsReturn {
  chats: Chat[];
  isLoading: boolean;
  error: string | null;
  createChat: (volunteerUserId: string) => Promise<{ data: Chat | null; error: string | null }>;
  refreshChats: () => Promise<void>;
  unreadCount: number;
}

export const useChats = (): UseChatsReturn => {
  const { user } = useAuthStore();
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const subscriptionRef = useRef<any>(null);

  // Load chats on mount and when user changes
  const loadChats = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await chatsService.getUserChats(user.id);
      
      if (result.error) {
        setError(result.error);
        setChats([]);
      } else {
        setChats(result.data);
      }

      // Load unread count
      const unreadResult = await chatsService.getUnreadMessageCount(user.id);
      if (!unreadResult.error) {
        setUnreadCount(unreadResult.data);
      }
    } catch (error: any) {
      console.error('Error loading chats:', error);
      setError(error.message || 'Failed to load chats');
      setChats([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Create a new chat
  const createChat = useCallback(async (
    volunteerUserId: string
  ): Promise<{ data: Chat | null; error: string | null }> => {
    if (!user) {
      return { data: null, error: 'User not authenticated' };
    }

    try {
      const result = await chatsService.createChat(
        user.id,
        volunteerUserId,
        user.id
      );

      if (result.data) {
        // Add new chat to the list
        setChats(prev => [result.data!, ...prev]);
      }

      return result;
    } catch (error: any) {
      console.error('Error creating chat:', error);
      return { data: null, error: error.message || 'Failed to create chat' };
    }
  }, [user]);

  // Refresh chats manually
  const refreshChats = useCallback(async () => {
    await loadChats();
  }, [loadChats]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    // Subscribe to chat changes
    subscriptionRef.current = supabase
      .channel('user-chats')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chats',
          filter: `or(student_user_id.eq.${user.id},volunteer_user_id.eq.${user.id})`,
        },
        (payload) => {
          console.log('Chat change received:', payload);
          
          if (payload.eventType === 'INSERT') {
            // New chat created
            const newChat: Chat = {
              id: payload.new.id,
              studentUserId: payload.new.student_user_id,
              volunteerUserId: payload.new.volunteer_user_id,
              status: payload.new.status as ChatStatus,
              createdAt: new Date(payload.new.created_at),
              updatedAt: new Date(payload.new.updated_at),
            };
            
            setChats(prev => {
              // Check if chat already exists to avoid duplicates
              const exists = prev.some(chat => chat.id === newChat.id);
              if (!exists) {
                return [newChat, ...prev];
              }
              return prev;
            });
          } else if (payload.eventType === 'UPDATE') {
            // Chat updated (status change, etc.)
            setChats(prev => 
              prev.map(chat => 
                chat.id === payload.new.id 
                  ? {
                      ...chat,
                      status: payload.new.status as ChatStatus,
                      updatedAt: new Date(payload.new.updated_at),
                    }
                  : chat
              )
            );
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        async (payload) => {
          console.log('New message received:', payload);
          
          // Check if this message is for one of our chats
          const messageChatId = payload.new.chat_id;
          const isOurChat = chats.some(chat => chat.id === messageChatId);
          
          if (isOurChat) {
            // Update unread count if message is not from current user
            if (payload.new.sender_id !== user.id) {
              setUnreadCount(prev => prev + 1);
            }
            
            // Update the chat's updated_at timestamp in our list
            setChats(prev =>
              prev.map(chat =>
                chat.id === messageChatId
                  ? {
                      ...chat,
                      updatedAt: new Date(payload.new.created_at),
                    }
                  : chat
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [user, chats]);

  // Load chats on mount
  useEffect(() => {
    loadChats();
  }, [loadChats]);

  return {
    chats,
    isLoading,
    error,
    createChat,
    refreshChats,
    unreadCount,
  };
};

export default useChats;





