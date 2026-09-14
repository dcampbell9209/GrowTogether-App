import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Button, Switch, List, Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

import { useAuthStore } from '@/store/authStore';
import { volunteersService } from '@/services/api/volunteers';
import { VolunteerProfile } from '@/types';
import { spacing, colors } from '@/styles';
import { router } from 'expo-router';

export const VolunteerDashboard: React.FC = () => {
  const { user, setUser } = useAuthStore();
  const [volunteerProfile, setVolunteerProfile] = useState<VolunteerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUpdatingDiscoverability, setIsUpdatingDiscoverability] = useState(false);

  // Load volunteer profile
  const loadVolunteerProfile = async (showRefreshing = false) => {
    if (!user) return;

    if (showRefreshing) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const result = await volunteersService.getVolunteerProfile(user.id);
      
      if (result.error) {
        console.error('Error loading volunteer profile:', result.error);
        setVolunteerProfile(null);
      } else {
        setVolunteerProfile(result.data);
      }
    } catch (error) {
      console.error('Error loading volunteer profile:', error);
      setVolunteerProfile(null);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadVolunteerProfile();
  }, [user]);

  // Handle refresh
  const handleRefresh = () => {
    loadVolunteerProfile(true);
  };

  // Toggle discoverability
  const handleDiscoverabilityToggle = async (value: boolean) => {
    if (!user || !volunteerProfile) return;

    setIsUpdatingDiscoverability(true);

    try {
      const result = await volunteersService.updateDiscoverability(user.id, value);
      
      if (result.error) {
        console.error('Error updating discoverability:', result.error);
        // Could show error toast here
      } else {
        setVolunteerProfile({
          ...volunteerProfile,
          isDiscoverable: value,
        });
      }
    } catch (error) {
      console.error('Error updating discoverability:', error);
    } finally {
      setIsUpdatingDiscoverability(false);
    }
  };

  // Navigate to volunteer profile setup
  const handleSetupProfile = () => {
    router.push('/(auth)/onboarding/volunteer-setup');
  };

  // Navigate to volunteer profile edit
  const handleEditProfile = () => {
    router.push('/(tabs)/profile/volunteer');
  };

  // Show profile incomplete message
  if (!user?.volunteerProfileCompleted) {
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
      >
        <Card style={styles.setupCard}>
          <Card.Content style={styles.setupContent}>
            <MaterialIcons name="volunteer-activism" size={64} color={colors.volunteer} />
            <Text variant="headlineMedium" style={styles.setupTitle}>
              Complete Your Volunteer Profile
            </Text>
            <Text variant="bodyLarge" style={styles.setupText}>
              Set up your tutoring preferences so students can discover and connect with you for help.
            </Text>
            <Button
              mode="contained"
              onPress={handleSetupProfile}
              style={styles.setupButton}
              icon="arrow-right"
              contentStyle={styles.setupButtonContent}
            >
              Complete Setup
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
    >
      {/* Status Card */}
      <Card style={[styles.card, styles.statusCard]}>
        <Card.Content>
          <View style={styles.statusHeader}>
            <View style={styles.statusInfo}>
              <Text variant="titleLarge" style={styles.statusTitle}>
                Volunteer Status
              </Text>
              <Text variant="bodyMedium" style={styles.statusSubtitle}>
                {volunteerProfile?.isDiscoverable 
                  ? '🟢 Active - Students can find you'
                  : '🔴 Hidden - Not visible to students'
                }
              </Text>
            </View>
            <Switch
              value={volunteerProfile?.isDiscoverable || false}
              onValueChange={handleDiscoverabilityToggle}
              disabled={isUpdatingDiscoverability || !volunteerProfile?.isComplete}
            />
          </View>
          
          {!volunteerProfile?.isComplete && (
            <Text variant="bodySmall" style={styles.warningText}>
              Complete your profile to become discoverable by students
            </Text>
          )}
        </Card.Content>
      </Card>

      {/* Profile Summary */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.profileHeader}>
            <Text variant="titleMedium" style={styles.profileTitle}>
              Your Profile
            </Text>
            <Button
              mode="text"
              onPress={handleEditProfile}
              compact
            >
              Edit
            </Button>
          </View>

          {volunteerProfile ? (
            <>
              <List.Item
                title="Subjects You Tutor"
                description={volunteerProfile.subjectsToTutor.length > 0 
                  ? volunteerProfile.subjectsToTutor.join(', ')
                  : 'None selected'
                }
                left={(props) => <List.Icon {...props} icon="book-open" />}
              />

              <Divider />

              <List.Item
                title="Grade Levels"
                description={volunteerProfile.gradeLevelsComfortable.length > 0 
                  ? `Grades ${Math.min(...volunteerProfile.gradeLevelsComfortable)}-${Math.max(...volunteerProfile.gradeLevelsComfortable)}`
                  : 'None selected'
                }
                left={(props) => <List.Icon {...props} icon="school" />}
              />
            </>
          ) : (
            <Text variant="bodyMedium" style={styles.noProfileText}>
              Loading profile information...
            </Text>
          )}
        </Card.Content>
      </Card>

      {/* Impact Stats */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Your Impact
          </Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text variant="headlineMedium" style={styles.statNumber}>
                0
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Students Helped
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text variant="headlineMedium" style={styles.statNumber}>
                0
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Hours Volunteered
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text variant="headlineMedium" style={styles.statNumber}>
                0
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Sessions Completed
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Active Chats */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Active Chats
          </Text>
          
          <View style={styles.emptyState}>
            <MaterialIcons name="chat-bubble-outline" size={48} color={colors.onSurfaceVariant} />
            <Text variant="bodyLarge" style={styles.emptyStateText}>
              No active chats
            </Text>
            <Text variant="bodyMedium" style={styles.emptyStateSubtext}>
              Students will reach out to you when they need help in your subjects.
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Tips for Volunteers */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            💡 Volunteer Tips
          </Text>
          
          <View style={styles.tipsList}>
            <View style={styles.tip}>
              <Text style={styles.tipIcon}>🎯</Text>
              <Text variant="bodyMedium" style={styles.tipText}>
                Be patient and encouraging - focus on helping students understand concepts
              </Text>
            </View>
            
            <View style={styles.tip}>
              <Text style={styles.tipIcon}>💬</Text>
              <Text variant="bodyMedium" style={styles.tipText}>
                Keep conversations educational and appropriate
              </Text>
            </View>
            
            <View style={styles.tip}>
              <Text style={styles.tipIcon}>⏰</Text>
              <Text variant="bodyMedium" style={styles.tipText}>
                Complete sessions to earn volunteer hours and help track your impact
              </Text>
            </View>
            
            <View style={styles.tip}>
              <Text style={styles.tipIcon}>🏆</Text>
              <Text variant="bodyMedium" style={styles.tipText}>
                Your contributions make a real difference in students' academic success
              </Text>
            </View>
          </View>
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
    paddingHorizontal: spacing.container,
  },
  card: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    elevation: 2,
  },
  setupCard: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
    elevation: 3,
  },
  setupContent: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  setupTitle: {
    textAlign: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    color: colors.volunteer,
    fontWeight: 'bold',
  },
  setupText: {
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  setupButton: {
    marginTop: spacing.md,
  },
  setupButtonContent: {
    paddingHorizontal: spacing.lg,
  },
  statusCard: {
    backgroundColor: colors.secondaryContainer,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    marginBottom: spacing.xs,
    color: colors.secondary,
    fontWeight: '600',
  },
  statusSubtitle: {
    opacity: 0.8,
  },
  warningText: {
    color: colors.warning,
    fontStyle: 'italic',
    marginTop: spacing.sm,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  profileTitle: {
    color: colors.onSurface,
    fontWeight: '600',
  },
  noProfileText: {
    textAlign: 'center',
    opacity: 0.7,
    fontStyle: 'italic',
  },
  sectionTitle: {
    marginBottom: spacing.lg,
    color: colors.onSurface,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  statLabel: {
    opacity: 0.7,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyStateText: {
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    opacity: 0.8,
  },
  emptyStateSubtext: {
    textAlign: 'center',
    opacity: 0.6,
    lineHeight: 20,
  },
  tipsList: {
    gap: spacing.md,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipIcon: {
    fontSize: 16,
    marginRight: spacing.md,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    opacity: 0.8,
    lineHeight: 20,
  },
  bottomSpacing: {
    height: spacing.xl,
  },
});

export default VolunteerDashboard;






