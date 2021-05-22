const DESTINATIONS = ['Moscow', 'Roma', 'Paris', 'Istanbul', 'Athens', 'Madrid', 'Berlin', 'Budapest', 'Vienna'];
const TYPES = ['Taxi', 'Bus', 'Train', 'Ship', 'Transport', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];
const DEFAULT_POINT_TIME_DIF = 1; // hours
const INIT_ERROR_MESSAGE = 'Возникла проблема с сервером. Попробуйте перезагрузить страницу';

const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR', // обновление точки маршрута, вызовет перерисовку всего, кроме сброса типа сотрировки
  MAJOR: 'MAJOR', // обновление всего
  INIT: 'INIT', // начальная инициализация
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

const MenuItem = {
  TABLE: 'Table',
  STATS: 'Stats',
};

export {DESTINATIONS, TYPES, INIT_ERROR_MESSAGE, SortType, DEFAULT_POINT_TIME_DIF, UserAction, UpdateType, FilterType, MenuItem};
