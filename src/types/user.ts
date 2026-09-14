import { Database } from './database';
import { UserRole } from './auth';

export type { UserRole };

export interface Availability {
  mon: boolean;
  tue: boolean;
  wed: boolean;
  thu: boolean;
  fri: boolean;
  sat: boolean;
  sun: boolean;
}

export interface VolunteerProfile {
  subjectsToTutor: string[];
  gradeLevelsComfortable: number[];
  isComplete: boolean;
  isDiscoverable: boolean;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isAdmin: boolean;
  age: number;
  currentGrade: number;
  school: string;
  studentSubjectPreference: string;
  availability: Availability;
  volunteerProfile?: VolunteerProfile;
  profileCompletedAt: Date | null;
  volunteerProfileCompletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  lastActiveAt: Date;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  age: number;
  currentGrade: number;
  school: string;
  studentSubjectPreference: string;
  availability: Availability;
}

export interface VolunteerSetup {
  subjectsToTutor: string[];
  gradeLevelsComfortable: number[];
}

export interface UserMatch {
  volunteerId: string;
  volunteerName: string;
  subjects: string[];
  gradeLevels: number[];
  school: string;
  overlappingDays: number;
  subjectMatchScore: number;
}

// Form validation types
export interface ProfileFormData {
  firstName: string;
  lastName: string;
  age: string;
  currentGrade: string;
  school: string;
  studentSubjectPreference: string;
  availability: Record<string, boolean>;
}

export interface VolunteerFormData {
  subjectsToTutor: string[];
  gradeLevelsComfortable: string[];
}

// API response types
export interface UserResponse {
  user: User;
  error?: string;
}

export interface UsersResponse {
  users: User[];
  count: number;
  error?: string;
}

export interface MatchesResponse {
  matches: UserMatch[];
  error?: string;
}

