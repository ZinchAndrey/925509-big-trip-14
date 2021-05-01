import { SortType} from '../const.js';

import TripInfoBlockView from '../view/trip-info-block.js';
import TripInfoView from '../view/trip-info.js';
import TripCostView from '../view/cost';

import MainMenuView from '../view/main-menu.js';
import FiltersView from '../view/filters.js';

import SortingView from '../view/sorting.js';
import NewPointView from '../view/point-create.js';

import NoPointsView from '../view/no-points.js';

import {RenderPosition, render} from '../utils/render.js';
import {sortByDate, sortByPrice, sortByTime} from '../utils/point.js';

import PointPresenter from './point.js';
import TripInfoPresenter from './trip-info.js';

export default class Trip {
  constructor(tripMainNode, pageMainNode, pointsModel) {

    this._tripMainNode = tripMainNode;
    this._mainMenuNode = this._tripMainNode.querySelector('.trip-controls__navigation');
    this._filtersNode = this._tripMainNode.querySelector('.trip-controls__filters');

    this._pageMainNode = pageMainNode;
    this._tripEventsNode = this._pageMainNode.querySelector('.trip-events');
    this._tripEventsListNode = this._tripEventsNode.querySelector('.trip-events__list');

    this._pointsModel = pointsModel;

    this._sortingComponent = new SortingView();

    this._tripInfoBlockComponent = new TripInfoBlockView();
    this._tripInfoComponent = new TripInfoView();
    this._tripCostComponent = new TripCostView();

    this._mainMenuComponent = new MainMenuView();
    this._filtersComponent = new FiltersView();

    this._noPointsComponent = new NoPointsView();

    this._pointPresenter = {};

    this._currentSortType = SortType.DAY;

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init() {
    // console.log(points);
    // this._points = points.slice();

    this._renderMainMenu();
    this._renderFilters();

    if (!this._getPoints().length) {
      this._renderNoPoints();
    } else {
      this._renderEventsTable(this._getPoints());

      this._renderTripInfo(this._getPoints());
    }
  }

  _getPoints() {
    switch (this._currentSortType) {
      case SortType.DAY:
        this._pointsModel.getPoints().slice().sort(sortByDate);
        break;

      case SortType.PRICE:
        this._pointsModel.getPoints().slice().sort(sortByPrice);
        break;

      case SortType.TIME:
        this._pointsModel.getPoints().slice().sort(sortByTime);
        break;
    }

    return this._pointsModel.getPoints();
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

  _renderPointsList(points) {
    points.forEach((point) => {
      this._renderPoint(point);
    });
  }

  _renderEventsTable(points) {
    this._renderSorting();
    // временно убираем рендер новой точки маршрута, чтобы не было конфликтов id у label-ов с формой редактирования
    // this._renderNewPoint(points[0]);
    this._renderPointsList(points);
  }

  _renderSorting() {
    render(this._tripEventsNode, this._sortingComponent, RenderPosition.AFTERBEGIN);
    this._sortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderNewPoint(point) {
    const newPointComponent = new NewPointView(point);
    render(this._tripEventsListNode, newPointComponent, RenderPosition.AFTERBEGIN);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._tripEventsListNode, this._handlePointChange, this._handleModeChange);

    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _renderTripInfo(points) {
    const tripInfoPresenter = new TripInfoPresenter(this._tripMainNode);

    tripInfoPresenter.init(points);
  }

  _clearPointsList() {
    Object.values(this._pointPresenter).
      forEach((presenter) => {
        presenter.destroy();
      });

    this._pointPresenter = {};
  }

  _handleModeChange() {
    Object.values(this._pointPresenter).
      forEach((presenter) => {
        presenter.resetView();
      });
  }

  _handlePointChange(updatedPoint) {
    // Здесь будем вызывать обновление модели

    this._pointPresenter[updatedPoint.id].init(updatedPoint);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearPointsList();
    this._renderPointsList(this._getPoints());
  }
}
