// import PointView from '../view/point.js';
import PointCreateView from '../view/point-create.js';

import {nanoid} from 'nanoid';
import {RenderPosition, render, remove} from '../utils/render.js';

import {UserAction, UpdateType} from '../const.js';

// const Mode = {
//   DEFAULT: 'DEFAULT',
//   EDITING: 'EDITING',
// };

export default class PointNew {
  constructor(tripEventsListNode, changeData, changeMode) {
    this._tripEventsListNode = tripEventsListNode;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._pointComponent = null;
    this._pointNewComponent = null;
    this._editPointComponent = null;
    // this._mode = Mode.DEFAULT;


    this._handleEscPress = this._handleEscPress.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);

    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init() {
    if (this._pointNewComponent !== null) {
      return;
    }

    this._pointNewComponent = new PointCreateView();

    // this._point = point; // ???

    this._pointNewComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointNewComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._tripEventsListNode, this._pointNewComponent, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this._handleEscPress);
  }

  destroy() {
    if (this._pointNewComponent === null) {
      return;
    }

    remove(this._pointNewComponent);
    this._pointNewComponent = null;

    document.removeEventListener('keydown', this._handleEscPress);
  }

  _handleEscPress(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this.destroy();
      document.removeEventListener('keydown', this._handleEscPress);
    }
  }

  _handleFormSubmit(updatedPoint) {
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      Object.assign({}, updatedPoint, {id: nanoid()}),
    );

    this.destroy;
  }

  _handleDeleteClick(point) {
    this._changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  }
}
