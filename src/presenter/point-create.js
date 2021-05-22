import PointCreateView from '../view/point-create.js';

import {RenderPosition, render, remove} from '../utils/render.js';

import {UserAction, UpdateType} from '../const.js';

export default class PointCreate {
  constructor(tripEventsListNode, changeData, addNewPointBtn) {
    this._tripEventsListNode = tripEventsListNode;
    this._addNewPointBtn = addNewPointBtn;
    this._changeData = changeData;

    this._pointCreateComponent = null;

    this._checkPointsCountCallback = null;


    this._handleEscPress = this._handleEscPress.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);

    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(callback, offers, destinations) {
    this._checkPointsCountCallback = callback;

    if (this._pointCreateComponent !== null) {
      return;
    }
    this._pointCreateComponent = new PointCreateView(undefined, offers, destinations);

    this._pointCreateComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointCreateComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._tripEventsListNode, this._pointCreateComponent, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this._handleEscPress);
  }

  destroy() {
    // при скрытии формы создания точки, всегда нужно возвращать кнопку в активное состояние
    this._addNewPointBtn.disabled = false;

    if (this._pointCreateComponent === null) {
      return;
    }

    remove(this._pointCreateComponent);
    this._pointCreateComponent = null;

    document.removeEventListener('keydown', this._handleEscPress);

  }

  setSaving() {
    this._pointCreateComponent.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._pointCreateComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this._pointCreateComponent.shake(resetFormState);
  }

  _handleEscPress(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this._checkPointsCountCallback();
      this.destroy();
      document.removeEventListener('keydown', this._handleEscPress);
    }
  }

  _handleFormSubmit(updatedPoint) {
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      updatedPoint, // id будет присваиваться сервером
    );
  }

  _handleDeleteClick() {
    this._checkPointsCountCallback();
    this.destroy();
  }
}
