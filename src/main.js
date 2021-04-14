import TripInfoBlockView from './view/trip-info-block.js';
import TripInfoView from './view/trip-info.js';
import TripCostView from './view/cost';
import MainMenuView from './view/main-menu.js';
import FiltersView from './view/filters.js';

import SortingView from './view/sorting.js';
import PointEditView from './view/point-edit.js';
import NewPointView from './view/point-create.js';
import PointView from './view/point.js';
import NoPointsView from './view/no-points.js';

import {generatePoint} from './mock/point.js';

import {RenderPosition, render} from './utils/render.js';

const POINTS_COUNT = 15;

const tripMainNode = document.querySelector('.trip-main');
const mainMenuNode = tripMainNode.querySelector('.trip-controls__navigation');
const filtersNode = tripMainNode.querySelector('.trip-controls__filters');

const siteMainNode = document.querySelector('.page-main');
const tripEventsNode = siteMainNode.querySelector('.trip-events');
const tripEventsListNode = tripEventsNode.querySelector('.trip-events__list');

const points = new Array(POINTS_COUNT).fill().map(generatePoint);

function renderPoint(point) {
  const pointComponent = new PointView(point);
  const editPointComponent = new PointEditView(point);

  function pressEscHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      replaceEditToPoint();
      document.removeEventListener('keydown', pressEscHandler);
    }
  }

  function replacePointToEdit() {
    tripEventsListNode.replaceChild(editPointComponent.getElement(), pointComponent.getElement());
    document.addEventListener('keydown', pressEscHandler);
  }

  function replaceEditToPoint() {
    tripEventsListNode.replaceChild(pointComponent.getElement(), editPointComponent.getElement());
    document.removeEventListener('keydown', pressEscHandler);
  }

  pointComponent.setRollUpClickHandler(replacePointToEdit);

  editPointComponent.setRollUpClickHandler(replaceEditToPoint);

  editPointComponent.setFormSubmitHandler(replaceEditToPoint);

  render(tripEventsListNode, pointComponent.getElement(), RenderPosition.BEFOREEND);
}

function renderEventsTable() {
  // Сортировка;
  render(tripEventsNode, new SortingView().getElement(), RenderPosition.AFTERBEGIN);

  // Форма создания;
  render(tripEventsListNode, new NewPointView(points[0]).getElement(), RenderPosition.AFTERBEGIN);

  // Точка маршрута (в списке).
  for (let i = 1; i < POINTS_COUNT; i++) {
    renderPoint(points[i]);
  }
}

function renderTripInfo() {
  render(tripMainNode, new TripInfoBlockView().getElement(), RenderPosition.AFTERBEGIN);
  const tripInfoNode = tripMainNode.querySelector('.trip-info');

  // 0 точку не считаем, так как она идет в шаблоны формы новой точки
  render(tripInfoNode, new TripInfoView(points.slice(1)).getElement(), RenderPosition.AFTERBEGIN);
  // Стоимость поездки;
  render(tripInfoNode, new TripCostView(points.slice(1)).getElement(), RenderPosition.BEFOREEND);
}

points.sort((point1, point2) => {
  if (point1.data.date.from < point2.data.date.from) {
    return -1;
  }
  return 1;
});

// Меню;
render(mainMenuNode, new MainMenuView().getElement(), RenderPosition.AFTERBEGIN);

// Фильтры;
render(filtersNode, new FiltersView().getElement(), RenderPosition.BEFOREEND);

if (!points.length) {
  render(tripEventsNode, new NoPointsView().getElement(), RenderPosition.AFTERBEGIN);
} else {
  // Информация о маршруте: города, даты, цена;
  renderTripInfo();

  // Точки маршрута + сортировка
  renderEventsTable();
}


