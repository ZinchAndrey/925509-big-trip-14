import {POINTS_COUNT, MenuItem, UpdateType} from './const.js';
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

let destinations = null;
let offers = null;

const mainMenuComponent = new MainMenuView();

const filterModel = new FilterModel();
const pointsModel = new PointsModel();

// const points = new Array(POINTS_COUNT).fill().map(generatePoint);

const api = new Api(END_POINT, AUTHORIZATION);

const filterPresenter = new FilterPresenter(filtersNode, filterModel);
const tripPresenter = new TripPresenter(tripMainNode, pageMainNode, pointsModel, filterModel, offers, destinations); // сюда нужно передавать offers и destinations

let statisticsComponent = null;

// pointsModel.setPoints(points);


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
render(mainMenuNode, mainMenuComponent, RenderPosition.AFTERBEGIN);


filterPresenter.init();
tripPresenter.init();
// setTimeout(tripPresenter.init, 3000);

addNewPointBtn.addEventListener('click', () => {
  tripPresenter.createPoint();
  addNewPointBtn.disabled = true;
});

api.getPoints()
  .then((points) => {
    console.log(points);
    pointsModel.setPoints(UpdateType.INIT, points);
    console.log('Модель обновлена');

    // http://joxi.ru/RmzdoJNtMpXXpA
  })
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT, []);
  });

api.getOffers().then((offersData) => {
  offers = offersData;
  // console.log(offers);
});

api.getDestinations().then((destinationsData) => {
  destinations = destinationsData;
  // console.log(destinations);
});
