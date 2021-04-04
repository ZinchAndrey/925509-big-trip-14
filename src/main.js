import {createTripInfoTemplate} from './view/trip-info.js';
import {createMainMenuTemplate} from './view/main-menu.js';
import {createTripFiltersTemplate} from './view/filters.js';

import {createSortingTemplate} from './view/sorting.js';
import {createPointEditTemplate} from './view/point-edit.js';
import {createNewPointTemplate} from './view/point-create.js';
import {createPointTemplate} from './view/point.js';

import {generatePoint} from './mock/point.js';

const POINTS_COUNT = 3;

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

// Информация о маршруте: города, даты;
render(tripInfoNode, createTripInfoTemplate(), 'afterbegin');

// Меню;
render(mainMenuNode, createMainMenuTemplate(), 'afterbegin');

// Фильтры;
render(filtersNode, createTripFiltersTemplate(), 'beforeend');

// Сортировка;
render(tripEventsNode, createSortingTemplate(), 'afterbegin');

// Форма редактирования;
const pointEdit = generatePoint();
render(tripEventsListNode, createPointEditTemplate(pointEdit), 'afterbegin');

// Форма создания;
const pointCreate = generatePoint();
render(tripEventsListNode, createNewPointTemplate(pointCreate), 'beforeend');

// Точка маршрута (в списке).
const points = new Array(POINTS_COUNT).fill().map(generatePoint);
for (let i = 0; i < POINTS_COUNT; i++) {
  // console.log(points[i]);
  render(tripEventsListNode, createPointTemplate(points[i]), 'beforeend');
}


// Стоимость поездки;
