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
    // console.log(this._data);
    // возможно в дальнейшем понадобится обновлять данные без перерисовки (сохранение пользовательского ввода)
    if (justDataUpdating) {
      return;
    }

    this.updateElement();
  }

  restoreHandlers() {
    throw new Error('Abstract method not implemented: resetHandlers');
  }
}
