import {SortType, UserAction, UpdateType, FilterType} from '../const.js';

import FiltersView from '../view/filters.js';
import SortingView from '../view/sorting.js';
import NoPointsView from '../view/no-points.js';
import LoadingView from '../view/loading.js';

import {RenderPosition, render, remove} from '../utils/render.js';
import {sortByDate, sortByPrice, sortByTime} from '../utils/point.js';
import {filter} from '../utils/filter.js';

import PointPresenter, {State as PointPresenterViewState} from './point.js';

import PointCreatePresenter from './point-create.js';
import TripInfoPresenter from './trip-info.js';

export default class Trip {
  constructor(tripMainNode, pageMainNode, pointsModel, filterModel, offers, destinations, api) {

    this._tripMainNode = tripMainNode;
    this._mainMenuNode = this._tripMainNode.querySelector('.trip-controls__navigation');
    this._filtersNode = this._tripMainNode.querySelector('.trip-controls__filters');
    this._addNewPointBtn = tripMainNode.querySelector('.trip-main__event-add-btn');

    this._pageMainNode = pageMainNode;
    this._tripEventsNode = this._pageMainNode.querySelector('.trip-events');
    this._tripEventsListNode = this._tripEventsNode.querySelector('.trip-events__list');

    this._pointsModel = pointsModel;
    this._filterModel = filterModel;

    this._offers = offers;
    this._destinations = destinations;

    this._sortingComponent = null;

    this._filtersComponent = new FiltersView();
    this._loadingComponent = new LoadingView();

    this._noPointsComponent = null;
    this._isLoading = true;

    this._pointPresenter = {};
    this._tripInfoPresenter = {};

    this._currentSortType = SortType.DAY;

    this._api = api;

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handlePointCreateFormClose = this._handlePointCreateFormClose.bind(this);

    this._pointCreatePresenter = new PointCreatePresenter(this._tripEventsListNode, this._handleViewAction, this._addNewPointBtn);
  }

  init() {
    this._renderTrip();

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  destroy() {
    this._clearEventsTable();

    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  createPoint() {
    this._currentSortType = SortType.DAY;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    // часть выше можно удалить и передавать в createPoint callback, см коммиты 7.2.2 и 7.2.3

    if (this._noPointsComponent !== null) {
      remove(this._noPointsComponent);
      this._noPointsComponent === null;
    }

    this._pointCreatePresenter.init(this._handlePointCreateFormClose, this._offers, this._destinations);
  }

  hideEventsTable() {
    this._tripEventsNode.classList.add('trip-events--hidden');
  }

  showEventsTable() {
    this._tripEventsNode.classList.remove('trip-events--hidden');
    this._handleSortTypeChange(SortType.DAY);
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

  _renderNoPoints() {
    if (this._noPointsComponent === null) {
      this._noPointsComponent = new NoPointsView();
    }
    render(this._tripEventsNode, this._noPointsComponent, RenderPosition.AFTERBEGIN);
  }

  _renderLoading() {
    render(this._tripEventsNode, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._tripEventsListNode, this._handleViewAction, this._handleModeChange);
    const destinations = this._destinations;
    const offers = this._offers;

    pointPresenter.init(point, offers, destinations);
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
    if (Object.keys(this._tripInfoPresenter).length !== 0) {
      this._tripInfoPresenter.destroy();
      this._tripInfoPresenter = {};
    }
    this._tripInfoPresenter = new TripInfoPresenter(this._tripMainNode);

    this._tripInfoPresenter.init(points);
  }

  _renderTrip() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const points = this._getPoints();
    const pointsCount = points.length;

    if (!pointsCount) {
      this._renderNoPoints();
    } else {
      this._renderEventsTable(points);
      this._renderTripInfo(points);
    }
  }

  _clearEventsTable() {
    Object.values(this._pointPresenter).
      forEach((presenter) => {
        presenter.destroy();
      });

    this._pointPresenter = {};

    this._pointCreatePresenter.destroy();

    remove(this._sortingComponent);
    remove(this._noPointsComponent);
    remove(this._loadingComponent);
  }

  _clearTrip({resetSortType = false} = {}) {
    this._clearEventsTable();

    if (this._tripInfoPresenter.destroy) {
      this._tripInfoPresenter.destroy();
    }
    this._tripInfoPresenter = {};


    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }

  _handlePointCreateFormClose() {
    const points = this._getPoints();
    const pointsCount = points.length;

    if (!pointsCount) {
      this._renderNoPoints();
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
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointPresenter[update.id].setViewState(PointPresenterViewState.SAVING);
        this._api.updatePoint(update)
          .then((response) => {
            this._pointsModel.updatePoint(updateType, response);
          })
          .catch(() => {
            this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
          });
        break;

      case UserAction.ADD_POINT:
        this._pointCreatePresenter.setSaving();
        this._api.addPoint(update)
          .then((response) => {
            this._pointsModel.addPoint(updateType, response);
            // разблочить кнопку только после ответа сервера
            // this._addNewPointBtn.disabled = false; - лишнее
          })
          .catch(() => {
            this._pointCreatePresenter.setAborting();
          });
        break;

      case UserAction.DELETE_POINT:
        this._pointPresenter[update.id].setViewState(PointPresenterViewState.DELETING);
        this._api.deletePoint(update)
          .then(() => {
            this._pointsModel.deletePoint(updateType, update);
          })
          .catch(() => {
            this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
          });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    // data - данные о новой точке, по сути точка с update
    switch (updateType) {
      case UpdateType.PATCH:
        // для offers
        this._pointPresenter[data.id].init(data);
        break;

      case UpdateType.MINOR:
        this._clearTrip();
        this._renderTrip();
        break;

      case UpdateType.MAJOR:
        this._clearTrip({resetSortType: true});
        this._renderTrip();
        break;

      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
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
