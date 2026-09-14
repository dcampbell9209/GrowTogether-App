export const AGE_VERIFICATION_STORAGE_KEY = '@age_verification';

export interface AgeVerificationData {
  birthMonth: number;
  birthDay: number;
  birthYear: number;
  isUnder13: boolean;
  verifiedAt: string;
}

export function calculateAge(birthMonth: number, birthDay: number, birthYear: number): number {
  const today = new Date();
  let age = today.getFullYear() - birthYear;

  const monthDiff = today.getMonth() + 1 - birthMonth;
  const dayDiff = today.getDate() - birthDay;

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1;
  }

  return age;
}

export function isValidBirthDate(month: number, day: number, year: number): boolean {
  if (!Number.isInteger(month) || month < 1 || month > 12) return false;
  if (!Number.isInteger(day) || day < 1 || day > 31) return false;
  if (!Number.isInteger(year) || year < 1900 || year > new Date().getFullYear()) return false;

  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day &&
    date <= new Date()
  );
}

export function buildAgeVerificationData(
  birthMonth: number,
  birthDay: number,
  birthYear: number
): AgeVerificationData {
  const age = calculateAge(birthMonth, birthDay, birthYear);

  return {
    birthMonth,
    birthDay,
    birthYear,
    isUnder13: age < 13,
    verifiedAt: new Date().toISOString(),
  };
}
