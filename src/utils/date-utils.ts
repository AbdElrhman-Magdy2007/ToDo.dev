/**
 * Utility functions for date and time manipulation, using 12-hour format where applicable.
 */

/**
 * Determines the status of a todo based on its deadline proximity.
 * @param dueTime - The due time in ISO format (e.g., "2025-05-03T14:30:00.000Z").
 * @returns The deadline status: 'overdue', 'due-soon', 'on-track', or null if invalid or absent.
 */
export const getDeadlineStatus = (
  dueTime?: string
): 'overdue' | 'due-soon' | 'on-track' | null => {
  if (!dueTime) return null;

  try {
    const now = new Date();
    const dueDate = new Date(dueTime);

    if (isNaN(dueDate.getTime())) return null;

    const diffMs = dueDate.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffMs < 0) return 'overdue';
    if (diffHours <= 24) return 'due-soon';
    return 'on-track';
  } catch {
    return null;
  }
};

/**
 * Formats an ISO date/time string to a readable date and time in 12-hour format.
 * @param dateTimeString - The date/time in ISO format (e.g., "2025-05-03T14:30:00.000Z").
 * @returns A formatted string (e.g., "May 3, 2:30 PM") or empty string if invalid.
 */
export const formatDateTime = (dateTimeString?: string): string => {
  if (!dateTimeString) return '';

  try {
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) return '';

    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return '';
  }
};

/**
 * Formats an ISO date/time string to a readable time in 12-hour format.
 * @param dateTimeString - The date/time in ISO format (e.g., "2025-05-03T14:30:00.000Z").
 * @returns A formatted time string (e.g., "2:30 PM") or empty string if invalid.
 */
export const formatTime = (dateTimeString?: string): string => {
  if (!dateTimeString) return '';

  try {
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) return '';

    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return '';
  }
};

/**
 * Formats an ISO date/time string to a readable date (month and day only).
 * @param dateTimeString - The date/time in ISO format (e.g., "2025-05-03T14:30:00.000Z").
 * @returns A formatted date string (e.g., "May 3") or empty string if invalid.
 */
export const formatDate = (dateTimeString?: string): string => {
  if (!dateTimeString) return '';

  try {
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) return '';

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
};

/**
 * Creates an ISO date string for today with a specific time.
 * @param hours - Hour in 24-hour format (0-23).
 * @param minutes - Minutes (0-59).
 * @returns An ISO date string (e.g., "2025-05-03T14:30:00.000Z").
 * @throws Error if hours or minutes are invalid.
 */
export const getTodayWithTime = (hours: number, minutes: number): string => {
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error('Invalid hours or minutes');
  }

  const today = new Date();
  today.setHours(hours, minutes, 0, 0);
  return today.toISOString();
};

/**
 * Parses a time string in 12-hour (e.g., "2:30 PM") or 24-hour (e.g., "14:30") format
 * and converts it to an ISO date string for today.
 * @param timeString - Time string (e.g., "2:30 PM" or "14:30").
 * @returns ISO date string (e.g., "2025-05-03T14:30:00.000Z") or null if invalid.
 */
export const parseTimeToToday = (timeString: string): string | null => {
  if (!timeString) return null;

  try {
    // Regular expressions for 12-hour and 24-hour formats
    const twelveHourRegex = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;
    const twentyFourHourRegex = /^(\d{1,2}):(\d{2})$/;

    let hours: number;
    let minutes: number;

    // Parse 12-hour format
    const twelveHourMatch = timeString.match(twelveHourRegex);
    if (twelveHourMatch) {
      hours = parseInt(twelveHourMatch[1], 10);
      minutes = parseInt(twelveHourMatch[2], 10);
      const period = twelveHourMatch[3].toUpperCase();

      // Convert to 24-hour format
      if (period === 'PM' && hours !== 12) {
        hours += 12;
      } else if (period === 'AM' && hours === 12) {
        hours = 0;
      }
    } else {
      // Parse 24-hour format (fallback for browser compatibility)
      const twentyFourHourMatch = timeString.match(twentyFourHourRegex);
      if (!twentyFourHourMatch) return null;

      hours = parseInt(twentyFourHourMatch[1], 10);
      minutes = parseInt(twentyFourHourMatch[2], 10);
    }

    // Validate hours and minutes
    if (hours > 23 || minutes > 59) return null;

    return getTodayWithTime(hours, minutes);
  } catch {
    return null;
  }
};