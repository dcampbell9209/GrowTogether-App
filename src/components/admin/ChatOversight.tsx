import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, Card, List, Avatar, Chip, Menu, Searchbar, FAB } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

import { adminService, AdminChat } from '@/services/api/admin';
import { spacing, colors, getTimeAgo } from '@/styles';
import { getInitials } from '@/utils';

export interface ChatOversightProps {
  onChatPress?: (chat: AdminChat) => void;
}

export const ChatOversight: React.FC<ChatOversightProps> = ({ onChatPress }) => {
  const [chats, setChats] = useState<AdminChat[]>([]);
  const [filteredChats, setFilteredChats] = useState<AdminChat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState<AdminChat | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load chats
  const loadChats = async (showRefreshing = false) => {
    if (showRefreshing) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    
    setError(null);

    try {
      const result = await adminService.getAllChats();
      
      if (result.error) {
        setError(result.error);
        setChats([]);
        setFilteredChats([]);
      } else {
        setChats(result.data);
        setFilteredChats(result.data);
      }
    } catch (error: any) {
      console.error('Error loading chats:', error);
      setError(error.message || 'Failed to load chats');
      setChats([]);
      setFilteredChats([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Filter chats based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredChats(chats);
      return;
    }

    const filtered = chats.filter(chat =>
      chat.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.volunteerName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredChats(filtered);
  }, [searchQuery, chats]);

  // Initial load
  useEffect(() => {
    loadChats();
  }, []);

  // Handle refresh
  const handleRefresh = () => {
    loadChats(true);
  };

  // Handle chat press
  const handleChatPress = (chat: AdminChat) => {
    onChatPress?.(chat);
  };

  // Handle menu press
  const handleMenuPress = (chat: AdminChat) => {
    setSelectedChat(chat);
    setShowMenu(true);
  };

  // Handle archive chat
  const handleArchiveChat = async (chat: AdminChat) => {
    // This would need the admin user ID in a real implementation
    const result = await adminService.archiveChat(chat.id, 'admin-user-id');
    
    if (result.error) {
      console.error('Error archiving chat:', result.error);
    } else {
      // Refresh the chat list
      loadChats();
    }
    
    setShowMenu(false);
    setSelectedChat(null);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return colors.success;
      case 'student_closed':
        return colors.warning;
      case 'volunteer_completed':
        return colors.info;
      case 'archived':
        return colors.outline;
      default:
        return colors.primary;
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
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

  // Render chat item
  const renderChatItem = ({ item }: { item: AdminChat }) => {
    const studentInitials = getInitials(item.studentName, '');
    const volunteerInitials = getInitials(item.volunteerName, '');
    const statusColor = getStatusColor(item.status);

    return (
      <Card style={styles.chatCard} mode="outlined">
        <Card.Content style={styles.chatContent}>
          {/* Header with participants */}
          <View style={styles.chatHeader}>
            <View style={styles.participants}>
              <View style={styles.participant}>
                <Avatar.Text
                  size={32}
                  label={studentInitials}
                  style={[styles.avatar, { backgroundColor: colors.student }]}
                  labelStyle={styles.avatarLabel}
                />
                <Text variant="bodySmall" style={styles.participantName}>
                  {item.studentName}
                </Text>
              </View>
              
              <MaterialIcons 
                name="arrow-forward" 
                size={16} 
                color={colors.onSurfaceVariant} 
                style={styles.arrow}
              />
              
              <View style={styles.participant}>
                <Avatar.Text
                  size={32}
                  label={volunteerInitials}
                  style={[styles.avatar, { backgroundColor: colors.volunteer }]}
                  labelStyle={styles.avatarLabel}
                />
                <Text variant="bodySmall" style={styles.participantName}>
                  {item.volunteerName}
                </Text>
              </View>
            </View>

            <View style={styles.chatActions}>
              <Chip
                mode="outlined"
                style={[styles.statusChip, { borderColor: statusColor }]}
                textStyle={{ color: statusColor }}
                icon={() => (
                  <MaterialIcons
                    name={getStatusIcon(item.status) as any}
                    size={14}
                    color={statusColor}
                  />
                )}
              >
                {item.status.replace('_', ' ')}
              </Chip>
            </View>
          </View>

          {/* Chat details */}
          <View style={styles.chatDetails}>
            <Text variant="bodySmall" style={styles.chatTime}>
              Created {getTimeAgo(item.createdAt)}
            </Text>
            <Text variant="bodySmall" style={styles.messageCount}>
              {item.messageCount} messages
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.chatActions}>
            <List.Item
              title="View Chat"
              description="View messages and details"
              left={(props) => <List.Icon {...props} icon="chat" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => handleChatPress(item)}
              onLongPress={() => handleMenuPress(item)}
            />
          </View>
        </Card.Content>
      </Card>
    );
  };

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="chat-bubble-outline" size={64} color={colors.onSurfaceVariant} />
      <Text variant="titleLarge" style={styles.emptyTitle}>
        No Chats Found
      </Text>
      <Text variant="bodyLarge" style={styles.emptyText}>
        {searchQuery 
          ? `No chats match "${searchQuery}"`
          : 'No chats have been created yet'
        }
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search chats by participant names"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      {/* Chats list */}
      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Chat menu */}
      <Menu
        visible={showMenu}
        onDismiss={() => setShowMenu(false)}
        anchor={<View />}
        contentStyle={styles.menuContent}
      >
        {selectedChat && (
          <>
            <Menu.Item
              title="View Chat Details"
              onPress={() => handleChatPress(selectedChat)}
              leadingIcon="visibility"
            />
            <Menu.Item
              title="Archive Chat"
              onPress={() => handleArchiveChat(selectedChat)}
              leadingIcon="archive"
              disabled={selectedChat.status === 'archived'}
            />
          </>
        )}
      </Menu>

      {/* Refresh FAB */}
      <FAB
        icon="refresh"
        style={styles.fab}
        onPress={handleRefresh}
        loading={isRefreshing}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    paddingHorizontal: spacing.container,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.outline,
  },
  searchBar: {
    elevation: 0,
    backgroundColor: colors.surfaceVariant,
  },
  listContent: {
    padding: spacing.md,
    flexGrow: 1,
  },
  separator: {
    height: spacing.sm,
  },
  chatCard: {
    elevation: 1,
    borderColor: colors.outline,
  },
  chatContent: {
    paddingVertical: spacing.md,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  participants: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  participant: {
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    backgroundColor: colors.primary,
    marginBottom: spacing.xs,
  },
  avatarLabel: {
    color: colors.onPrimary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  participantName: {
    textAlign: 'center',
    opacity: 0.8,
  },
  arrow: {
    marginHorizontal: spacing.sm,
  },
  chatActions: {
    alignItems: 'flex-end',
  },
  statusChip: {
    height: 28,
  },
  chatDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  chatTime: {
    opacity: 0.6,
  },
  messageCount: {
    opacity: 0.6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
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
  menuContent: {
    backgroundColor: colors.surface,
  },
  fab: {
    position: 'absolute',
    margin: spacing.md,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
});

export default ChatOversight;





