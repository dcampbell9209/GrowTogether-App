import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

import { Message } from '@/types';
import { spacing, colors, getTimeAgo, getInitials } from '@/styles';
import { getInitials as getInitialsUtil } from '@/utils';

export interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  senderName?: string;
  showAvatar?: boolean;
  showTimestamp?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  senderName,
  showAvatar = true,
  showTimestamp = true,
  onPress,
  onLongPress,
}) => {
  const getMessageStyle = () => {
    switch (message.messageType) {
      case 'system':
        return styles.systemMessage;
      case 'admin':
        return styles.adminMessage;
      default:
        return isOwn ? styles.ownMessage : styles.otherMessage;
    }
  };

  const getBubbleColor = () => {
    switch (message.messageType) {
      case 'system':
        return colors.surfaceVariant;
      case 'admin':
        return colors.primaryContainer;
      default:
        return isOwn ? colors.primary : colors.surface;
    }
  };

  const getTextColor = () => {
    switch (message.messageType) {
      case 'system':
        return colors.onSurfaceVariant;
      case 'admin':
        return colors.primary;
      default:
        return isOwn ? colors.onPrimary : colors.onSurface;
    }
  };

  const getAvatarColor = () => {
    switch (message.messageType) {
      case 'admin':
        return colors.primary;
      default:
        return isOwn ? colors.primary : colors.secondary;
    }
  };

  const getIcon = () => {
    switch (message.messageType) {
      case 'system':
        return 'info';
      case 'admin':
        return 'admin-panel-settings';
      default:
        return null;
    }
  };

  const initials = senderName ? getInitialsUtil(senderName, '') : '?';
  const icon = getIcon();

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
      style={[
        styles.container,
        isOwn ? styles.ownContainer : styles.otherContainer,
        message.messageType !== 'text' && styles.specialMessageContainer,
      ]}
    >
      {/* Avatar for other messages */}
      {!isOwn && showAvatar && message.messageType === 'text' && (
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: getAvatarColor() }]}>
            {icon ? (
              <MaterialIcons 
                name={icon as any} 
                size={16} 
                color={colors.onPrimary} 
              />
            ) : (
              <Text style={styles.avatarText}>{initials}</Text>
            )}
          </View>
        </View>
      )}

      <View style={[
        styles.messageContainer,
        isOwn ? styles.ownMessageContainer : styles.otherMessageContainer,
      ]}>
        {/* Sender name for other messages */}
        {!isOwn && senderName && message.messageType === 'text' && (
          <Text variant="bodySmall" style={styles.senderName}>
            {senderName}
          </Text>
        )}

        {/* Message bubble */}
        <Card
          style={[
            styles.bubble,
            getMessageStyle(),
            { backgroundColor: getBubbleColor() },
          ]}
          mode="elevated"
          elevation={message.messageType === 'text' ? 1 : 0}
        >
          <Card.Content style={styles.bubbleContent}>
            {/* Message content */}
            <Text
              variant="bodyMedium"
              style={[
                styles.messageText,
                { color: getTextColor() },
                message.messageType === 'system' && styles.systemText,
              ]}
            >
              {message.content}
            </Text>

            {/* Timestamp and read status */}
            {showTimestamp && (
              <View style={[
                styles.timestampContainer,
                isOwn ? styles.ownTimestampContainer : styles.otherTimestampContainer,
              ]}>
                <Text
                  variant="bodySmall"
                  style={[
                    styles.timestamp,
                    { color: getTextColor() },
                    message.messageType === 'system' && styles.systemTimestamp,
                  ]}
                >
                  {getTimeAgo(message.createdAt)}
                </Text>
                
                {/* Read status for own messages */}
                {isOwn && message.readAt && (
                  <MaterialIcons
                    name="done-all"
                    size={14}
                    color={colors.success}
                    style={styles.readIcon}
                  />
                )}
              </View>
            )}
          </Card.Content>
        </Card>
      </View>

      {/* Spacer for own messages */}
      {isOwn && showAvatar && (
        <View style={styles.avatarSpacer} />
      )}
    </TouchableOpacity>
  );
};

// Skeleton loading component
export const MessageBubbleSkeleton: React.FC<{ isOwn?: boolean }> = ({ 
  isOwn = false 
}) => {
  return (
    <View style={[
      styles.container,
      isOwn ? styles.ownContainer : styles.otherContainer,
    ]}>
      {!isOwn && (
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, styles.skeleton]} />
        </View>
      )}
      
      <View style={[
        styles.messageContainer,
        isOwn ? styles.ownMessageContainer : styles.otherMessageContainer,
      ]}>
        <Card style={[styles.bubble, styles.skeletonBubble]} mode="elevated">
          <Card.Content style={styles.bubbleContent}>
            <View style={[styles.skeletonText, styles.skeletonMessage]} />
            <View style={styles.timestampContainer}>
              <View style={[styles.skeletonText, styles.skeletonTimestamp]} />
            </View>
          </Card.Content>
        </Card>
      </View>
      
      {isOwn && <View style={styles.avatarSpacer} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  ownContainer: {
    justifyContent: 'flex-end',
  },
  otherContainer: {
    justifyContent: 'flex-start',
  },
  specialMessageContainer: {
    justifyContent: 'center',
    marginVertical: spacing.sm,
  },
  avatarContainer: {
    marginRight: spacing.sm,
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  avatarText: {
    color: colors.onPrimary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  avatarSpacer: {
    width: 40, // Same width as avatar + margin
    marginLeft: spacing.sm,
  },
  messageContainer: {
    flex: 1,
    maxWidth: '75%',
  },
  ownMessageContainer: {
    alignItems: 'flex-end',
  },
  otherMessageContainer: {
    alignItems: 'flex-start',
  },
  senderName: {
    color: colors.onSurfaceVariant,
    marginBottom: spacing.xs,
    fontWeight: '500',
  },
  bubble: {
    borderRadius: spacing.borderRadius.large,
    maxWidth: '100%',
  },
  bubbleContent: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  messageText: {
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  systemText: {
    fontStyle: 'italic',
    textAlign: 'center',
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownTimestampContainer: {
    justifyContent: 'flex-end',
  },
  otherTimestampContainer: {
    justifyContent: 'flex-start',
  },
  timestamp: {
    fontSize: 11,
    opacity: 0.7,
  },
  systemTimestamp: {
    opacity: 0.5,
  },
  readIcon: {
    marginLeft: spacing.xs,
  },
  
  // Message type styles
  ownMessage: {
    borderBottomRightRadius: spacing.borderRadius.small,
  },
  otherMessage: {
    borderBottomLeftRadius: spacing.borderRadius.small,
  },
  systemMessage: {
    borderRadius: spacing.borderRadius.medium,
    backgroundColor: colors.surfaceVariant,
    maxWidth: '90%',
    alignSelf: 'center',
  },
  adminMessage: {
    borderRadius: spacing.borderRadius.medium,
    backgroundColor: colors.primaryContainer,
    maxWidth: '90%',
    alignSelf: 'center',
  },
  
  // Skeleton styles
  skeleton: {
    backgroundColor: colors.surfaceVariant,
  },
  skeletonBubble: {
    backgroundColor: colors.surfaceVariant,
  },
  skeletonText: {
    backgroundColor: colors.surfaceVariant,
    borderRadius: spacing.borderRadius.small,
    height: 16,
  },
  skeletonMessage: {
    width: '80%',
    marginBottom: spacing.sm,
  },
  skeletonTimestamp: {
    width: '40%',
    height: 12,
  },
});

export default MessageBubble;





