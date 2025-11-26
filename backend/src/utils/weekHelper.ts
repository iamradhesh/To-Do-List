import { getStartOfWeek, getEndOfWeek, formatDate } from './dateHelper';

// Get week info for a given date
export const getWeekInfo = (date: Date) => {
  const startOfWeek = getStartOfWeek(date);
  const endOfWeek = getEndOfWeek(date);

  return {
    startDate: formatDate(startOfWeek),
    endDate: formatDate(endOfWeek),
    startDateObj: startOfWeek,
    endDateObj: endOfWeek,
  };
};

// Get current week info
export const getCurrentWeekInfo = () => {
  const today = new Date();
  return getWeekInfo(today);
};

// Check if a date is in current week
export const isInCurrentWeek = (date: Date): boolean => {
  const { startDateObj, endDateObj } = getCurrentWeekInfo();
  return date >= startDateObj && date <= endDateObj;
};