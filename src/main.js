import {POINTS_COUNT, MenuItem} from './const.js';
import {RenderPosition, render, remove} from './utils/render.js';

import {generatePoint} from './mock/point.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';

import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';

import MainMenuView from './view/main-menu.js';
import StatisticsView from './view/statistics.js';

import Api from './api.js';

const AUTHORIZATION = 'Basic andrey_925509-bt';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';

const tripMainNode = document.querySelector('.trip-main');
const pageMainNode = document.querySelector('.page-main');
const pageMainContainerNode = pageMainNode.querySelector('.page-body__container');
const filtersNode = tripMainNode.querySelector('.trip-controls__filters');
const addNewPointBtn = tripMainNode.querySelector('.trip-main__event-add-btn');
const mainMenuNode = tripMainNode.querySelector('.trip-controls__navigation');


const filterModel = new FilterModel();

const points = new Array(POINTS_COUNT).fill().map(generatePoint);

const api = new Api(END_POINT, AUTHORIZATION);

api.getPoints().then((points) => {
  console.log(points);
  // http://joxi.ru/RmzdoJNtMpXXpA

  // Есть проблема: cтруктура объекта похожа, но некоторые ключи называются иначе,
  // а ещё на сервере используется snake_case, а у нас camelCase.
  // Можно, конечно, переписать часть нашего клиентского приложения, но зачем?
  // Есть вариант получше - паттерн "Адаптер"
});
api.getOffers();
api.getDestinations();

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

points.sort((point1, point2) => {
  if (point1.data.date.from < point2.data.date.from) {
    return -1;
  }
  return 1;
});

const mainMenuComponent = new MainMenuView();
render(mainMenuNode, mainMenuComponent, RenderPosition.AFTERBEGIN);

let statisticsComponent = null;

const filterPresenter = new FilterPresenter(filtersNode, filterModel);
const tripPresenter = new TripPresenter(tripMainNode, pageMainNode, pointsModel, filterModel);


function handleSiteMenuClick(menuItem) {
  if (mainMenuNode.querySelector(`[data-type="${menuItem}"]`)
    .classList.contains('trip-tabs__btn--active')) {
    return;
  }

  mainMenuComponent.setMenuItem(menuItem);
  switch (menuItem) {
    case MenuItem.TABLE:
      // Показать доску
      tripPresenter.showEventsTable();
      addNewPointBtn.disabled = false;
      // Скрыть статистику
      remove(statisticsComponent);
      break;
    case MenuItem.STATS:
      // Скрыть доску
      tripPresenter.hideEventsTable();
      addNewPointBtn.disabled = true;
      // Показать статистику
      statisticsComponent = new StatisticsView(pointsModel.getPoints());
      render(pageMainContainerNode, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
}

mainMenuComponent.setMenuClickHandler(handleSiteMenuClick);

filterPresenter.init();
tripPresenter.init();

addNewPointBtn.addEventListener('click', () => {
  tripPresenter.createPoint();
  addNewPointBtn.disabled = true;
});
