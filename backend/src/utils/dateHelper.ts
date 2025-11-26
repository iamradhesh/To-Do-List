// Simple date helper functions

// Get today's date at midnight (start of day) in UTC
export const getStartOfDay = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setUTCHours(0, 0, 0, 0);
  return newDate;
};

// Get end of day (23:59:59) in UTC
export const getEndOfDay = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setUTCHours(23, 59, 59, 999);
  return newDate;
};

// Get start of week (Monday) in UTC
export const getStartOfWeek = (date: Date): Date => {
  const newDate = new Date(date);
  const day = newDate.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day; // If Sunday, go back 6 days, else go to Monday
  newDate.setUTCDate(newDate.getUTCDate() + diff);
  newDate.setUTCHours(0, 0, 0, 0);
  return newDate;
};

// Get end of week (Sunday) in UTC
export const getEndOfWeek = (date: Date): Date => {
  const startOfWeek = getStartOfWeek(date);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 6);
  endOfWeek.setUTCHours(23, 59, 59, 999);
  return endOfWeek;
};

// Format date as YYYY-MM-DD
export const formatDate = (date: Date): string => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};