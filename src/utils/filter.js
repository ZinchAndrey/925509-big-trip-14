import { FilterType } from '../const.js';
import { isFuturePoint, isPastPoint } from './point.js';

const filter = {
  [FilterType.FUTURE]: (points) => points.filter((point) => isFuturePoint(point.data.date.from)),
  [FilterType.PAST]: (points) => points.filter((point) => isPastPoint(point.data.date.to)),
  [FilterType.EVERYTHING]: (points) => points,
};

export {filter};
