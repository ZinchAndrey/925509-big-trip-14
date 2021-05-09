import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(duration);
dayjs.extend(isSameOrAfter);

function getTimeDifference(start, end) {
  return dayjs(end).diff(dayjs(start));
}

function sortByDate(point1, point2) {
  if (point1.data.date.from < point2.data.date.from) {
    return -1;
  }
  return 1;
}

function sortByPrice(point1, point2) {
  if (point1.data.price > point2.data.price) {
    return -1;
  }
  return 1;
}

function sortByTime(point1, point2) {
  if (getTimeDifference(point1.data.date.from, point1.data.date.to) > getTimeDifference(point2.data.date.from, point2.data.date.to)) {
    return -1;
  }
  return 1;
}

function isFuturePoint(date) {
  return dayjs(date).isSameOrAfter(dayjs());
}

function isPastPoint(date) {
  return dayjs(date).isBefore(dayjs());
}

export {sortByDate, sortByPrice, sortByTime, isFuturePoint, isPastPoint};
