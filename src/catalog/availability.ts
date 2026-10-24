const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const isValidDateOnly = (value: string): boolean => {
  if (!DATE_ONLY_PATTERN.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

export const getDateKey = (date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getDaysUntil = (lastOrderDate: string, today = getDateKey()): number => {
  const endDate = Date.parse(`${lastOrderDate}T00:00:00.000Z`);
  const currentDate = Date.parse(`${today}T00:00:00.000Z`);
  return Math.floor((endDate - currentDate) / MILLISECONDS_PER_DAY);
};
