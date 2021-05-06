import PointCreateView from '../view/point-create.js';

import {nanoid} from 'nanoid';
import {RenderPosition, render, remove} from '../utils/render.js';

import {UserAction, UpdateType} from '../const.js';

// const Mode = {
//   DEFAULT: 'DEFAULT',
//   EDITING: 'EDITING',
// };

export default class PointCreate {
  constructor(tripEventsListNode, changeData, changeMode) {
    this._tripEventsListNode = tripEventsListNode;
    this._changeData = changeData;
    this._changeMode = changeMode; // неиспользуемый параметр

    this._pointCreateComponent = null;
    // this._mode = Mode.DEFAULT;


    this._handleEscPress = this._handleEscPress.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);

    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init() {
    if (this._pointCreateComponent !== null) {
      return;
    }

    this._pointCreateComponent = new PointCreateView();

    // this._point = point; // ???

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
    }
  }

  _handleFormSubmit(updatedPoint) {
    // console.log(updatedPoint);
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      Object.assign({}, updatedPoint, {id: nanoid()}),
    );

    this.destroy();
  }

  _handleDeleteClick() {
    // this._changeData(
    //   UserAction.DELETE_POINT,
    //   UpdateType.MINOR,
    //   point,
    // );
    this.destroy();
  }
}
