import Abstract from './abstract.js';

export default class Smart extends Abstract {
  constructor() {
    super();

    this._data = {};
  }

  updateElement() {
    const prevElement = this.getElement();
    const parentElement = prevElement.parentElement;

    // эта комбинация позволяет получить шаблон на основе обновленных данных
    this.removeElement();
    const newElement = this.getElement();

    parentElement.replaceChild(newElement, prevElement);

    this.restoreHandlers();
  }

  updateData(update, justDataUpdating = false) {
    if (!update) {
      return;
    }

    this._data = Object.assign(
      {},
      this._data,
      update,
    );

    if (justDataUpdating) {
      return;
    }

    this.updateElement();
  }

  restoreHandlers() {
    throw new Error('Abstract method not implemented: resetHandlers');
  }
}
