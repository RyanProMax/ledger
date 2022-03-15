import dayjs from 'dayjs';

export const formatDateValue = (momentValue) => ({
  year: momentValue.year(),
  month: momentValue.month(),
  date: momentValue.date(),
  day: momentValue.day(),
  formatDate: momentValue.format('YYYY-MM-DD')
});
