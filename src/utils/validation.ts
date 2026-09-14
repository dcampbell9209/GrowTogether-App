import { z } from 'zod';
import { School, Subject, Grade, Weekday } from '@/types';

// School enum values for validation
const schoolValues = Object.values(School) as [string, ...string[]];

// Subject enum values for validation
const subjectValues = Object.values(Subject) as [string, ...string[]];

// Grade values (1-12)
const gradeValues = Object.values(Grade).filter(v => typeof v === 'number') as [number, ...number[]];

// Weekday values
const weekdayValues = Object.values(Weekday) as [string, ...string[]];

// Information Quiz validation schema
export const informationQuizSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes'),
  
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes'),
  
  currentGrade: z
    .number()
    .min(1, 'Please select a grade')
    .max(12, 'Grade must be between 1 and 12')
    .int('Grade must be a whole number'),
  
  age: z
    .number()
    .min(5, 'Age must be at least 5')
    .max(25, 'Age must be less than 25')
    .int('Age must be a whole number'),
  
  school: z
    .string()
    .min(1, 'Please select a school')
    .refine((val) => schoolValues.includes(val), 'Please select a valid school'),
  
  studentSubjectPreference: z
    .string()
    .min(1, 'Please select a subject preference')
    .refine((val) => subjectValues.includes(val), 'Please select a valid subject'),
  
  availability: z
    .object({
      mon: z.boolean(),
      tue: z.boolean(),
      wed: z.boolean(),
      thu: z.boolean(),
      fri: z.boolean(),
      sat: z.boolean(),
      sun: z.boolean(),
    })
    .refine(
      (availability) => Object.values(availability).some(day => day === true),
      'Please select at least one day of availability'
    ),
});

// Volunteer setup validation schema
export const volunteerSetupSchema = z.object({
  subjectsToTutor: z
    .array(z.string())
    .min(1, 'Please select at least one subject to tutor')
    .refine(
      (subjects) => subjects.every(subject => subjectValues.includes(subject)),
      'Please select valid subjects'
    ),
  
  gradeLevelsComfortable: z
    .array(z.number())
    .min(1, 'Please select at least one grade level')
    .refine(
      (grades) => grades.every(grade => gradeValues.includes(grade)),
      'Please select valid grade levels'
    ),
});

// Profile update validation schema
export const profileUpdateSchema = informationQuizSchema.partial();

// Email validation
export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .min(1, 'Email is required');

// Common validation functions
export const validateRequired = (value: any, fieldName: string) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateEmail = (email: string) => {
  try {
    emailSchema.parse(email);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0]?.message || 'Invalid email';
    }
    return 'Invalid email';
  }
};

export const validateMinLength = (value: string, minLength: number, fieldName: string) => {
  if (value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  return null;
};

export const validateMaxLength = (value: string, maxLength: number, fieldName: string) => {
  if (value.length > maxLength) {
    return `${fieldName} must be less than ${maxLength} characters`;
  }
  return null;
};

export const validateNumericRange = (value: number, min: number, max: number, fieldName: string) => {
  if (value < min || value > max) {
    return `${fieldName} must be between ${min} and ${max}`;
  }
  return null;
};

// Form validation helper
export const validateForm = <T>(schema: z.ZodSchema<T>, data: unknown) => {
  try {
    const validatedData = schema.parse(data);
    return { data: validatedData, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code,
      }));
      return { data: null, errors };
    }
    return { 
      data: null, 
      errors: [{ field: 'unknown', message: 'Validation failed', code: 'unknown' }] 
    };
  }
};

// Async validation for unique constraints (e.g., email uniqueness)
export const createAsyncValidator = <T>(
  validationFn: (value: T) => Promise<boolean>,
  errorMessage: string
) => {
  return async (value: T): Promise<string | null> => {
    try {
      const isValid = await validationFn(value);
      return isValid ? null : errorMessage;
    } catch {
      return errorMessage;
    }
  };
};

// Form field validation state
export interface FieldValidation {
  value: any;
  error: string | null;
  touched: boolean;
  isValidating: boolean;
}

// Create initial field validation state
export const createFieldValidation = (initialValue: any = ''): FieldValidation => ({
  value: initialValue,
  error: null,
  touched: false,
  isValidating: false,
});

// Update field validation state
export const updateFieldValidation = (
  current: FieldValidation,
  updates: Partial<FieldValidation>
): FieldValidation => ({
  ...current,
  ...updates,
});

// Validate single field
export const validateField = <T>(
  schema: z.ZodSchema<T>,
  fieldName: string,
  value: any
): string | null => {
  try {
    // Create a partial schema for single field validation
    const fieldSchema = schema.pick({ [fieldName]: true } as any);
    fieldSchema.parse({ [fieldName]: value });
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0]?.message || 'Invalid value';
    }
    return 'Invalid value';
  }
};






