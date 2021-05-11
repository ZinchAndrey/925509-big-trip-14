import {POINTS_COUNT, MenuItem, UpdateType, FilterType} from './const.js';
import {RenderPosition, render} from './utils/render.js';

import {generatePoint} from './mock/point.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';

import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';

import MainMenuView from './view/main-menu.js';


const tripMainNode = document.querySelector('.trip-main');
const pageMainNode = document.querySelector('.page-main');
const filtersNode = tripMainNode.querySelector('.trip-controls__filters');
const addNewPointBtn = tripMainNode.querySelector('.trip-main__event-add-btn');
const mainMenuNode = tripMainNode.querySelector('.trip-controls__navigation');


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

// МЕНЮ САЙТА
const mainMenuComponent = new MainMenuView();
render(mainMenuNode, mainMenuComponent, RenderPosition.AFTERBEGIN);

const filterPresenter = new FilterPresenter(filtersNode, filterModel);
const tripPresenter = new TripPresenter(tripMainNode, pageMainNode, pointsModel, filterModel);


function handleSiteMenuClick(menuItem) {
  switch (menuItem) {
    case MenuItem.TABLE:
      // Показать доску
      tripPresenter.init();
      // Скрыть статистику
      break;
    case MenuItem.STATS:
      // Скрыть доску
      tripPresenter.destroy();
      // Показать статистику
      break;
  }
}

mainMenuComponent.setMenuClickHandler(handleSiteMenuClick);

filterPresenter.init();
tripPresenter.init();

addNewPointBtn.addEventListener('click', () => {
  tripPresenter.createPoint();
});
