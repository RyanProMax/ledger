export const getYearMonthDate = (momentValue) => ({
  year: momentValue.year(),
  month: momentValue.month() + 1,
  date: momentValue.date(),
  day: momentValue.day(),
  YYYYMMDD: momentValue.format('YYYY-MM-DD')
});

export const a = () => {};
