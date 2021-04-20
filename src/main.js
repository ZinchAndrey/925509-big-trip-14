import POINTS_COUNT from './const.js';

import {generatePoint} from './mock/point.js';

import TripPresenter from './presenter/trip.js';

const tripMainNode = document.querySelector('.trip-main');
const pageMainNode = document.querySelector('.page-main');

const points = new Array(POINTS_COUNT).fill().map(generatePoint);

points.sort((point1, point2) => {
  if (point1.data.date.from < point2.data.date.from) {
    return -1;
  }
  return 1;
});

const tripPresenter = new TripPresenter(tripMainNode, pageMainNode);
tripPresenter.init(points);
