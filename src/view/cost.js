import { createElement } from '../utils.js';

function calcTripCost(points) {
  let tripCost = 0;
  points.forEach((point) => {
    const {offer, data} = point;
    const offersPrice = offer.options.reduce((sumPrice, currentOption) => {
      return sumPrice + currentOption.price;
    }, 0);
    tripCost += data.price + offersPrice;
  });

  return tripCost;
}

function createTripCostTemplate(points) {
  return `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${calcTripCost(points)}</span>
    </p>`;
}

export default class TripCost {
  constructor(points) {
    this._points = points;
    this._element = null;
  }

  getTemplate() {
    return createTripCostTemplate(this._points);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
