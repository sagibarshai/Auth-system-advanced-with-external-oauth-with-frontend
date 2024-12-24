export const addMinutesFromNow = (min: number): Date => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + min);
  return now;
};
