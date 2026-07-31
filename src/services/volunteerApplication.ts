const RECIPIENT_EMAIL = 'inform.growtogether@gmail.com';

export interface VolunteerApplicationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  currentGrade: string;
  age: number;
  preferredSubjects: string;
  availability: {
    mon: boolean;
    tue: boolean;
    wed: boolean;
    thu: boolean;
    fri: boolean;
    sat: boolean;
    sun: boolean;
  };
  motivation: string;
}

const DAY_LABELS: Record<string, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
};

function formatAvailability(availability: VolunteerApplicationData['availability']): string {
  const days = Object.entries(availability)
    .filter(([, selected]) => selected)
    .map(([day]) => DAY_LABELS[day] || day);

  return days.length > 0 ? days.join(', ') : 'None selected';
}

function buildEmailBody(data: VolunteerApplicationData): string {
  return [
    'New Volunteer Application',
    '========================',
    '',
    `First Name: ${data.firstName}`,
    `Last Name: ${data.lastName}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    `Current Grade / Year: ${data.currentGrade}`,
    `Age: ${data.age}`,
    `Preferred Subjects: ${data.preferredSubjects}`,
    `Availability: ${formatAvailability(data.availability)}`,
    '',
    'Why do you want to volunteer?',
    data.motivation,
    '',
    `Submitted: ${new Date().toLocaleString()}`,
  ].join('\n');
}

export async function submitVolunteerApplication(
  data: VolunteerApplicationData
): Promise<{ success: boolean; error?: string }> {
  const availabilityText = formatAvailability(data.availability);

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        _subject: `Volunteer Application: ${data.firstName} ${data.lastName}`,
        _template: 'table',
        _captcha: 'false',
        'First Name': data.firstName,
        'Last Name': data.lastName,
        Email: data.email,
        Phone: data.phone,
        'Current Grade / Year': data.currentGrade,
        Age: data.age,
        'Preferred Subjects': data.preferredSubjects,
        Availability: availabilityText,
        'Why do you want to volunteer?': data.motivation,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send application');
    }

    const result = await response.json();
    if (result.success === 'false' || result.success === false) {
      throw new Error(result.message || 'Failed to send application');
    }

    return { success: true };
  } catch (error) {
    console.error('Volunteer application email error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send application',
    };
  }
}

export function getVolunteerApplicationMailtoUrl(data: VolunteerApplicationData): string {
  const subject = encodeURIComponent(
    `Volunteer Application: ${data.firstName} ${data.lastName}`
  );
  const body = encodeURIComponent(buildEmailBody(data));
  return `mailto:${RECIPIENT_EMAIL}?subject=${subject}&body=${body}`;
}
