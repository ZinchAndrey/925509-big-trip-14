import dayjs from 'dayjs';
import {nanoid} from 'nanoid';
import {DESTINATIONS, TYPES} from '../const.js';
import {getRandomInteger, getRandomArrEl} from '../utils/common.js';

const MAX_PRICE = 1000;

const OPTIONS = [
  {
    title: 'Add luggage',
    price: 30,
  },
  {
    title: 'Switch to comfort',
    price: 100,
  },
  {
    title: 'Book tickets',
    price: 40,
  },
  {
    title: 'Lunch in city',
    price: 30,
  },
  {
    title: 'Rent a car',
    price: 200,
  },
  {
    title: 'Add meal',
    price: 15,
  },
  {
    title: 'Choose seats',
    price: 5,
  },
  {
    title: 'Order Uber',
    price: 20,
  },
];

const timeMaxGap = {
  seconds: 60,
  minutes: 60,
  hours: 24,
  days: 30,
};

function generateRandomFutureDate(startDate) {
  return dayjs(startDate)
    .add(getRandomInteger(0, timeMaxGap.days), 'day')
    .add(getRandomInteger(0, timeMaxGap.hours), 'hour')
    .add(getRandomInteger(0, timeMaxGap.minutes), 'minute')
    .add(getRandomInteger(0, timeMaxGap.seconsds), 'second')
    .format('YYYY-MM-DD HH:mm:ss');
}

function generateRandomDate() {
  return dayjs('2021-04-25')
    .add(getRandomInteger(0, timeMaxGap.days), 'day')
    .add(getRandomInteger(0, timeMaxGap.hours), 'hour')
    .add(getRandomInteger(0, timeMaxGap.minutes), 'minute')
    .add(getRandomInteger(0, timeMaxGap.seconsds), 'second')
    .format('YYYY-MM-DD HH:mm:ss');
}

function generateOptions(options) {
  const randomQuantity = getRandomInteger(0, options.length - 1);
  const randomOptions = new Array(randomQuantity).fill().map(() => getRandomArrEl(options));

  return randomOptions;
}

function generateDate() {
  const dateFrom = generateRandomDate();
  const dateTo = generateRandomFutureDate(dateFrom);

  const date = {
    from: dateFrom,
    to: dateTo,
  };

  return date;
}

function generateDestinations() {
  const destinations = DESTINATIONS.map((destination, index) => {
    return {
      name: destination,
      description: `${destination}, is a beautiful city.`,
      pictures: [
        {
          src: `http://picsum.photos/248/152?r${index}`,
          description: `${destination} - photo 01`,
        },
        {
          src: `http://picsum.photos/248/152?r${index * 2}`,
          description: `${destination} - photo 02`,
        },
      ],
    };
  });

  return destinations;
}

function generateOffers() {
  const offers = TYPES.map((type) => {
    return {
      type: type.toLowerCase(),
      offers: generateOptions(OPTIONS),
    };
  });

  return offers;
}

export const destinations = generateDestinations();
export const offers = generateOffers();
// console.log(offers);

export function generatePoint() {
  const type = getRandomArrEl(TYPES).toLowerCase();

  return {
    id: nanoid(),
    type,
    destination: getRandomArrEl(destinations),
    offers: offers.find((offer) => {
      return offer.type === type;
    }).offers,
    data: {
      date: generateDate(),
      price: getRandomInteger(0, MAX_PRICE),
      isFavorite: Boolean(getRandomInteger(0, 1)),
    },
  };
}

// {
//   "base_price": 1100,
//   "date_from": "2019-07-10T22:55:56.845Z",
//   "date_to": "2019-07-11T11:22:13.375Z",
//   "destination":  - случайный элемент из массива destinations
//   "id": "0",
//   "is_favorite": false,
//   "offers":  - случайный массив из массива offers,
//   "type": "bus"
// }

