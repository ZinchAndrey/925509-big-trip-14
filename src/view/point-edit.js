import dayjs from 'dayjs';
import {DESTINATIONS, TYPES} from '../const.js';
import {getRandomInteger} from '../utils/common.js';
import SmartView from './smart.js';

import flatpickr from 'flatpickr';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

// в дальнешем эти данные будем получать с сервера
import {destinations, offers} from '../mock/point.js';

function createDestinationDatalistTemplate(destinations) {
  let optionsMarkup = '';
  destinations.forEach((destination) => {
    optionsMarkup += `<option value="${destination}"></option>`;
  });
  return optionsMarkup;
}

function createOptionOffersTemplate(options) {
  if (!options.length) {
    return '';
  }

  let optionsMarkup = '';
  options.forEach((option, index) => {
    const isChecked  = getRandomInteger(0, 1) ? 'checked' : '';
    const id = `event-offer-${option.title.toLowerCase().split(' ').join('-')}-${index + 1}`;

    optionsMarkup += `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="${id}" type="checkbox" name="${id}" ${isChecked}>
    <label class="event__offer-label" for="${id}">
      <span class="event__offer-title">${option.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${option.price}</span>
    </label>
  </div>`;
  });

  return `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
      ${optionsMarkup}
      </div>
    </section>`;
}

function createEventTypeItemsTemplate(chosenType, types) {
  let itemsMarkup = '';

  types.forEach((currentType) => {
    itemsMarkup += `<div class="event__type-item">
      <input id="event-type-${currentType.toLowerCase()}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${currentType.toLowerCase()}" ${currentType.toLowerCase() === chosenType ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${currentType.toLowerCase()}" for="event-type-${currentType.toLowerCase()}">${currentType}</label>
    </div>`;
  });

  return itemsMarkup;
}

function createPicturesTemplate(pictures) {
  let picturesMarkup = '';
  pictures.forEach((picture) => {
    picturesMarkup += `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`;
  });
  return picturesMarkup;
}

function createPointEditTemplate(pointData) {
  const {destination, offers, data, type} = pointData;
  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${createEventTypeItemsTemplate(type, TYPES)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination" type="text" name="event-destination" value="${destination.name}" list="destination-list">
          <datalist id="destination-list">
            ${createDestinationDatalistTemplate(DESTINATIONS)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs(data.date.from).format('DD/MM/YY HH:mm')}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayjs(data.date.to).format('DD/MM/YY HH:mm')}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${data.price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        ${createOptionOffersTemplate(offers)}

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destination.description}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${createPicturesTemplate(destination.pictures)}
            </div>
          </div>
          </section>
      </section>
    </form>
  </li>`;
}

export default class PointEdit extends SmartView {
  constructor(point) {
    super();
    // this._point = point;
    this._data = PointEdit.parsePointToData(point);

    this._datepickerFrom = null;
    this._datepickerTo = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._rollUpClickHandler = this._rollUpClickHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._dateFromChangeHandler = this._dateFromChangeHandler.bind(this);
    this._dateToChangeHandler = this._dateToChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setFromDatepicker();
    this._setToDatepicker();
  }

  getTemplate() {
    return createPointEditTemplate(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();

    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setRollUpClickHandler(this._callback.rollUpClick);

    this._setFromDatepicker();
    this._setToDatepicker();
  }

  reset(point) {
    this.updateData(PointEdit.parsePointToData(point));
  }

  _setFromDatepicker() {
    if (this._datepickerFrom) {
      this._datepickerFrom.destroy();
      this._datepickerFrom = null;
    }

    this._datepickerFrom = flatpickr(
      this.getElement().querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: dayjs(this._data.data.date.from).toDate(),
        onChange: this._dateFromChangeHandler,
      },
    );
  }

  _setToDatepicker() {
    if (this._datepickerTo) {
      this._datepickerTo.destroy();
      this._datepickerTo = null;
    }

    this._datepickerTo = flatpickr(
      this.getElement().querySelector('#event-end-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: dayjs(this._data.data.date.to).toDate(),
        onChange: this._dateToChangeHandler,
      },
    );
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.event__type-list')
      .addEventListener('click', this._typeChangeHandler);

    this.getElement()
      .querySelector('#event-destination')
      .addEventListener('change', this._destinationChangeHandler);
  }

  _typeChangeHandler(evt) {
    if (evt.target.tagName === 'LABEL') {
      const newType = evt.target.parentElement.querySelector('input').value;

      const offersItem = offers.find((offer) => {
        return offer.type === newType;
      }).offers;

      if (offersItem) {
        this.updateData({
          type: newType,
          offers: offersItem,
        });
      }
    }
  }

  _destinationChangeHandler(evt) {
    const newDestinationName = evt.currentTarget.value;

    const destinationItem = destinations.find((destination) => {
      return destination.name === newDestinationName;
    });

    if (destinationItem) {
      this.updateData({
        destination: destinationItem,
      });
    }
  }

  _dateFromChangeHandler([userDate]) {
    this.updateData({
      data: Object.assign(
        {},
        this._data.data,
        {
          date: {
            from: userDate,
            to: this._data.data.date.to,
          },
        },
      ),
    });
  }

  _dateToChangeHandler([userDate]) {
    this.updateData({
      data: Object.assign(
        {},
        this._data.data,
        {
          date: {
            from: this._data.data.date.from,
            to: userDate,
          },
        },
      ),
    });
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(PointEdit.parseDataToPoint(this._data));
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }

  _rollUpClickHandler(evt) {
    evt.preventDefault();
    this._callback.rollUpClick();
  }

  setRollUpClickHandler(callback) {
    this._callback.rollUpClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._rollUpClickHandler);
  }

  static parseDataToPoint(data) {
    const point = Object.assign({}, data);

    return point;
  }

  static parsePointToData(point) {
    const data = Object.assign({}, point);

    return data;
  }
}
