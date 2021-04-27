import dayjs from 'dayjs';
import {nanoid} from 'nanoid';
import {DESTINATIONS} from '../const.js';
import {getRandomInteger, getRandomArrEl} from '../utils/common.js';

const TYPES = ['Taxi', 'Bus', 'Train', 'Ship', 'Transport', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];
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

// const photoSettings = {
//   minQuantity: 1,
//   maxQuantity: 5,
//   maxSrcNumber: 100,
//   src: 'http://picsum.photos/248/152?r',
// };

// const descriptionSettings = {
//   sentenceMin: 1,
//   sentenceMax: 5,
//   mockText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus',
// };

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

// function generatePhotos(photoSettings) {
//   const randomQuantity = getRandomInteger(photoSettings.minQuantity, photoSettings.maxQuantity);
//   const photos = new Array(randomQuantity).fill().map(() => photoSettings.src + getRandomInteger(0, photoSettings.maxSrcNumber));

//   return photos;
// }

function generateOptions(options) {
  const randomQuantity = getRandomInteger(0, options.length - 1);
  const randomOptions = new Array(randomQuantity).fill().map(() => getRandomArrEl(options));

  return randomOptions;
}

// function generateDescription() {
//   const mockTexts = descriptionSettings.mockText.split('.');
//   const sentenceCount = getRandomInteger(descriptionSettings.sentenceMin, descriptionSettings.sentenceMax);
//   let description = '';

//   for (let i = 1; i <= sentenceCount; i++) {
//     description += getRandomArrEl(mockTexts) + '.';
//   }

//   return description;

// }

function generateDate() {
  const dateFrom = generateRandomFutureDate();
  const dateTo = generateRandomFutureDate(dateFrom);

  const date = {
    from: dateFrom,
    to: dateTo,
  };

  return date;
}

function generateDestinations() {
  const destinations = [];

  DESTINATIONS.forEach((destination, index) => {
    destinations.push({
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
    });
  });

  return destinations;
}

function generateOffers() {
  const offers = [];
  TYPES.forEach((type) => {
    offers.push({
      type: type.toLowerCase(),
      offers: generateOptions(OPTIONS),
    });
  });

  return offers;
}

const destinations = generateDestinations();
const offers = generateOffers();

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

