import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(duration);
dayjs.extend(isSameOrAfter);

const getTimeDifference = (start, end) => {
  return dayjs(end).diff(dayjs(start));
};

const getTimeFormatted = (timeInMs) => {
  const time = {
    days: dayjs.duration(timeInMs).asDays() > 1 ? dayjs.duration(timeInMs).days() + 'D ' : '',
    hours: dayjs.duration(timeInMs).hours() > 0 ? dayjs.duration(timeInMs).hours() + 'H ' : '',
    minutes: dayjs.duration(timeInMs).minutes() > 0 ? dayjs.duration(timeInMs).minutes() + 'M' : '',
  };
  return time.days + time.hours + time.minutes; // 4D 2H 11M
};

const sortByDate = (point1, point2) => {
  if (point1.data.date.from < point2.data.date.from) {
    return -1;
  }
  return 1;
};

const sortByPrice = (point1, point2) => {
  if (point1.data.price > point2.data.price) {
    return -1;
  }
  return 1;
};

const sortByTime = (point1, point2) => {
  if (getTimeDifference(point1.data.date.from, point1.data.date.to) > getTimeDifference(point2.data.date.from, point2.data.date.to)) {
    return -1;
  }
  return 1;
};

const isFuturePoint = (date) => {
  return dayjs(date).isSameOrAfter(dayjs());
};

const isPastPoint = (date) => {
  return dayjs(date).isBefore(dayjs());
};

export {sortByDate, sortByPrice, sortByTime, isFuturePoint, isPastPoint, getTimeDifference, getTimeFormatted};
