import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Appbar, Menu, Portal, Modal } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MessageBubble, MessageBubbleSkeleton } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { useChat } from '@/hooks/useChat';
import { useAuthStore } from '@/store/authStore';
import { Chat, Message } from '@/types';
import { spacing, colors } from '@/styles';
import { Alert } from 'react-native';

export interface ChatThreadProps {
  chat: Chat;
  onBack: () => void;
}

export const ChatThread: React.FC<ChatThreadProps> = ({
  chat,
  onBack,
}) => {
  const { user } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<Message | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const {
    messages,
    isLoading,
    isSending,
    error,
    sendMessage,
    markAsRead,
    updateChatStatus,
    deleteMessage,
    hasMoreMessages,
    loadMoreMessages,
  } = useChat(chat.id);

  // Determine the other user (student or volunteer)
  const isStudent = user?.id === chat.studentUserId;
  const otherUserId = isStudent ? chat.volunteerUserId : chat.studentUserId;
  const otherUserName = `User ${otherUserId.slice(-4)}`; // Placeholder

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  // Handle sending a message
  const handleSendMessage = async (content: string) => {
    const result = await sendMessage(content);
    if (result.error) {
      Alert.alert('Error', result.error);
    }
  };

  // Handle message long press (for delete option)
  const handleMessageLongPress = (message: Message) => {
    if (message.senderId === user?.id && message.messageType === 'text') {
      setMessageToDelete(message);
      setShowDeleteModal(true);
    }
  };

  // Handle message deletion
  const handleDeleteMessage = async () => {
    if (messageToDelete) {
      const result = await deleteMessage(messageToDelete.id);
      if (result.error) {
        Alert.alert('Error', result.error);
      }
      setShowDeleteModal(false);
      setMessageToDelete(null);
    }
  };

  // Handle chat status update
  const handleUpdateChatStatus = async (status: 'student_closed' | 'volunteer_completed') => {
    const result = await updateChatStatus(status);
    if (result.error) {
      Alert.alert('Error', result.error);
    } else {
      setShowMenu(false);
    }
  };

  // Render a message item
  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isOwn = item.senderId === user?.id;
    const showAvatar = index === 0 || messages[index - 1]?.senderId !== item.senderId;
    
    return (
      <MessageBubble
        message={item}
        isOwn={isOwn}
        senderName={isOwn ? user?.firstName : otherUserName}
        showAvatar={showAvatar}
        onLongPress={() => handleMessageLongPress(item)}
      />
    );
  };

  // Render loading skeleton
  const renderLoadingSkeleton = () => (
    <View>
      {Array.from({ length: 5 }).map((_, index) => (
        <MessageBubbleSkeleton key={index} isOwn={index % 2 === 0} />
      ))}
    </View>
  );

  // Render load more button
  const renderLoadMore = () => {
    if (!hasMoreMessages || isLoading) return null;

    return (
      <View style={styles.loadMoreContainer}>
        <Text
          variant="bodySmall"
          style={styles.loadMoreText}
          onPress={loadMoreMessages}
        >
          Load earlier messages
        </Text>
      </View>
    );
  };

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text variant="bodyLarge" style={styles.emptyText}>
        Start the conversation! 👋
      </Text>
      <Text variant="bodyMedium" style={styles.emptySubtext}>
        Send your first message to begin chatting.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={onBack} />
        <Appbar.Content
          title={otherUserName}
          subtitle={isStudent ? 'Volunteer' : 'Student'}
        />
        <Menu
          visible={showMenu}
          onDismiss={() => setShowMenu(false)}
          anchor={
            <Appbar.Action
              icon="dots-vertical"
              onPress={() => setShowMenu(true)}
            />
          }
        >
          <Menu.Item
            title="Mark as Complete"
            onPress={() => handleUpdateChatStatus('volunteer_completed')}
            leadingIcon="check-circle"
          />
          <Menu.Item
            title="Close Chat"
            onPress={() => handleUpdateChatStatus('student_closed')}
            leadingIcon="close-circle"
          />
        </Menu>
      </Appbar.Header>

      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderLoadMore}
          ListEmptyComponent={isLoading ? renderLoadingSkeleton : renderEmptyState}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          inverted={false}
          onEndReached={loadMoreMessages}
          onEndReachedThreshold={0.1}
          showsVerticalScrollIndicator={false}
        />

        {/* Message input */}
        <MessageInput
          onSendMessage={handleSendMessage}
          placeholder={`Message ${otherUserName}...`}
          disabled={chat.status !== 'active'}
        />
      </KeyboardAvoidingView>

      {/* Delete message modal */}
      <Portal>
        <Modal
          visible={showDeleteModal}
          onDismiss={() => setShowDeleteModal(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text variant="titleMedium" style={styles.modalTitle}>
            Delete Message
          </Text>
          <Text variant="bodyMedium" style={styles.modalText}>
            Are you sure you want to delete this message? This action cannot be undone.
          </Text>
          <View style={styles.modalButtons}>
            <Text
              variant="labelLarge"
              style={styles.modalButton}
              onPress={() => setShowDeleteModal(false)}
            >
              Cancel
            </Text>
            <Text
              variant="labelLarge"
              style={[styles.modalButton, styles.modalButtonDelete]}
              onPress={handleDeleteMessage}
            >
              Delete
            </Text>
          </View>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    elevation: 2,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: spacing.md,
    flexGrow: 1,
  },
  loadMoreContainer: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  loadMoreText: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: spacing.sm,
    opacity: 0.8,
  },
  emptySubtext: {
    textAlign: 'center',
    opacity: 0.6,
  },
  modalContent: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    margin: spacing.xl,
    borderRadius: spacing.borderRadius.medium,
  },
  modalTitle: {
    marginBottom: spacing.md,
    textAlign: 'center',
    color: colors.onSurface,
  },
  modalText: {
    marginBottom: spacing.xl,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    color: colors.primary,
    fontWeight: '600',
  },
  modalButtonDelete: {
    color: colors.error,
  },
});

export default ChatThread;





