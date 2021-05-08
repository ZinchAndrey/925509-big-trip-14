// import dayjs from 'dayjs';

const DESTINATIONS = ['Moscow', 'Roma', 'Paris', 'Istanbul', 'Athens', 'Madrid', 'Berlin', 'Budapest', 'Vienna'];
const TYPES = ['Taxi', 'Bus', 'Train', 'Ship', 'Transport', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];
const POINTS_COUNT = 5;
const DEFAULT_POINT_TIME_DIF = 1; // hours

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
  PATCH: 'PATCH', // неясно, будет ли использоваться, так как при любых изменениях меняется либо весь список, либо нужно пересчитывать цену
  MINOR: 'MINOR', // обновление точки маршрута, вызовет перерисовку всего, кроме сброса типа сотрировки
  MAJOR: 'MAJOR', // обновление всего
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};


export {DESTINATIONS, TYPES, POINTS_COUNT, SortType, DEFAULT_POINT_TIME_DIF, UserAction, UpdateType, FilterType};
