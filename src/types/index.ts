// Re-export all types for easy importing
export * from './auth';
export * from './user';
export * from './chat';
export * from './api';
export * from './database';

// Common utility types
export type ID = string;
export type Timestamp = string;
export type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue };

// App-specific enums
export enum School {
  FRANCIS_DESMARES = 'Francis A. Desmares School',
  HUNTERDON_POLYTECH = 'Hunterdon County Polytech School',
  READING_FLEMING = 'Reading-Fleming Intermediate School',
  ROBERT_HUNTER = 'Robert Hunter School',
  JP_CASE_MIDDLE = 'JP Case Middle School',
  BARLEY_SHEAF = 'Barley Sheaf School',
  THREE_BRIDGES = 'Three Bridges School',
  WOODFERN_ELEMENTARY = 'Woodfern Elementary School',
  HIGH_BRIDGE_ELEMENTARY = 'High Bridge Elementary School',
  UNION_TOWNSHIP_ELEMENTARY = 'Union Township Elementary School',
  CLINTON_PUBLIC = 'Clinton Public School',
  ROUND_VALLEY = 'Round Valley School',
  LEBANON_BOROUGH = 'Lebanon Borough School',
  PATRICK_MCGAHERAN = 'Patrick McGaheran School',
  FRANKLIN_TOWNSHIP = 'Franklin Township School',
  WHITEHOUSE = 'Whitehouse School',
  READINGTON_MIDDLE = 'Readington Middle School',
  HOLLAND_BROOK = 'Holland Brook School',
  THE_MIDLAND = 'The Midland School',
  STONY_BROOK_ELEMENTARY = 'Stony Brook Elementary School',
  NORTH_HUNTERDON_HIGH = 'North Hunterdon High School',
  SOUTH_HUNTERDON_HIGH = 'South Hunterdon Regional High School',
  HUNTERDON_CENTRAL_HIGH = 'Hunterdon Central Regional High School',
}

export enum Subject {
  MATH = 'Math',
  ENGLISH_LANGUAGE_ARTS = 'English/Language Arts',
  SCIENCE = 'Science',
  HISTORY_SOCIAL_STUDIES = 'History/Social Studies',
  GENERAL_HOMEWORK_HELP = 'General Homework Help',
}

export enum Grade {
  FIRST = 1,
  SECOND = 2,
  THIRD = 3,
  FOURTH = 4,
  FIFTH = 5,
  SIXTH = 6,
  SEVENTH = 7,
  EIGHTH = 8,
  NINTH = 9,
  TENTH = 10,
  ELEVENTH = 11,
  TWELFTH = 12,
}

export enum Weekday {
  MONDAY = 'mon',
  TUESDAY = 'tue',
  WEDNESDAY = 'wed',
  THURSDAY = 'thu',
  FRIDAY = 'fri',
  SATURDAY = 'sat',
  SUNDAY = 'sun',
}

// Navigation types for Expo Router
export interface RouteParams {
  [key: string]: string | undefined;
}

export interface NavigationState {
  index: number;
  routes: Array<{
    key: string;
    name: string;
    params?: RouteParams;
  }>;
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface FormState<T> {
  data: T;
  errors: ValidationError[];
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
}

// App state types
export interface AppState {
  isLoading: boolean;
  isOnline: boolean;
  lastSync: Date | null;
  pendingActions: number;
}

