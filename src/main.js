import {createTripInfoTemplate} from './view/trip-info.js';
import {createTripCostTemplate} from './view/cost';
import {createMainMenuTemplate} from './view/main-menu.js';
import {createTripFiltersTemplate} from './view/filters.js';

import {createSortingTemplate} from './view/sorting.js';
import {createPointEditTemplate} from './view/point-edit.js';
import {createNewPointTemplate} from './view/point-create.js';
import {createPointTemplate} from './view/point.js';

import {generatePoint} from './mock/point.js';

const POINTS_COUNT = 15;

function render(container, template, position) {
  container.insertAdjacentHTML(position, template);
}

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
render(tripInfoNode, createTripInfoTemplate(points.slice(2)), 'afterbegin');

// Стоимость поездки;
render(tripInfoNode, createTripCostTemplate(points.slice(2)), 'beforeend');

// Меню;
render(mainMenuNode, createMainMenuTemplate(), 'afterbegin');

// Фильтры;
render(filtersNode, createTripFiltersTemplate(), 'beforeend');

// Сортировка;
render(tripEventsNode, createSortingTemplate(), 'afterbegin');

// Форма редактирования;
render(tripEventsListNode, createPointEditTemplate(points[0]), 'afterbegin');

// Форма создания;
render(tripEventsListNode, createNewPointTemplate(points[1]), 'beforeend');

// Точка маршрута (в списке).
for (let i = 2; i < POINTS_COUNT; i++) {
  // console.log(points[i]);
  render(tripEventsListNode, createPointTemplate(points[i]), 'beforeend');
}

