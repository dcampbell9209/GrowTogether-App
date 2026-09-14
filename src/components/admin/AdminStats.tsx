import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, List, ProgressBar, Chip } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

import { adminService, AdminStats } from '@/services/api/admin';
import { spacing, colors } from '@/styles';

export const AdminStatsComponent: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load statistics
  const loadStats = async (showRefreshing = false) => {
    if (showRefreshing) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    
    setError(null);

    try {
      const result = await adminService.getAdminStats();
      
      if (result.error) {
        setError(result.error);
        setStats(null);
      } else {
        setStats(result.data);
      }
    } catch (error: any) {
      console.error('Error loading stats:', error);
      setError(error.message || 'Failed to load statistics');
      setStats(null);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadStats();
  }, []);

  // Handle refresh
  const handleRefresh = () => {
    loadStats(true);
  };

  // Calculate percentages
  const getCompletionRate = () => {
    if (!stats || stats.totalChats === 0) return 0;
    return Math.round((stats.completedChats / stats.totalChats) * 100);
  };

  const getActiveRate = () => {
    if (!stats || stats.totalChats === 0) return 0;
    return Math.round((stats.activeChats / stats.totalChats) * 100);
  };

  const getVolunteerRatio = () => {
    if (!stats || stats.totalUsers === 0) return 0;
    return Math.round((stats.totalVolunteers / stats.totalUsers) * 100);
  };

  if (isLoading && !stats) {
    return (
      <View style={styles.loadingContainer}>
        <Text variant="bodyLarge" style={styles.loadingText}>
          Loading statistics...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error" size={48} color={colors.error} />
        <Text variant="titleMedium" style={styles.errorTitle}>
          Failed to Load Statistics
        </Text>
        <Text variant="bodyMedium" style={styles.errorText}>
          {error}
        </Text>
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="analytics" size={64} color={colors.onSurfaceVariant} />
        <Text variant="titleLarge" style={styles.emptyTitle}>
          No Statistics Available
        </Text>
        <Text variant="bodyLarge" style={styles.emptyText}>
          Statistics will appear once users start using the platform.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Overview Cards */}
      <View style={styles.overviewGrid}>
        <Card style={[styles.statCard, styles.primaryCard]}>
          <Card.Content style={styles.statCardContent}>
            <MaterialIcons name="people" size={32} color={colors.onPrimary} />
            <Text variant="headlineMedium" style={styles.statNumber}>
              {stats.totalUsers}
            </Text>
            <Text variant="bodyMedium" style={styles.statLabel}>
              Total Users
            </Text>
          </Card.Content>
        </Card>

        <Card style={[styles.statCard, styles.secondaryCard]}>
          <Card.Content style={styles.statCardContent}>
            <MaterialIcons name="chat" size={32} color={colors.onPrimary} />
            <Text variant="headlineMedium" style={styles.statNumber}>
              {stats.totalChats}
            </Text>
            <Text variant="bodyMedium" style={styles.statLabel}>
              Total Chats
            </Text>
          </Card.Content>
        </Card>

        <Card style={[styles.statCard, styles.tertiaryCard]}>
          <Card.Content style={styles.statCardContent}>
            <MaterialIcons name="volunteer-activism" size={32} color={colors.onPrimary} />
            <Text variant="headlineMedium" style={styles.statNumber}>
              {stats.totalVolunteerHours}
            </Text>
            <Text variant="bodyMedium" style={styles.statLabel}>
              Volunteer Hours
            </Text>
          </Card.Content>
        </Card>

        <Card style={[styles.statCard, styles.infoCard]}>
          <Card.Content style={styles.statCardContent}>
            <MaterialIcons name="message" size={32} color={colors.onPrimary} />
            <Text variant="headlineMedium" style={styles.statNumber}>
              {stats.totalMessages}
            </Text>
            <Text variant="bodyMedium" style={styles.statLabel}>
              Total Messages
            </Text>
          </Card.Content>
        </Card>
      </View>

      {/* User Breakdown */}
      <Card style={styles.detailCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>
            User Breakdown
          </Text>
          
          <View style={styles.breakdownItem}>
            <View style={styles.breakdownHeader}>
              <MaterialIcons name="school" size={20} color={colors.student} />
              <Text variant="bodyLarge" style={styles.breakdownLabel}>
                Students
              </Text>
              <Text variant="titleMedium" style={styles.breakdownValue}>
                {stats.totalStudents}
              </Text>
            </View>
            <ProgressBar
              progress={stats.totalUsers > 0 ? stats.totalStudents / stats.totalUsers : 0}
              color={colors.student}
              style={styles.progressBar}
            />
          </View>

          <View style={styles.breakdownItem}>
            <View style={styles.breakdownHeader}>
              <MaterialIcons name="volunteer-activism" size={20} color={colors.volunteer} />
              <Text variant="bodyLarge" style={styles.breakdownLabel}>
                Volunteers
              </Text>
              <Text variant="titleMedium" style={styles.breakdownValue}>
                {stats.totalVolunteers}
              </Text>
            </View>
            <ProgressBar
              progress={stats.totalUsers > 0 ? stats.totalVolunteers / stats.totalUsers : 0}
              color={colors.volunteer}
              style={styles.progressBar}
            />
          </View>

          <View style={styles.ratioContainer}>
            <Chip
              mode="outlined"
              style={styles.ratioChip}
              textStyle={{ color: colors.primary }}
            >
              {getVolunteerRatio()}% Volunteers
            </Chip>
          </View>
        </Card.Content>
      </Card>

      {/* Chat Statistics */}
      <Card style={styles.detailCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>
            Chat Statistics
          </Text>
          
          <View style={styles.chatStatsGrid}>
            <View style={styles.chatStatItem}>
              <MaterialIcons name="chat" size={24} color={colors.success} />
              <Text variant="headlineSmall" style={styles.chatStatNumber}>
                {stats.activeChats}
              </Text>
              <Text variant="bodySmall" style={styles.chatStatLabel}>
                Active Chats
              </Text>
            </View>

            <View style={styles.chatStatItem}>
              <MaterialIcons name="check-circle" size={24} color={colors.info} />
              <Text variant="headlineSmall" style={styles.chatStatNumber}>
                {stats.completedChats}
              </Text>
              <Text variant="bodySmall" style={styles.chatStatLabel}>
                Completed
              </Text>
            </View>
          </View>

          <View style={styles.breakdownItem}>
            <View style={styles.breakdownHeader}>
              <Text variant="bodyLarge" style={styles.breakdownLabel}>
                Completion Rate
              </Text>
              <Text variant="titleMedium" style={styles.breakdownValue}>
                {getCompletionRate()}%
              </Text>
            </View>
            <ProgressBar
              progress={getCompletionRate() / 100}
              color={colors.success}
              style={styles.progressBar}
            />
          </View>

          <View style={styles.breakdownItem}>
            <View style={styles.breakdownHeader}>
              <Text variant="bodyLarge" style={styles.breakdownLabel}>
                Active Rate
              </Text>
              <Text variant="titleMedium" style={styles.breakdownValue}>
                {getActiveRate()}%
              </Text>
            </View>
            <ProgressBar
              progress={getActiveRate() / 100}
              color={colors.primary}
              style={styles.progressBar}
            />
          </View>
        </Card.Content>
      </Card>

      {/* Platform Health */}
      <Card style={styles.detailCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>
            Platform Health
          </Text>
          
          <List.Item
            title="User Growth"
            description={`${stats.totalUsers} total users registered`}
            left={(props) => <List.Icon {...props} icon="trending-up" />}
            right={() => (
              <Chip mode="outlined" style={styles.healthChip}>
                Growing
              </Chip>
            )}
          />

          <List.Item
            title="Chat Activity"
            description={`${stats.activeChats} active conversations`}
            left={(props) => <List.Icon {...props} icon="chat" />}
            right={() => (
              <Chip 
                mode="outlined" 
                style={[
                  styles.healthChip,
                  { borderColor: stats.activeChats > 0 ? colors.success : colors.warning }
                ]}
                textStyle={{ 
                  color: stats.activeChats > 0 ? colors.success : colors.warning 
                }}
              >
                {stats.activeChats > 0 ? 'Active' : 'Quiet'}
              </Chip>
            )}
          />

          <List.Item
            title="Volunteer Impact"
            description={`${stats.totalVolunteerHours} hours contributed`}
            left={(props) => <List.Icon {...props} icon="volunteer-activism" />}
            right={() => (
              <Chip mode="outlined" style={styles.healthChip}>
                Impactful
              </Chip>
            )}
          />
        </Card.Content>
      </Card>

      {/* Bottom spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    opacity: 0.7,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorTitle: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    textAlign: 'center',
    color: colors.error,
  },
  errorText: {
    textAlign: 'center',
    opacity: 0.8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
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
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.md,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    elevation: 2,
  },
  primaryCard: {
    backgroundColor: colors.primary,
  },
  secondaryCard: {
    backgroundColor: colors.secondary,
  },
  tertiaryCard: {
    backgroundColor: colors.tertiary,
  },
  infoCard: {
    backgroundColor: colors.info,
  },
  statCardContent: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  statNumber: {
    color: colors.onPrimary,
    fontWeight: 'bold',
    marginVertical: spacing.sm,
  },
  statLabel: {
    color: colors.onPrimary,
    textAlign: 'center',
    opacity: 0.9,
  },
  detailCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    elevation: 2,
  },
  cardTitle: {
    marginBottom: spacing.lg,
    color: colors.onSurface,
    fontWeight: '600',
  },
  breakdownItem: {
    marginBottom: spacing.lg,
  },
  breakdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  breakdownLabel: {
    flex: 1,
    marginLeft: spacing.sm,
    color: colors.onSurface,
  },
  breakdownValue: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  ratioContainer: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  ratioChip: {
    borderColor: colors.primary,
  },
  chatStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
  },
  chatStatItem: {
    alignItems: 'center',
  },
  chatStatNumber: {
    color: colors.primary,
    fontWeight: 'bold',
    marginVertical: spacing.xs,
  },
  chatStatLabel: {
    opacity: 0.7,
    textAlign: 'center',
  },
  healthChip: {
    borderColor: colors.primary,
  },
  bottomSpacing: {
    height: spacing.xl,
  },
});

export default AdminStatsComponent;





