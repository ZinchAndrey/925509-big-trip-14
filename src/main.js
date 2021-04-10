import TripInfoView from './view/trip-info.js';
import TripCostView from './view/cost';
import MainMenuView from './view/main-menu.js';
import FiltersView from './view/filters.js';

import SortingView from './view/sorting.js';
import PointEditView from './view/point-edit.js';
import NewPointView from './view/point-create.js';
import PointView from './view/point.js';

import {generatePoint} from './mock/point.js';

import {RenderPosition, render} from './utils.js';

const POINTS_COUNT = 15;

const tripMainNode = document.querySelector('.trip-main');
const tripInfoNode = tripMainNode.querySelector('.trip-info');
const mainMenuNode = tripMainNode.querySelector('.trip-controls__navigation');
const filtersNode = tripMainNode.querySelector('.trip-controls__filters');

const siteMainNode = document.querySelector('.page-main');
const tripEventsNode = siteMainNode.querySelector('.trip-events');
const tripEventsListNode = tripEventsNode.querySelector('.trip-events__list');

const points = new Array(POINTS_COUNT).fill().map(generatePoint);

points.sort((point1, point2) => {
  if (point1.data.date.from < point2.data.date.from) {
    return -1;
  }
  return 1;
});

// Информация о маршруте: города, даты;
// 0 и 1 точки не считаем, так как они идут в шаблоны форм
render(tripInfoNode, new TripInfoView(points.slice(2)).getElement(), RenderPosition.AFTERBEGIN);

// Стоимость поездки;
render(tripInfoNode, new TripCostView(points.slice(2)).getElement(), RenderPosition.BEFOREEND);

// Меню;
render(mainMenuNode, new MainMenuView().getElement(), RenderPosition.AFTERBEGIN);

// Фильтры;
render(filtersNode, new FiltersView().getElement(), RenderPosition.BEFOREEND);

// Сортировка;
render(tripEventsNode, new SortingView().getElement(), RenderPosition.AFTERBEGIN);

// Форма создания;
render(tripEventsListNode, new NewPointView(points[0]).getElement(), RenderPosition.AFTERBEGIN);

// Форма редактирования;
render(tripEventsListNode, new PointEditView(points[1]).getElement(), RenderPosition.BEFOREEND);

// Точка маршрута (в списке).
for (let i = 2; i < POINTS_COUNT; i++) {
  // console.log(points[i]);
  render(tripEventsListNode, new PointView(points[i]).getElement(), RenderPosition.BEFOREEND);
}

