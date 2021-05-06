import {SortType, UserAction, UpdateType, FilterType} from '../const.js';

import MainMenuView from '../view/main-menu.js';
import FiltersView from '../view/filters.js';

import SortingView from '../view/sorting.js';
// import PointCreateView from '../view/point-create.js';

import NoPointsView from '../view/no-points.js';


import {RenderPosition, render, remove} from '../utils/render.js';
import {sortByDate, sortByPrice, sortByTime} from '../utils/point.js';
import {filter} from '../utils/filter.js';


import PointPresenter from './point.js';
import PointCreatePresenter from './point-create.js';
import TripInfoPresenter from './trip-info.js';

export default class Trip {
  constructor(tripMainNode, pageMainNode, pointsModel, filterModel) {

    this._tripMainNode = tripMainNode;
    this._mainMenuNode = this._tripMainNode.querySelector('.trip-controls__navigation');
    this._filtersNode = this._tripMainNode.querySelector('.trip-controls__filters');

    this._pageMainNode = pageMainNode;
    this._tripEventsNode = this._pageMainNode.querySelector('.trip-events');
    this._tripEventsListNode = this._tripEventsNode.querySelector('.trip-events__list');

    this._pointsModel = pointsModel;
    this._filterModel = filterModel;

    // this._sortingComponent = new SortingView();
    this._sortingComponent = null;

    this._mainMenuComponent = new MainMenuView();
    this._filtersComponent = new FiltersView();

    this._noPointsComponent = new NoPointsView();

    this._pointPresenter = {};
    this._tripInfoPresenter = {};

    this._currentSortType = SortType.DAY;

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._pointCreatePresenter = new PointCreatePresenter(this._tripEventsListNode, this._handleViewAction, this._handleModeChange);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderMainMenu();
    this._renderTrip();
  }

  createPoint() {
    this._currentSortType = SortType.DAY;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._pointCreatePresenter.init();
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();

    const filteredPoints = filter[filterType](points);

    switch (this._currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort(sortByDate);

      case SortType.PRICE:
        return filteredPoints.sort(sortByPrice);

      case SortType.TIME:
        return filteredPoints.sort(sortByTime);
    }
  }

  _renderMainMenu() {
    render(this._mainMenuNode, this._mainMenuComponent, RenderPosition.AFTERBEGIN);
  }

  _renderNoPoints() {
    render(this._tripEventsNode, this._noPointsComponent, RenderPosition.AFTERBEGIN);
  }

  // _renderNewPoint(point) {
  //   const pointCreateComponent = new PointCreateView(point);
  //   render(this._tripEventsListNode, pointCreateComponent, RenderPosition.AFTERBEGIN);
  // }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._tripEventsListNode, this._handleViewAction, this._handleModeChange);

    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _renderPointsList(points) {
    points.forEach((point) => {
      this._renderPoint(point);
    });
  }

  _renderSorting() {
    if (this._sortingComponent !== null) {
      this._sortingComponent === null;
    }

    this._sortingComponent = new SortingView(this._currentSortType);

    render(this._tripEventsNode, this._sortingComponent, RenderPosition.AFTERBEGIN);
    this._sortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderEventsTable(points) {
    this._renderSorting();
    this._renderPointsList(points);
  }

  _renderTripInfo(points) {
    this._tripInfoPresenter = new TripInfoPresenter(this._tripMainNode);

    this._tripInfoPresenter.init(points);
  }

  _renderTrip() {
    const points = this._getPoints();
    const pointsCount = points.length;

    if (!pointsCount) {
      this._renderNoPoints();
    } else {
      this._renderEventsTable(points);
      this._renderTripInfo(points);
    }
  }

  // при сортировке нам не нужно перерисовывать блок с информацией о поездке
  _clearEventsTable() {
    Object.values(this._pointPresenter).
      forEach((presenter) => {
        presenter.destroy();
      });

    this._pointPresenter = {};

    remove(this._sortingComponent);

    // Удаляем NoPointsComponent на случай, если не было точек и затем мы добавляем их
    remove(this._noPointsComponent);
  }

  _clearTrip({resetSortType = false} = {}) {
    this._pointCreatePresenter.destroy();
    this._clearEventsTable();

    // нужно удалять блок с информацией о поездке и отрисовывать заново
    if (this._tripInfoPresenter.destroy) {
      this._tripInfoPresenter.destroy();
    }
    this._tripInfoPresenter = {};


    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }

  _handleModeChange() {
    this._pointCreatePresenter.destroy();

    Object.values(this._pointPresenter).
      forEach((presenter) => {
        presenter.resetView();
      });
  }

  _handleViewAction(actionType, updateType, update) {
    // Здесь будет вызываться обновление модели
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;

      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;

      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    // В зависимости от типа изменений решаем, что делать:
    // data - данные о новой точке, по сути точка с update

    switch (updateType) {
      case UpdateType.PATCH:
        // ??? нужен ли такой тип обновления?
        this._pointPresenter[data.id].init(data);
        break;

      case UpdateType.MINOR:
        // - обновить список (без сброса сортировки)
        this._clearTrip();
        this._renderTrip();
        break;

      case UpdateType.MAJOR:
        // - обновить всю таблицу (например, при переключении фильтра)
        this._clearTrip({resetSortType: true});
        this._renderTrip();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;

    this._clearEventsTable();
    this._renderEventsTable(this._getPoints());
  }
}
