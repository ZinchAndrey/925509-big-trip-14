import PointView from '../view/point.js';
import PointEditView from '../view/point-edit.js';

import {RenderPosition, render, replace, remove} from '../utils/render.js';

import {UserAction, UpdateType} from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
};

export default class Point {
  constructor(tripEventsListNode, changeData, changeMode) {
    this._tripEventsListNode = tripEventsListNode;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._pointComponent = null;
    this._editPointComponent = null;
    this._mode = Mode.DEFAULT;

    // this._destinations = destinations;

    this._replacePointToEdit = this._replacePointToEdit.bind(this);
    this._replaceEditToPoint = this._replaceEditToPoint.bind(this);
    this._handleEscPress = this._handleEscPress.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleRollUpClick = this._handleRollUpClick.bind(this);

    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(point, offers, destinations) {
    const prevPointComponent = this._pointComponent;
    const prevEditPointComponent = this._editPointComponent;

    this._pointComponent = new PointView(point);
    this._editPointComponent = new PointEditView(point, offers, destinations);

    this._point = point;

    this._pointComponent.setRollUpClickHandler(this._replacePointToEdit);
    this._pointComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    this._editPointComponent.setRollUpClickHandler(this._handleRollUpClick);
    this._editPointComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._editPointComponent.setDeleteClickHandler(this._handleDeleteClick);

    if (prevPointComponent === null || prevEditPointComponent === null) {
      render(this._tripEventsListNode, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    // if (this._tripEventsListNode.contains(prevPointComponent.getElement())) {
    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }

    // if (this._tripEventsListNode.contains(prevEditPointComponent.getElement())) {
    if (this._mode === Mode.EDITING) {
      replace(this._pointComponent, prevEditPointComponent);
      this._mode === Mode.DEFAULT;
    }

    remove(prevPointComponent);
    remove(prevEditPointComponent);
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._editPointComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      // при клике на редактирование другой точки нужно сбросить данные в ранее открытой
      this._changeData(this._point);

      this._replaceEditToPoint();
    }
  }

  setViewState(state) {
    switch (state) {
      case State.SAVING:
        this._editPointComponent.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this._editPointComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
    }
  }

  _handleEscPress(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this._editPointComponent.reset(this._point);
      this._replaceEditToPoint();
      document.removeEventListener('keydown', this._handleEscPress);
    }
  }

  _handleRollUpClick() {
    this._editPointComponent.reset(this._point);
    this._replaceEditToPoint();
  }

  _replacePointToEdit() {
    replace(this._editPointComponent, this._pointComponent);
    document.addEventListener('keydown', this._handleEscPress);

    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceEditToPoint() {
    replace(this._pointComponent, this._editPointComponent);
    document.removeEventListener('keydown', this._handleEscPress);

    this._mode = Mode.DEFAULT;
  }

  _handleEditClick() {
    this._replacePointToEdit();
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._point,
        {
          data: Object.assign(
            {},
            this._point.data,
            {
              isFavorite: !this._point.data.isFavorite,
            },
          ),
        },
      ),
    );
  }

  _handleFormSubmit(updatedPoint) {
    // здесь можно проверять, какого типа изменения произошли (коммит 7.1.6), и если не требующие перерисовки, то делать обновление типа PATCH.
    this._changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      updatedPoint,
    );
    // this._replaceEditToPoint();
  }

  _handleDeleteClick(point) {
    this._changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  }
}
