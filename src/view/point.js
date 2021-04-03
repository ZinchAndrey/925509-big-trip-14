import dayjs from 'dayjs';

export function createPointTemplate(point) {
  const {date, type, destination, price, isFavorite, options} = point;
  const favoriteClassName  = isFavorite ? 'event__favorite-btn--active' : '';

  // const dateFrom = dayjs(date.from).format('HH:mm');
  // const dateTo = dayjs(date.to).format('HH:mm');
  // const dateFromAttribute = dayjs(date.from).format('YYYY-MM-DD[T]HH:mm');
  // const dateToAttribute = dayjs(date.to).format('YYYY-MM-DD[T]HH:mm');
  function createOptionsTemplate() {
    let optionsMarkup ='';
    options.forEach((option) => {
      optionsMarkup += `<li class="event__offer">
        <span class="event__offer-title">${option.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${option.price}</span>
      </li>`;
    });
    return optionsMarkup;
  }

  const optionsMarkup = createOptionsTemplate();

  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${dayjs(date.from).format('YYYY-MM-DD')}">${dayjs(date.from).format('MMM DD')}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/taxi.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${destination}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${dayjs(date.from).format('YYYY-MM-DD[T]HH:mm')}">${dayjs(date.from).format('HH:mm')}</time>
          &mdash;
          <time class="event__end-time" datetime="${dayjs(date.to).format('YYYY-MM-DD[T]HH:mm')}">${dayjs(date.to).format('HH:mm')}</time>
        </p>
        <p class="event__duration">30M</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${optionsMarkup}
      </ul>
      <button class="event__favorite-btn ${favoriteClassName}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
}

