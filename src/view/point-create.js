import dayjs from 'dayjs';
import he from 'he';
import {TYPES, DEFAULT_POINT_TIME_DIF} from '../const.js';
import SmartView from './smart.js';

import flatpickr from 'flatpickr';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

// в дальнешем эти данные будем получать с сервера
// import {destinations, offers} from '../mock/point.js';

const typeBlank = TYPES[0].toLowerCase();

// const POINT_BLANK = {
//   type: typeBlank,
//   destination: destinations.find((destination) => {
//     return destination.name === DESTINATIONS[0];
//   }),
//   offers: offers.find((offer) => {
//     return offer.type === typeBlank;
//   }).offers,
//   data: {
//     date: {
//       from: dayjs().format('YYYY-MM-DD HH:mm:ss'),
//       to: dayjs().format('YYYY-MM-DD HH:mm:ss'),
//     },
//     price: 0,
//     isFavorite: false,
//   },
// };


function createDestinationDatalistTemplate(destinations) {
  let optionsMarkup = '';
  destinations.forEach((destination) => {
    optionsMarkup += `<option value="${destination.name}"></option>`;
  });
  return optionsMarkup;
}

function createOptionOffersTemplate(allOffersOfCurrentType, checkedOffers) {
  const allOffers = allOffersOfCurrentType.offers;

  if (!allOffers.length) {
    return '';
  }
  let optionsMarkup = '';
  allOffers.forEach((offer, index) => {
    const isChecked  = checkedOffers.find((checkedOffer) => {
      return checkedOffer.title === offer.title;
    });
    const id = `event-offer-${offer.title.toLowerCase().split(' ').join('-')}-${index + 1}`;

    optionsMarkup += `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="${id}" type="checkbox" name="${id}" ${isChecked ? 'checked' : ''}>
    <label class="event__offer-label" for="${id}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
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

function createPointCreateTemplate(pointData, offersData, destinationsData) {
  const {destination, data, type} = pointData;

  // будет использоваться для отметки checked
  const checkedOffers = pointData.offers;
  const destinations = destinationsData;
  const allOffersOfCurrentType = offersData.find((item) => {
    return item.type === type;
  });

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
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination" type="text" name="event-destination" value="${he.encode(destination.name)}" list="destination-list">
          <datalist id="destination-list">
            ${createDestinationDatalistTemplate(destinations)}
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
          <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${data.price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
      </header>
      <section class="event__details">
        ${createOptionOffersTemplate(allOffersOfCurrentType, checkedOffers)}

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

export default class PointCreate extends SmartView {
  constructor(point, offers, destinations) {
    super();
    // this._point = point;
    // console.log(offers, destinations);
    this._data = PointCreate.createPointBlank(point, destinations);

    this._datepickerFrom = null;
    this._datepickerTo = null;

    this._destinations = destinations;
    this._offers = offers;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);

    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._basicPriceChangeHandler = this._basicPriceChangeHandler.bind(this);


    this._dateFromChangeHandler = this._dateFromChangeHandler.bind(this);
    this._dateToChangeHandler = this._dateToChangeHandler.bind(this);

    this._setInnerHandlers();

    this._setFromDatepicker();
    this._setToDatepicker();
  }

  // Перегружаем метод родителя removeElement,
  // чтобы при удалении удалялся более ненужный календарь
  removeElement() {
    super.removeElement();

    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  }

  getTemplate() {
    return createPointCreateTemplate(this._data, this._offers, this._destinations);
  }

  restoreHandlers() {
    this._setInnerHandlers();

    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);

    this._setFromDatepicker();
    this._setToDatepicker();
  }

  reset(point) {
    this.updateData(PointCreate.parsePointToData(point));
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
        time_24hr: true,
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
        time_24hr: true,
        minDate: dayjs(this._data.data.date.from).toDate(),
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

    this.getElement()
      .querySelector('#event-price-1')
      .addEventListener('change', this._basicPriceChangeHandler);
  }

  _typeChangeHandler(evt) {
    if (evt.target.classList.contains('event__type-label')) {
      const newType = evt.target.parentElement.querySelector('input').value;

      if (newType === this._data.type) {
        return;
      }

      this.updateData({
        type: newType,
        offers: [],
      });
    }
  }

  _getDestinationList(destinations) {
    const destinationList = destinations.map((destination) => destination.name);
    return destinationList;
  }

  _destinationChangeHandler(evt) {
    const newDestinationName = evt.currentTarget.value;

    if (newDestinationName === this._data.destination) {
      return;
    } else if (this._getDestinationList(this._destinations).indexOf(newDestinationName) === -1) {
      evt.currentTarget.value = '';
      return;
    }

    const destinationItem = this._destinations.find((destination) => {
      return destination.name === newDestinationName;
    });

    if (destinationItem) {
      this.updateData({
        destination: destinationItem,
      });
    }
  }

  _basicPriceChangeHandler(evt) {
    const newPrice = parseInt(evt.currentTarget.value);
    const justDataUpdating = true; // для читабельности

    this.updateData({
      data: Object.assign(
        {},
        this._data.data,
        {
          price: newPrice,
        },
      ),
    }, justDataUpdating);
  }

  _dateFromChangeHandler([userDate]) {
    // если пользователь выберет дату начала после даты окончания, дата окончания должна обновиться
    const isFromAfterTo = userDate > dayjs(this._data.data.date.to).toDate();

    this.updateData({
      data: Object.assign(
        {},
        this._data.data,
        {
          date: {
            from: dayjs(userDate).format('YYYY-MM-DD HH:mm:ss'),
            to: isFromAfterTo ?
              dayjs(userDate).add(DEFAULT_POINT_TIME_DIF, 'hour').format('YYYY-MM-DD HH:mm:ss') :
              this._data.data.date.to,
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
            to: dayjs(userDate).format('YYYY-MM-DD HH:mm:ss'),
          },
        },
      ),
    });
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    const newDestinationName = this.getElement().querySelector('#event-destination');

    if (this._getDestinationList(this._destinations).indexOf(newDestinationName.value) === -1) {
      newDestinationName.value = '';
      return;
    }

    this._callback.formSubmit(PointCreate.parseDataToPoint(this._data));
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    // this._callback.deleteClick(PointCreate.parseDataToPoint(this._data));
    this._callback.deleteClick();
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._formDeleteClickHandler);
  }

  static parseDataToPoint(data) {
    const point = Object.assign({}, data);

    return point;
  }

  static parsePointToData(point) {
    const data = Object.assign({}, point);

    return data;
  }

  static createPointBlank(point, destinations) {
    if (point) {
      return PointCreate.parsePointToData(point);
    }

    const pointBlank = {
      type: typeBlank,
      destination: destinations[0],
      offers: [],
      data: {
        date: {
          from: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          to: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        },
        price: 0,
        isFavorite: false,
      },
    };

    return PointCreate.parsePointToData(pointBlank);
  }
}

