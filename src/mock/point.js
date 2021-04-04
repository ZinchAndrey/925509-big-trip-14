import dayjs from 'dayjs';

const TYPES = ['Taxi', 'Bus', 'Train', 'Ship', 'Transport', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];
const DESTINATIONS = ['Moscow', 'Roma', 'Paris', 'Istanbul', 'Athens', 'Madrid', 'Berlin', 'Budapest', 'Vienna'];
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

const photoSettings = {
  minQuantity: 1,
  maxQuantity: 5,
  maxSrcNumber: 100,
  src: 'http://picsum.photos/248/152?r',
};

const descriptionSettings = {
  sentenceMin: 1,
  sentenceMax: 5,
  mockText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus',
};

const timeMaxGap = {
  seconds: 60,
  minutes: 60,
  hours: 24,
  days: 30,
};

function getRandomInteger(a = 0, b = 1) {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
}

function getRandomArrEl(array) {
  const randomIndex = getRandomInteger(0, array.length - 1);

  return array[randomIndex];
}

function generateRandomFutureDate(startDate) {
  return dayjs(startDate)
    .add(getRandomInteger(0, timeMaxGap.days), 'day')
    .add(getRandomInteger(0, timeMaxGap.hours), 'hour')
    .add(getRandomInteger(0, timeMaxGap.minutes), 'minute')
    .add(getRandomInteger(0, timeMaxGap.seconsds), 'second')
    .format('YYYY-MM-DD HH:mm:ss');
}

function generatePhotos(photoSettings) {
  const randomQuantity = getRandomInteger(photoSettings.minQuantity, photoSettings.maxQuantity);
  const photos = new Array(randomQuantity).fill().map(() => photoSettings.src + getRandomInteger(0, photoSettings.maxSrcNumber));

  return photos;
}

function generateOptions(options) {
  const randomQuantity = getRandomInteger(0, options.length - 1);
  const randomOptions = new Array(randomQuantity).fill().map(() => getRandomArrEl(options));

  return randomOptions;
}

function generateDescription() {
  const mockTexts = descriptionSettings.mockText.split('.');
  const sentenceCount = getRandomInteger(descriptionSettings.sentenceMin, descriptionSettings.sentenceMax);
  let description = '';

  for (let i = 1; i <= sentenceCount; i++) {
    description += getRandomArrEl(mockTexts) + '.';
  }

  return description;

}

function generateDate() {
  const dateFrom = generateRandomFutureDate();
  const dateTo = generateRandomFutureDate(dateFrom);

  const date = {
    from: dateFrom,
    to: dateTo,
  };

  return date;
}

export function generatePoint() {
  return {
    destination: {
      description: generateDescription(),
      name: getRandomArrEl(DESTINATIONS),
      pictures: generatePhotos(photoSettings),
    },
    offer: {
      type: getRandomArrEl(TYPES).toLowerCase(),
      options: generateOptions(OPTIONS),
    },
    data: {
      date: generateDate(),
      price: getRandomInteger(0, MAX_PRICE),
      isFavorite: Boolean(getRandomInteger(0, 1)),
    },
  };
}

