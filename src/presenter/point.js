import PointView from '../view/point.js';
import PointEditView from '../view/point-edit.js';

import {RenderPosition, render, replace} from '../utils/render.js';


export default class Point {
  constructor(tripEventsListNode) {
    this._pointComponent = null;
    this._editPointComponent = null;

    this._tripEventsListNode = tripEventsListNode;

    /* не очень понятно, требуется ли тут дополнительно биндить или нет,
    так как в конструкторе PointView this._rollUpClickHandler забинден */

  }

  init(point) {
    this._pointComponent = new PointView(point);
    this._editPointComponent = new PointEditView(point);

    this._pointComponent.setRollUpClickHandler(this._replacePointToEdit);
    this._editPointComponent.setRollUpClickHandler(this._replaceEditToPoint);
    this._editPointComponent.setFormSubmitHandler(this._replaceEditToPoint);

    render(this._tripEventsListNode, this._pointComponent, RenderPosition.BEFOREEND);
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

  _replaceEditToPoint() {
    replace(this._pointComponent, this._editPointComponent);
    document.removeEventListener('keydown', this._pressEscHandler);
  }
}
