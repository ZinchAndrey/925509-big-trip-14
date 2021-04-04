import {createTripInfoTemplate} from './view/trip-info.js';
import {createTripCostTemplate} from './view/cost';
import {createMainMenuTemplate} from './view/main-menu.js';
import {createTripFiltersTemplate} from './view/filters.js';

import {createSortingTemplate} from './view/sorting.js';
import {createPointEditTemplate} from './view/point-edit.js';
import {createNewPointTemplate} from './view/point-create.js';
import {createPointTemplate} from './view/point.js';

import {generatePoint} from './mock/point.js';

const POINTS_COUNT = 10;

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

// Информация о маршруте: города, даты;
render(tripInfoNode, createTripInfoTemplate(), 'afterbegin');

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

// Стоимость поездки;
render(tripInfoNode, createTripCostTemplate(points), 'beforeend');
