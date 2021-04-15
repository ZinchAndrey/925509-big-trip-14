import AbstractView from './abstract.js';

function createTripInfoBlockTemplate() {
  return `<section class="trip-main__trip-info  trip-info">
    </section>`;
}

export default class TripInfoBlock extends AbstractView {
  getTemplate() {
    return createTripInfoBlockTemplate();
  }
}
