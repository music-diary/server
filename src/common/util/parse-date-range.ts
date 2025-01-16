export const parseDateRange = (
  startAt?: string,
  endAt?: string,
): { startDate: string; endDate: string } => {
  const startDate = startAt ? new Date(startAt).toISOString() : null;
  let endDate: string;
  if (endAt) {
    const date = new Date(endAt);
    date.setDate(date.getDate() + 1);
    endDate = date.toISOString();
  }
  return { startDate, endDate };
};
