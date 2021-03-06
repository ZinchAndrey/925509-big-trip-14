import Observer from '../utils/observer.js';

export default class Points extends Observer {
  constructor() {
    super();

    this._points = [];
  }

  setPoints(updateType, points) {
    this._points = points.slice();

    this._notify(updateType);
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
      },
    );

    // Ненужные ключи мы удаляем
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
        'base_price': point.data.price,
        'is_favorite': point.data.isFavorite,

        'offers': point.offers,
      },
    );

    // Ненужные ключи мы удаляем
    delete adaptedPoint.data;
    return adaptedPoint;
  }
}
