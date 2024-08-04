const TIME_OFFSET_SEOUL = 9 * 60 * 60 * 1000; // 9 hours

export const setKoreaTime = (date?: Date): Date => {
  const currentDate = date ?? new Date();
  return new Date(currentDate.getTime() + TIME_OFFSET_SEOUL);
};
