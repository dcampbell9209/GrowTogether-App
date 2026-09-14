import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, Chip, Avatar, Badge } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

import { UserMatch } from '@/types';
import { spacing, colors } from '@/styles';
import { getInitials } from '@/utils';

export interface VolunteerCardProps {
  volunteer: UserMatch;
  onPress: () => void;
  onStartChat: () => void;
}

export const VolunteerCard: React.FC<VolunteerCardProps> = ({
  volunteer,
  onPress,
  onStartChat,
}) => {
  const initials = getInitials(volunteer.volunteerName, '');
  const subjectList = volunteer.subjects.slice(0, 3); // Show max 3 subjects
  const hasMoreSubjects = volunteer.subjects.length > 3;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card} mode="outlined">
        <Card.Content style={styles.content}>
          {/* Header with avatar and basic info */}
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <Avatar.Text 
                size={48} 
                label={initials}
                style={[styles.avatar, { backgroundColor: colors.volunteer }]}
                labelStyle={styles.avatarLabel}
              />
              {volunteer.subjectMatchScore > 1 && (
                <Badge 
                  style={styles.matchBadge}
                  size={16}
                >
                  ★
                </Badge>
              )}
            </View>
            
            <View style={styles.info}>
              <Text variant="titleMedium" style={styles.name}>
                {volunteer.volunteerName}
              </Text>
              <Text variant="bodySmall" style={styles.school}>
                {volunteer.school}
              </Text>
              <View style={styles.gradeRange}>
                <MaterialIcons 
                  name="school" 
                  size={14} 
                  color={colors.onSurfaceVariant} 
                />
                <Text variant="bodySmall" style={styles.gradeText}>
                  Grades {Math.min(...volunteer.gradeLevels)}-{Math.max(...volunteer.gradeLevels)}
                </Text>
              </View>
            </View>
          </View>

          {/* Subjects */}
          <View style={styles.subjects}>
            <Text variant="bodySmall" style={styles.subjectsLabel}>
              Tutors in:
            </Text>
            <View style={styles.subjectChips}>
              {subjectList.map((subject, index) => (
                <Chip 
                  key={index}
                  mode="outlined"
                  compact
                  style={styles.subjectChip}
                  textStyle={styles.subjectChipText}
                >
                  {subject}
                </Chip>
              ))}
              {hasMoreSubjects && (
                <Chip 
                  mode="outlined"
                  compact
                  style={styles.subjectChip}
                  textStyle={styles.subjectChipText}
                >
                  +{volunteer.subjects.length - 3} more
                </Chip>
              )}
            </View>
          </View>

          {/* Availability and match info */}
          <View style={styles.footer}>
            <View style={styles.availability}>
              <MaterialIcons 
                name="schedule" 
                size={14} 
                color={colors.onSurfaceVariant} 
              />
              <Text variant="bodySmall" style={styles.availabilityText}>
                {volunteer.overlappingDays} day{volunteer.overlappingDays !== 1 ? 's' : ''} overlap
              </Text>
            </View>

            {volunteer.subjectMatchScore > 1 && (
              <View style={styles.exactMatch}>
                <MaterialIcons 
                  name="star" 
                  size={14} 
                  color={colors.warning} 
                />
                <Text variant="bodySmall" style={styles.exactMatchText}>
                  Exact match
                </Text>
              </View>
            )}
          </View>

          {/* Action button */}
          <TouchableOpacity
            style={styles.chatButton}
            onPress={onStartChat}
            activeOpacity={0.8}
          >
            <MaterialIcons name="chat" size={16} color={colors.onPrimary} />
            <Text variant="labelMedium" style={styles.chatButtonText}>
              Start Chat
            </Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

// Skeleton loading card
export const VolunteerCardSkeleton: React.FC = () => {
  return (
    <Card style={styles.card} mode="outlined">
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.avatar, styles.skeleton]} />
          <View style={styles.info}>
            <View style={[styles.skeletonText, styles.skeletonName]} />
            <View style={[styles.skeletonText, styles.skeletonSchool]} />
            <View style={[styles.skeletonText, styles.skeletonGrade]} />
          </View>
        </View>
        
        <View style={styles.subjects}>
          <View style={[styles.skeletonText, styles.skeletonSubjectsLabel]} />
          <View style={styles.subjectChips}>
            <View style={[styles.subjectChip, styles.skeleton]} />
            <View style={[styles.subjectChip, styles.skeleton]} />
          </View>
        </View>

        <View style={styles.footer}>
          <View style={[styles.skeletonText, styles.skeletonFooter]} />
        </View>

        <View style={[styles.chatButton, styles.skeleton]} />
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
    elevation: 2,
    borderColor: colors.outline,
  },
  content: {
    paddingVertical: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: spacing.md,
  },
  avatar: {
    backgroundColor: colors.volunteer,
  },
  avatarLabel: {
    color: colors.onPrimary,
    fontWeight: 'bold',
  },
  matchBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.warning,
  },
  info: {
    flex: 1,
  },
  name: {
    fontWeight: '600',
    marginBottom: spacing.xs,
    color: colors.onSurface,
  },
  school: {
    opacity: 0.7,
    marginBottom: spacing.xs,
  },
  gradeRange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gradeText: {
    marginLeft: spacing.xs,
    opacity: 0.7,
  },
  subjects: {
    marginBottom: spacing.md,
  },
  subjectsLabel: {
    opacity: 0.7,
    marginBottom: spacing.sm,
  },
  subjectChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  subjectChip: {
    height: 28,
    backgroundColor: colors.primaryContainer,
    borderColor: colors.primary,
  },
  subjectChipText: {
    fontSize: 11,
    color: colors.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  availability: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availabilityText: {
    marginLeft: spacing.xs,
    opacity: 0.7,
  },
  exactMatch: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exactMatchText: {
    marginLeft: spacing.xs,
    color: colors.warning,
    fontWeight: '500',
  },
  chatButton: {
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius.medium,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatButtonText: {
    color: colors.onPrimary,
    marginLeft: spacing.xs,
    fontWeight: '600',
  },
  
  // Skeleton styles
  skeleton: {
    backgroundColor: colors.surfaceVariant,
    borderRadius: spacing.borderRadius.small,
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
  skeletonSchool: {
    width: '80%',
    marginBottom: spacing.xs,
  },
  skeletonGrade: {
    width: '40%',
  },
  skeletonSubjectsLabel: {
    width: '30%',
    marginBottom: spacing.sm,
  },
  skeletonFooter: {
    width: '50%',
  },
});

export default VolunteerCard;
