import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { Text, Card, Button, Searchbar } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

import { VolunteerCard, VolunteerCardSkeleton } from './VolunteerCard';
import { useAuthStore } from '@/store/authStore';
import { volunteersService } from '@/services/api/volunteers';
import { UserMatch } from '@/types';
import { spacing, colors, commonStyles } from '@/styles';
import { debounce } from '@/utils';

export interface StudentDashboardProps {
  onStartChat: (volunteerId: string, volunteerName: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onStartChat,
}) => {
  const { user } = useAuthStore();
  const [volunteers, setVolunteers] = useState<UserMatch[]>([]);
  const [filteredVolunteers, setFilteredVolunteers] = useState<UserMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Load volunteer matches
  const loadVolunteers = async (showRefreshing = false) => {
    if (!user) return;

    if (showRefreshing) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    
    setError(null);

    try {
      const result = await volunteersService.getVolunteerMatches(user.id);
      
      if (result.error) {
        setError(result.error);
        setVolunteers([]);
        setFilteredVolunteers([]);
      } else {
        setVolunteers(result.data);
        setFilteredVolunteers(result.data);
      }
    } catch (error: any) {
      console.error('Error loading volunteers:', error);
      setError(error.message || 'Failed to load volunteers');
      setVolunteers([]);
      setFilteredVolunteers([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (user?.profileCompleted) {
      loadVolunteers();
    }
  }, [user]);

  // Filter volunteers based on search query
  const debouncedFilter = debounce((query: string) => {
    if (!query.trim()) {
      setFilteredVolunteers(volunteers);
      return;
    }

    const filtered = volunteers.filter(volunteer =>
      volunteer.volunteerName.toLowerCase().includes(query.toLowerCase()) ||
      volunteer.school.toLowerCase().includes(query.toLowerCase()) ||
      volunteer.subjects.some(subject => 
        subject.toLowerCase().includes(query.toLowerCase())
      )
    );

    setFilteredVolunteers(filtered);
  }, 300);

  useEffect(() => {
    debouncedFilter(searchQuery);
  }, [searchQuery, volunteers]);

  // Handle refresh
  const handleRefresh = () => {
    loadVolunteers(true);
  };

  // Handle volunteer card press
  const handleVolunteerPress = (volunteer: UserMatch) => {
    // Could navigate to volunteer detail view
    console.log('Volunteer pressed:', volunteer);
  };

  // Handle start chat
  const handleStartChat = (volunteer: UserMatch) => {
    onStartChat(volunteer.volunteerId, volunteer.volunteerName);
  };

  // Show profile incomplete message
  if (!user?.profileCompleted) {
    return (
      <View style={styles.container}>
        <Card style={styles.messageCard}>
          <Card.Content style={styles.messageContent}>
            <MaterialIcons name="info" size={48} color={colors.warning} />
            <Text variant="titleLarge" style={styles.messageTitle}>
              Complete Your Profile
            </Text>
            <Text variant="bodyLarge" style={styles.messageText}>
              Finish setting up your profile to see volunteers who can help you with your studies.
            </Text>
            <Button
              mode="contained"
              onPress={() => {
                // Navigate to profile completion
                console.log('Navigate to profile');
              }}
              style={styles.messageButton}
            >
              Complete Profile
            </Button>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search volunteers by name, school, or subject"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          iconColor={colors.onSurfaceVariant}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
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
        {/* Header */}
        <View style={styles.header}>
          <Text variant="titleLarge" style={styles.headerTitle}>
            Available Volunteers
          </Text>
          <Text variant="bodyMedium" style={styles.headerSubtitle}>
            Connect with volunteers who can help you learn
          </Text>
        </View>

        {/* Loading state */}
        {isLoading && (
          <View>
            {Array.from({ length: 3 }).map((_, index) => (
              <VolunteerCardSkeleton key={index} />
            ))}
          </View>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <Card style={styles.errorCard}>
            <Card.Content style={styles.errorContent}>
              <MaterialIcons name="error" size={48} color={colors.error} />
              <Text variant="titleMedium" style={styles.errorTitle}>
                Unable to Load Volunteers
              </Text>
              <Text variant="bodyMedium" style={styles.errorText}>
                {error}
              </Text>
              <Button
                mode="outlined"
                onPress={() => loadVolunteers()}
                style={styles.retryButton}
              >
                Try Again
              </Button>
            </Card.Content>
          </Card>
        )}

        {/* Empty state */}
        {!isLoading && !error && filteredVolunteers.length === 0 && volunteers.length === 0 && (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <MaterialIcons name="school" size={64} color={colors.onSurfaceVariant} />
              <Text variant="titleLarge" style={styles.emptyTitle}>
                No Volunteers Available
              </Text>
              <Text variant="bodyLarge" style={styles.emptyText}>
                There are currently no volunteers available that match your preferences. 
                Check back later or update your profile to see more matches.
              </Text>
              <Button
                mode="outlined"
                onPress={handleRefresh}
                style={styles.refreshButton}
              >
                Refresh
              </Button>
            </Card.Content>
          </Card>
        )}

        {/* No search results */}
        {!isLoading && !error && searchQuery && filteredVolunteers.length === 0 && volunteers.length > 0 && (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <MaterialIcons name="search-off" size={64} color={colors.onSurfaceVariant} />
              <Text variant="titleLarge" style={styles.emptyTitle}>
                No Results Found
              </Text>
              <Text variant="bodyLarge" style={styles.emptyText}>
                No volunteers match your search for "{searchQuery}". Try different keywords.
              </Text>
              <Button
                mode="text"
                onPress={() => setSearchQuery('')}
                style={styles.clearButton}
              >
                Clear Search
              </Button>
            </Card.Content>
          </Card>
        )}

        {/* Volunteers list */}
        {!isLoading && !error && filteredVolunteers.length > 0 && (
          <View style={styles.volunteersList}>
            {/* Results count */}
            <Text variant="bodyMedium" style={styles.resultsCount}>
              {searchQuery 
                ? `${filteredVolunteers.length} of ${volunteers.length} volunteers`
                : `${volunteers.length} volunteer${volunteers.length !== 1 ? 's' : ''} available`
              }
            </Text>

            {/* Volunteer cards */}
            {filteredVolunteers.map((volunteer) => (
              <VolunteerCard
                key={volunteer.volunteerId}
                volunteer={volunteer}
                onPress={() => handleVolunteerPress(volunteer)}
                onStartChat={() => handleStartChat(volunteer)}
              />
            ))}
          </View>
        )}

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
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
  searchInput: {
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: spacing.container,
  },
  header: {
    paddingVertical: spacing.lg,
  },
  headerTitle: {
    fontWeight: '600',
    marginBottom: spacing.xs,
    color: colors.onSurface,
  },
  headerSubtitle: {
    opacity: 0.7,
  },
  volunteersList: {
    paddingBottom: spacing.md,
  },
  resultsCount: {
    opacity: 0.7,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  messageCard: {
    margin: spacing.xl,
    elevation: 2,
  },
  messageContent: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  messageTitle: {
    textAlign: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    color: colors.onSurface,
  },
  messageText: {
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  messageButton: {
    marginTop: spacing.md,
  },
  errorCard: {
    marginVertical: spacing.lg,
    backgroundColor: colors.errorLight,
    elevation: 2,
  },
  errorContent: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  errorTitle: {
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    color: colors.error,
  },
  errorText: {
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: spacing.lg,
  },
  retryButton: {
    borderColor: colors.error,
  },
  emptyCard: {
    marginVertical: spacing.lg,
    elevation: 2,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    textAlign: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    color: colors.onSurface,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  refreshButton: {
    marginTop: spacing.md,
  },
  clearButton: {
    marginTop: spacing.md,
  },
  bottomSpacing: {
    height: spacing.xl,
  },
});

export default StudentDashboard;






