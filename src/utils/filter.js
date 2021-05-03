import { FilterType } from '../const.js';
import { isPointFuture, isPointPast } from './point.js';

const filter = {
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFuture(point.data.date.from)),
  [FilterType.PAST]: (points) => points.filter((point) => isPointPast(point.data.date.to)),
  [FilterType.EVERYTHING]: (points) => points,
};

export {filter};
