import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Text, Card, Avatar, Badge } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

import { Chat } from '@/types';
import { spacing, colors, getTimeAgo, getInitials } from '@/styles';
import { getInitials as getInitialsUtil } from '@/utils';

export interface ChatListProps {
  chats: Chat[];
  currentUserId: string;
  onChatPress: (chat: Chat) => void;
  onRefresh?: () => Promise<void>;
  isLoading?: boolean;
  isRefreshing?: boolean;
}

export interface ChatListItemProps {
  chat: Chat;
  currentUserId: string;
  onPress: () => void;
}

export const ChatListItem: React.FC<ChatListItemProps> = ({
  chat,
  currentUserId,
  onPress,
}) => {
  // Determine if current user is the student or volunteer
  const isStudent = chat.studentUserId === currentUserId;
  const otherUserId = isStudent ? chat.volunteerUserId : chat.studentUserId;
  
  // For now, we'll use placeholder data since we don't have user details
  // In a real implementation, you'd pass user details or fetch them
  const otherUserName = `User ${otherUserId.slice(-4)}`;
  const otherUserSchool = 'School Name';
  const lastMessage = 'Last message preview...'; // This would come from the chat data
  const lastMessageTime = chat.updatedAt;
  const hasUnreadMessages = false; // This would be calculated based on unread count

  const getStatusColor = () => {
    switch (chat.status) {
      case 'active':
        return colors.success;
      case 'student_closed':
      case 'volunteer_completed':
        return colors.warning;
      case 'archived':
        return colors.outline;
      default:
        return colors.primary;
    }
  };

  const getStatusIcon = () => {
    switch (chat.status) {
      case 'active':
        return 'chat';
      case 'student_closed':
        return 'chat-bubble-outline';
      case 'volunteer_completed':
        return 'check-circle';
      case 'archived':
        return 'archive';
      default:
        return 'chat';
    }
  };

  const initials = getInitialsUtil(otherUserName, '');

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.chatCard} mode="outlined">
        <Card.Content style={styles.chatContent}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <Avatar.Text
              size={48}
              label={initials}
              style={[
                styles.avatar,
                { backgroundColor: isStudent ? colors.volunteer : colors.student }
              ]}
              labelStyle={styles.avatarLabel}
            />
            {/* Status indicator */}
            <View style={[
              styles.statusIndicator,
              { backgroundColor: getStatusColor() }
            ]}>
              <MaterialIcons
                name={getStatusIcon() as any}
                size={12}
                color={colors.onPrimary}
              />
            </View>
          </View>

          {/* Chat info */}
          <View style={styles.chatInfo}>
            <View style={styles.chatHeader}>
              <Text variant="titleMedium" style={styles.chatName} numberOfLines={1}>
                {otherUserName}
              </Text>
              <Text variant="bodySmall" style={styles.chatTime}>
                {getTimeAgo(lastMessageTime)}
              </Text>
            </View>

            <View style={styles.chatDetails}>
              <Text variant="bodySmall" style={styles.schoolText} numberOfLines={1}>
                {otherUserSchool}
              </Text>
              <Text variant="bodySmall" style={styles.roleText}>
                {isStudent ? 'Volunteer' : 'Student'}
              </Text>
            </View>

            <Text variant="bodyMedium" style={styles.lastMessage} numberOfLines={2}>
              {lastMessage}
            </Text>
          </View>

          {/* Unread indicator */}
          {hasUnreadMessages && (
            <View style={styles.unreadContainer}>
              <Badge style={styles.unreadBadge} size={20}>
                3
              </Badge>
            </View>
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  currentUserId,
  onChatPress,
  onRefresh,
  isLoading = false,
  isRefreshing = false,
}) => {
  const renderChatItem = ({ item }: { item: Chat }) => (
    <ChatListItem
      chat={item}
      currentUserId={currentUserId}
      onPress={() => onChatPress(item)}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="chat-bubble-outline" size={64} color={colors.onSurfaceVariant} />
      <Text variant="titleLarge" style={styles.emptyTitle}>
        No Chats Yet
      </Text>
      <Text variant="bodyLarge" style={styles.emptyText}>
        Start a conversation with a {currentUserId ? 'volunteer' : 'student'} to get help with your studies.
      </Text>
    </View>
  );

  const renderSeparator = () => <View style={styles.separator} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyState}
        ItemSeparatorComponent={renderSeparator}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          ) : undefined
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          chats.length === 0 && styles.emptyListContent,
        ]}
      />
    </View>
  );
};

// Skeleton loading component
export const ChatListSkeleton: React.FC = () => {
  const skeletonItems = Array.from({ length: 5 }).map((_, index) => (
    <Card key={index} style={styles.chatCard} mode="outlined">
      <Card.Content style={styles.chatContent}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, styles.skeleton]} />
        </View>
        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <View style={[styles.skeletonText, styles.skeletonName]} />
            <View style={[styles.skeletonText, styles.skeletonTime]} />
          </View>
          <View style={styles.chatDetails}>
            <View style={[styles.skeletonText, styles.skeletonSchool]} />
            <View style={[styles.skeletonText, styles.skeletonRole]} />
          </View>
          <View style={[styles.skeletonText, styles.skeletonMessage]} />
        </View>
      </Card.Content>
    </Card>
  ));

  return (
    <View style={styles.container}>
      {skeletonItems}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: spacing.md,
  },
  emptyListContent: {
    flex: 1,
    justifyContent: 'center',
  },
  separator: {
    height: spacing.sm,
  },
  chatCard: {
    elevation: 1,
    borderColor: colors.outline,
  },
  chatContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: spacing.md,
  },
  avatar: {
    backgroundColor: colors.primary,
  },
  avatarLabel: {
    color: colors.onPrimary,
    fontWeight: 'bold',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  chatInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  chatName: {
    fontWeight: '600',
    color: colors.onSurface,
    flex: 1,
  },
  chatTime: {
    opacity: 0.6,
    marginLeft: spacing.sm,
  },
  chatDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  schoolText: {
    opacity: 0.7,
    flex: 1,
  },
  roleText: {
    opacity: 0.7,
    fontWeight: '500',
    marginLeft: spacing.sm,
  },
  lastMessage: {
    opacity: 0.8,
    lineHeight: 18,
  },
  unreadContainer: {
    alignItems: 'center',
  },
  unreadBadge: {
    backgroundColor: colors.primary,
  },
  
  // Empty state styles
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    textAlign: 'center',
    color: colors.onSurface,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 24,
  },
  
  // Skeleton styles
  skeleton: {
    backgroundColor: colors.surfaceVariant,
  },
  skeletonText: {
    backgroundColor: colors.surfaceVariant,
    borderRadius: spacing.borderRadius.small,
    height: 14,
  },
  skeletonName: {
    width: '60%',
    marginBottom: spacing.xs,
  },
  skeletonTime: {
    width: '25%',
    height: 12,
  },
  skeletonSchool: {
    width: '70%',
    marginBottom: spacing.xs,
  },
  skeletonRole: {
    width: '20%',
    height: 12,
  },
  skeletonMessage: {
    width: '90%',
    height: 16,
  },
});

export default ChatList;





