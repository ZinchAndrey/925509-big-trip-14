import PointCreateView from '../view/point-create.js';

import {nanoid} from 'nanoid';
import {RenderPosition, render, remove} from '../utils/render.js';

import {UserAction, UpdateType} from '../const.js';

export default class PointCreate {
  constructor(tripEventsListNode, changeData, addNewPointBtn) {
    this._tripEventsListNode = tripEventsListNode;
    this._addNewPointBtn = addNewPointBtn;
    this._changeData = changeData;

    this._pointCreateComponent = null;


    this._handleEscPress = this._handleEscPress.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);

    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init() {
    if (this._pointCreateComponent !== null) {
      return;
    }

    this._pointCreateComponent = new PointCreateView();

    this._pointCreateComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointCreateComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._tripEventsListNode, this._pointCreateComponent, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this._handleEscPress);
  }

  destroy() {
    if (this._pointCreateComponent === null) {
      return;
    }

    remove(this._pointCreateComponent);
    this._pointCreateComponent = null;

    document.removeEventListener('keydown', this._handleEscPress);
  }

  _handleEscPress(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this.destroy();
      document.removeEventListener('keydown', this._handleEscPress);
      this._addNewPointBtn.disabled = false;
    }
  }

  _handleFormSubmit(updatedPoint) {
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      Object.assign(
        {},
        updatedPoint,
        {id: nanoid()},
      ),
    );

    this._addNewPointBtn.disabled = false;
    this.destroy();
  }

  _handleDeleteClick() {
    this._addNewPointBtn.disabled = false;
    this.destroy();
  }
}
