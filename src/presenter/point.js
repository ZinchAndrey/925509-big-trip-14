import PointView from '../view/point.js';
import PointEditView from '../view/point-edit.js';

import {RenderPosition, render, replace, remove} from '../utils/render.js';


export default class Point {
  constructor(tripEventsListNode, changeData) {
    this._pointComponent = null;
    this._editPointComponent = null;

    this._changeData = changeData;
    this._tripEventsListNode = tripEventsListNode;

    this._replacePointToEdit = this._replacePointToEdit.bind(this);
    this._replaceEditToPoint = this._replaceEditToPoint.bind(this);
    this._pressEscHandler = this._pressEscHandler.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(point) {
    // возможно, необходимо записать точку в приватное свойство this._point

    const prevPointComponent = this._pointComponent;
    const prevEditPointComponent = this._editPointComponent;

    this._pointComponent = new PointView(point);
    this._editPointComponent = new PointEditView(point);

    this._point = point;

    this._pointComponent.setRollUpClickHandler(this._replacePointToEdit);
    this._pointComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    this._editPointComponent.setRollUpClickHandler(this._replaceEditToPoint);
    this._editPointComponent.setFormSubmitHandler(this._replaceEditToPoint);

    if (prevPointComponent === null || prevEditPointComponent === null) {
      render(this._tripEventsListNode, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._tripEventsListNode.contains(prevPointComponent.getElement())) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._tripEventsListNode.contains(prevEditPointComponent.getElement())) {
      replace(this._editPointComponent, prevEditPointComponent);
    }

    remove(prevPointComponent);
    remove(prevEditPointComponent);
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._editPointComponent);
  }

  _pressEscHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this._replaceEditToPoint();
      document.removeEventListener('keydown', this._pressEscHandler);
    }
  }

  _replacePointToEdit() {
    replace(this._editPointComponent, this._pointComponent);
    document.addEventListener('keydown', this._pressEscHandler);
  }

  _handleEditClick() {
    this._replacePointToEdit();
  }

  _replaceEditToPoint() {
    replace(this._pointComponent, this._editPointComponent);
    document.removeEventListener('keydown', this._pressEscHandler);
  }

  _handleFavoriteClick() {
    this._changeData(
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
}
