import POINTS_COUNT from '../const.js';

import TripInfoBlockView from '../view/trip-info-block.js';
import TripInfoView from '../view/trip-info.js';
import TripCostView from '../view/cost';

import MainMenuView from '../view/main-menu.js';
import FiltersView from '../view/filters.js';

import SortingView from '../view/sorting.js';
import NewPointView from '../view/point-create.js';

import NoPointsView from '../view/no-points.js';

import {RenderPosition, render} from '../utils/render.js';

import PointPresenter from './point.js';
import TripInfoPresenter from './trip-info.js';

export default class Trip {
  constructor(tripMainNode, pageMainNode) {

    this._tripMainNode = tripMainNode;
    this._mainMenuNode = this._tripMainNode.querySelector('.trip-controls__navigation');
    this._filtersNode = this._tripMainNode.querySelector('.trip-controls__filters');

    this._pageMainNode = pageMainNode;
    this._tripEventsNode = this._pageMainNode.querySelector('.trip-events');
    this._tripEventsListNode = this._tripEventsNode.querySelector('.trip-events__list');


    this._sortingComponent = new SortingView();

    this._tripInfoBlockComponent = new TripInfoBlockView();
    this._tripInfoComponent = new TripInfoView();
    this._tripCostComponent = new TripCostView();

    this._mainMenuComponent = new MainMenuView();
    this._filtersComponent = new FiltersView();

    this._noPointsComponent = new NoPointsView();
  }

  init(points) {
    this._renderMainMenu();
    this._renderFilters();

    if (!points.length) {
      render(this._tripEventsListNode, this._noPointsComponent, RenderPosition.AFTERBEGIN);
    } else {
      this._renderEventsTable(points);

      // т.к. первая точка идет на отрисовку компонента новой точки маршрута. В дальнейшем исправить
      this._renderTripInfo(points.slice(1));
    }
  }

  _renderMainMenu() {
    render(this._mainMenuNode, this._mainMenuComponent, RenderPosition.AFTERBEGIN);
  }

  _renderFilters() {
    render(this._filtersNode, this._filtersComponent, RenderPosition.BEFOREEND);
  }

  _renderNoPoints() {
    render(this._tripEventsNode, this._noPointsComponent, RenderPosition.AFTERBEGIN);
  }

  _renderEventsTable(points) {
    this._renderSorting();
    this._renderNewPoint(points[0]);

    for (let i = 1; i < POINTS_COUNT; i++) {
      this._renderPoint(points[i]);
    }
  }

  _renderSorting() {
    render(this._tripEventsNode, this._sortingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderNewPoint(point) {
    const newPointComponent = new NewPointView(point);
    render(this._tripEventsListNode, newPointComponent, RenderPosition.AFTERBEGIN);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._tripEventsListNode);

    pointPresenter.init(point);
  }

  _renderTripInfo(points) {
    const tripInfoPresenter = new TripInfoPresenter(this._tripMainNode);

    tripInfoPresenter.init(points);
  }
}
