import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

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

export {sortByDate, sortByPrice, sortByTime};
