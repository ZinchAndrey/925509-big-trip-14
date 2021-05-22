import {MenuItem, UpdateType, INIT_ERROR_MESSAGE} from './const.js';
import {RenderPosition, render, remove} from './utils/render.js';

import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';

import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';

import MainMenuView from './view/main-menu.js';
import StatisticsView from './view/statistics.js';

import Api from './api.js';

const AUTHORIZATION = 'Basic andrey_925509-bt-03';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';

const tripMainNode = document.querySelector('.trip-main');
const pageMainNode = document.querySelector('.page-main');
const pageMainContainerNode = pageMainNode.querySelector('.page-body__container');
const filtersNode = tripMainNode.querySelector('.trip-controls__filters');
const addNewPointBtn = tripMainNode.querySelector('.trip-main__event-add-btn');
const mainMenuNode = tripMainNode.querySelector('.trip-controls__navigation');

const mainMenuComponent = new MainMenuView();

const filterModel = new FilterModel();
const pointsModel = new PointsModel();

const api = new Api(END_POINT, AUTHORIZATION);

let tripPresenter = null;

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  if (mainMenuNode.querySelector(`[data-type="${menuItem}"]`)
    .classList.contains('trip-tabs__btn--active')) {
    return;
  }

  mainMenuComponent.setMenuItem(menuItem);
  switch (menuItem) {
    case MenuItem.TABLE:
      // Показать доску
      tripPresenter.init();
      addNewPointBtn.disabled = false;
      // Скрыть статистику
      remove(statisticsComponent);
      break;
    case MenuItem.STATS:
      // Скрыть доску
      tripPresenter.destroy();
      addNewPointBtn.disabled = true;
      // Показать статистику
      statisticsComponent = new StatisticsView(pointsModel.getPoints());
      render(pageMainContainerNode, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

const filterPresenter = new FilterPresenter(filtersNode, filterModel, handleSiteMenuClick);

const destinationsRequest = api.getDestinations();
const offersRequest = api.getOffers();
const pointsRequest = api.getPoints();

// Необходимо проводить манипуляции с приложением только после загрузки ВСЕХ данных
Promise.all([destinationsRequest, offersRequest, pointsRequest])
  .then((results) => {
    const [destinations, offers, points] = results;

    tripPresenter = new TripPresenter(tripMainNode, pageMainNode, pointsModel, filterModel, offers, destinations, api);
    tripPresenter.init();

    pointsModel.setPoints(UpdateType.INIT, points);

    // элементы управления отрисуем только после загрузки данных
    mainMenuComponent.setMenuClickHandler(handleSiteMenuClick);
    render(mainMenuNode, mainMenuComponent, RenderPosition.AFTERBEGIN);

    filterPresenter.init();

    addNewPointBtn.addEventListener('click', () => {
      tripPresenter.createPoint();
      addNewPointBtn.disabled = true;
    });
  }).catch(() => {
    alert(INIT_ERROR_MESSAGE);
  });

