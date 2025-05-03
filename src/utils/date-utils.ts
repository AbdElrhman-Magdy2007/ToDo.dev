
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
 * Format a time string to a readable format
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
