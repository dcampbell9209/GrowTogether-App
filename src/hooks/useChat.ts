import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/services/supabase';
import { chatsService } from '@/services/api/chats';
import { Message, ChatStatus } from '@/types';
import { useAuthStore } from '@/store/authStore';

export interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<{ data: Message | null; error: string | null }>;
  markAsRead: () => Promise<void>;
  updateChatStatus: (status: ChatStatus) => Promise<{ error: string | null }>;
  deleteMessage: (messageId: string) => Promise<{ error: string | null }>;
  searchMessages: (query: string) => Promise<Message[]>;
  loadMoreMessages: () => Promise<void>;
  hasMoreMessages: boolean;
}

export const useChat = (chatId: string): UseChatReturn => {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [lastMessageId, setLastMessageId] = useState<string | null>(null);
  const subscriptionRef = useRef<any>(null);
  const pageSize = 50;

  // Load messages for the chat
  const loadMessages = useCallback(async (limit = pageSize, beforeId?: string) => {
    if (!chatId) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await chatsService.getChatMessages(chatId, limit);
      
      if (result.error) {
        setError(result.error);
        setMessages([]);
      } else {
        const newMessages = result.data;
        
        if (beforeId) {
          // Load more messages (pagination)
          setMessages(prev => [...prev, ...newMessages]);
        } else {
          // Initial load or refresh
          setMessages(newMessages);
        }
        
        // Update pagination state
        if (newMessages.length > 0) {
          setLastMessageId(newMessages[0].id);
          setHasMoreMessages(newMessages.length === limit);
        } else {
          setHasMoreMessages(false);
        }
      }
    } catch (error: any) {
      console.error('Error loading messages:', error);
      setError(error.message || 'Failed to load messages');
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, [chatId]);

  // Load more messages (pagination)
  const loadMoreMessages = useCallback(async () => {
    if (!hasMoreMessages || !lastMessageId) return;
    
    await loadMessages(pageSize, lastMessageId);
  }, [loadMessages, hasMoreMessages, lastMessageId]);

  // Send a message
  const sendMessage = useCallback(async (
    content: string
  ): Promise<{ data: Message | null; error: string | null }> => {
    if (!user || !chatId || !content.trim()) {
      return { data: null, error: 'Invalid message content' };
    }

    setIsSending(true);
    setError(null);

    try {
      const result = await chatsService.sendMessage(chatId, user.id, content.trim());
      
      if (result.error) {
        setError(result.error);
        return result;
      }

      // Add message to local state immediately for better UX
      if (result.data) {
        setMessages(prev => [...prev, result.data!]);
      }

      return result;
    } catch (error: any) {
      console.error('Error sending message:', error);
      const errorMessage = error.message || 'Failed to send message';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setIsSending(false);
    }
  }, [user, chatId]);

  // Mark messages as read
  const markAsRead = useCallback(async () => {
    if (!user || !chatId) return;

    try {
      await chatsService.markMessagesAsRead(chatId, user.id);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }, [user, chatId]);

  // Update chat status
  const updateChatStatus = useCallback(async (
    status: ChatStatus
  ): Promise<{ error: string | null }> => {
    if (!chatId) {
      return { error: 'Chat ID is required' };
    }

    try {
      const result = await chatsService.updateChatStatus(chatId, status, user?.id);
      return result;
    } catch (error: any) {
      console.error('Error updating chat status:', error);
      return { error: error.message || 'Failed to update chat status' };
    }
  }, [chatId, user]);

  // Delete a message
  const deleteMessage = useCallback(async (
    messageId: string
  ): Promise<{ error: string | null }> => {
    try {
      const result = await chatsService.deleteMessage(messageId);
      
      if (!result.error) {
        // Remove message from local state
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
      }
      
      return result;
    } catch (error: any) {
      console.error('Error deleting message:', error);
      return { error: error.message || 'Failed to delete message' };
    }
  }, []);

  // Search messages in the chat
  const searchMessages = useCallback(async (query: string): Promise<Message[]> => {
    if (!chatId || !query.trim()) return [];

    try {
      const result = await chatsService.searchMessages(chatId, query.trim());
      return result.error ? [] : result.data;
    } catch (error) {
      console.error('Error searching messages:', error);
      return [];
    }
  }, [chatId]);

  // Set up real-time subscription for messages
  useEffect(() => {
    if (!chatId) return;

    // Subscribe to new messages for this chat
    subscriptionRef.current = supabase
      .channel(`chat-${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          console.log('New message received for chat:', payload);
          
          const newMessage: Message = {
            id: payload.new.id,
            chatId: payload.new.chat_id,
            senderId: payload.new.sender_id,
            content: payload.new.content,
            messageType: payload.new.message_type || 'text',
            readAt: payload.new.read_at ? new Date(payload.new.read_at) : null,
            createdAt: new Date(payload.new.created_at),
            updatedAt: new Date(payload.new.updated_at),
          };

          // Add message to local state if it's not already there
          setMessages(prev => {
            const exists = prev.some(msg => msg.id === newMessage.id);
            if (!exists) {
              return [...prev, newMessage];
            }
            return prev;
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          console.log('Message updated for chat:', payload);
          
          // Update message in local state (e.g., read status)
          setMessages(prev =>
            prev.map(msg =>
              msg.id === payload.new.id
                ? {
                    ...msg,
                    readAt: payload.new.read_at ? new Date(payload.new.read_at) : null,
                    updatedAt: new Date(payload.new.updated_at),
                  }
                : msg
            )
          );
        }
      )
      .subscribe();

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [chatId]);

  // Load messages when chatId changes
  useEffect(() => {
    if (chatId) {
      setMessages([]);
      setLastMessageId(null);
      setHasMoreMessages(true);
      loadMessages();
    }
  }, [chatId, loadMessages]);

  // Auto-mark messages as read when chat opens
  useEffect(() => {
    if (chatId && user && messages.length > 0) {
      const hasUnreadMessages = messages.some(
        msg => msg.senderId !== user.id && !msg.readAt
      );
      
      if (hasUnreadMessages) {
        markAsRead();
      }
    }
  }, [chatId, user, messages, markAsRead]);

  return {
    messages,
    isLoading,
    isSending,
    error,
    sendMessage,
    markAsRead,
    updateChatStatus,
    deleteMessage,
    searchMessages,
    loadMoreMessages,
    hasMoreMessages,
  };
};

export default useChat;





