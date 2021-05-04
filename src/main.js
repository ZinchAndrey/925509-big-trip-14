import {POINTS_COUNT} from './const.js';

import {generatePoint} from './mock/point.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';

import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';

const tripMainNode = document.querySelector('.trip-main');
const pageMainNode = document.querySelector('.page-main');
const filtersNode = tripMainNode.querySelector('.trip-controls__filters');


const filterModel = new FilterModel();

const points = new Array(POINTS_COUNT).fill().map(generatePoint);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

points.sort((point1, point2) => {
  if (point1.data.date.from < point2.data.date.from) {
    return -1;
  }
  return 1;
});

const filterPresenter = new FilterPresenter(filtersNode, filterModel);
filterPresenter.init();

const tripPresenter = new TripPresenter(tripMainNode, pageMainNode, pointsModel, filterModel);
tripPresenter.init();
