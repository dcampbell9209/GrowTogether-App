import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, Card, List, Avatar, Chip, Menu, Searchbar, FAB } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

import { adminService, AdminUser } from '@/services/api/admin';
import { spacing, colors, getTimeAgo } from '@/styles';
import { getInitials } from '@/utils';

export interface UserListProps {
  onUserPress?: (user: AdminUser) => void;
}

export const UserList: React.FC<UserListProps> = ({ onUserPress }) => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load users
  const loadUsers = async (showRefreshing = false) => {
    if (showRefreshing) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    
    setError(null);

    try {
      const result = await adminService.getAllUsers();
      
      if (result.error) {
        setError(result.error);
        setUsers([]);
        setFilteredUsers([]);
      } else {
        setUsers(result.data);
        setFilteredUsers(result.data);
      }
    } catch (error: any) {
      console.error('Error loading users:', error);
      setError(error.message || 'Failed to load users');
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Filter users based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(user =>
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.school.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  // Initial load
  useEffect(() => {
    loadUsers();
  }, []);

  // Handle refresh
  const handleRefresh = () => {
    loadUsers(true);
  };

  // Handle user press
  const handleUserPress = (user: AdminUser) => {
    onUserPress?.(user);
  };

  // Handle menu press
  const handleMenuPress = (user: AdminUser) => {
    setSelectedUser(user);
    setShowMenu(true);
  };

  // Handle role change
  const handleRoleChange = async (user: AdminUser, newRole: 'student' | 'volunteer') => {
    // This would need the admin user ID in a real implementation
    const result = await adminService.updateUserRole(user.id, newRole, 'admin-user-id');
    
    if (result.error) {
      console.error('Error updating user role:', result.error);
    } else {
      // Refresh the user list
      loadUsers();
    }
    
    setShowMenu(false);
    setSelectedUser(null);
  };

  // Handle admin status toggle
  const handleAdminToggle = async (user: AdminUser) => {
    // This would need the admin user ID in a real implementation
    const result = await adminService.toggleAdminStatus(user.id, 'admin-user-id');
    
    if (result.error) {
      console.error('Error toggling admin status:', result.error);
    } else {
      // Refresh the user list
      loadUsers();
    }
    
    setShowMenu(false);
    setSelectedUser(null);
  };

  // Render user item
  const renderUserItem = ({ item }: { item: AdminUser }) => {
    const initials = getInitials(item.firstName, item.lastName);
    const roleColor = item.role === 'student' ? colors.student : colors.volunteer;

    return (
      <Card style={styles.userCard} mode="outlined">
        <List.Item
          title={`${item.firstName} ${item.lastName}`}
          description={`${item.email} • ${item.school}`}
          left={() => (
            <View style={styles.avatarContainer}>
              <Avatar.Text
                size={48}
                label={initials}
                style={[styles.avatar, { backgroundColor: roleColor }]}
                labelStyle={styles.avatarLabel}
              />
              {item.isAdmin && (
                <View style={styles.adminBadge}>
                  <MaterialIcons name="admin-panel-settings" size={12} color={colors.onPrimary} />
                </View>
              )}
            </View>
          )}
          right={() => (
            <View style={styles.userInfo}>
              <Chip
                mode="outlined"
                style={[styles.roleChip, { borderColor: roleColor }]}
                textStyle={{ color: roleColor }}
              >
                {item.role}
              </Chip>
              <Text variant="bodySmall" style={styles.lastActive}>
                Active {getTimeAgo(item.lastActiveAt)}
              </Text>
            </View>
          )}
          onPress={() => handleUserPress(item)}
          onLongPress={() => handleMenuPress(item)}
        />
      </Card>
    );
  };

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="people-outline" size={64} color={colors.onSurfaceVariant} />
      <Text variant="titleLarge" style={styles.emptyTitle}>
        No Users Found
      </Text>
      <Text variant="bodyLarge" style={styles.emptyText}>
        {searchQuery 
          ? `No users match "${searchQuery}"`
          : 'No users have registered yet'
        }
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search users by name, email, or school"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      {/* Users list */}
      <FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
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

      {/* User menu */}
      <Menu
        visible={showMenu}
        onDismiss={() => setShowMenu(false)}
        anchor={<View />}
        contentStyle={styles.menuContent}
      >
        {selectedUser && (
          <>
            <Menu.Item
              title="Make Student"
              onPress={() => handleRoleChange(selectedUser, 'student')}
              leadingIcon="school"
              disabled={selectedUser.role === 'student'}
            />
            <Menu.Item
              title="Make Volunteer"
              onPress={() => handleRoleChange(selectedUser, 'volunteer')}
              leadingIcon="volunteer-activism"
              disabled={selectedUser.role === 'volunteer'}
            />
            <Menu.Item
              title={selectedUser.isAdmin ? "Remove Admin" : "Make Admin"}
              onPress={() => handleAdminToggle(selectedUser)}
              leadingIcon="admin-panel-settings"
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
  userCard: {
    elevation: 1,
    borderColor: colors.outline,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    backgroundColor: colors.primary,
  },
  avatarLabel: {
    color: colors.onPrimary,
    fontWeight: 'bold',
  },
  adminBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.warning,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  roleChip: {
    marginBottom: spacing.xs,
  },
  lastActive: {
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

export default UserList;





