import Observer from '../utils/observer.js';

export default class Points extends Observer {
  constructor() {
    super();

    this._points = [];
  }

  setPoints(points) {
    this._points = points.slice();
  }

  getPoints() {
    return this._points;
  }

  updatePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this._points = [
      ...this._points.slice(0, index),
      update,
      ...this._points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this._points = [
      update,
      ...this._points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1),
    ];

    this._notify(updateType);
  }

  static adaptToClient(point) {
    const adaptedPoint = Object.assign(
      {},
      point,
      {
        id: point.id,
        type: point.type,
        destination: point.destination, // 3 пункта выше можно убрать

        offers: { // переделать и впоследствии убрать вложенность
          type: point.type,
          offers: point.offers,
        },
        data: {
          date: {
            // дату нужно передавать в формате ISO, для этого на клиенте храним ее в Date
            // в дальнейшем проверить, что в Date формате храним дату
            from: point.date_from !== null ? new Date(point.date_from) : point.date_from,
            to: point.date_to !== null ? new Date(point.date_to) : point.date.to,
          },
          price: point.base_price,
          isFavorite: point.is_favorite,
        },

        // dueDate: point.due_date !== null ? new Date(point.due_date) : point.due_date, // На клиенте дата хранится как экземпляр Date,
      },
    );

    // Ненужные ключи мы удаляем
    delete adaptedPoint.offers; // впоследствие не нужно удалять
    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.base_price;
    delete adaptedPoint.is_favorite;

    return adaptedPoint;
  }

  static adaptToServer(point) {
    const adaptedPoint = Object.assign(
      {},
      point,
      { // дату нужно передавать в формате ISO, для этого на клиенте храним ее в Date
        'date_from': point.data.date.from instanceof Date ? point.data.date.from.toISOString() : null,
        'date_to': point.data.date.to instanceof Date ? point.data.date.to.toISOString() : null,
        'base_price': point.price,
        'is_favorite': point.isFavorite,

        'offers': point.offers.offers, // в дальнейшем исправить на point.offers
      },
    );

    // Ненужные ключи мы удаляем
    delete adaptedPoint.data;

    return adaptedPoint;
  }
}
