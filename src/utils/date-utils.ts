
/**
 * Returns a status based on how close the todo is to its deadline
 * @param dueTime The due time string in ISO format
 * @returns 'overdue' | 'due-soon' | 'on-track' | null
 */
export const getDeadlineStatus = (dueTime?: string): 'overdue' | 'due-soon' | 'on-track' | null => {
  if (!dueTime) return null;
  
  const now = new Date();
  const dueDate = new Date(dueTime);
  
  if (isNaN(dueDate.getTime())) return null;
  
  const diffMs = dueDate.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  
  if (diffMs < 0) return 'overdue';
  if (diffHours <= 24) return 'due-soon';
  return 'on-track';
};

/**
 * Format a date/time string to a readable format
 * @param dateTimeString The date/time string in ISO format
 * @returns A formatted date/time string
 */
export const formatDateTime = (dateTimeString?: string): string => {
  if (!dateTimeString) return '';
  
  try {
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) return '';
    
    return date.toLocaleString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } catch (error) {
    return '';
  }
};

/**
 * Format a time string to a readable format (hour and minute only)
 * @param dateTimeString The date/time string in ISO format
 * @returns A formatted time string
 */
export const formatTime = (dateTimeString?: string): string => {
  if (!dateTimeString) return '';
  
  try {
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) return '';
    
    return date.toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } catch (error) {
    return '';
  }
};

/**
 * Format a date string to a readable format (short month and day only)
 * @param dateTimeString The date/time string in ISO format
 * @returns A formatted date string
 */
export const formatDate = (dateTimeString?: string): string => {
  if (!dateTimeString) return '';
  
  try {
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) return '';
    
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric' 
    });
  } catch (error) {
    return '';
  }
};

/**
 * Get today's date as an ISO string but with time set to a specific hour and minute
 * @param hours Hour to set (24-hour format)
 * @param minutes Minutes to set
 * @returns ISO string with today's date and specified time
 */
export const getTodayWithTime = (hours: number, minutes: number): string => {
  const today = new Date();
  today.setHours(hours, minutes, 0, 0);
  return today.toISOString();
};

/**
 * Parse a time string (HH:MM) and convert it to today's date with that time
 * @param timeString Time in format HH:MM (24-hour)
 * @returns ISO string with today's date and specified time
 */
export const parseTimeToToday = (timeString: string): string | null => {
  if (!timeString) return null;
  
  try {
    const [hours, minutes] = timeString.split(':').map(Number);
    return getTodayWithTime(hours, minutes);
  } catch (error) {
    return null;
  }
};
