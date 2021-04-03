import dayjs from 'dayjs';

function getRandomInteger(a = 0, b = 1) {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
}

// проверить наименование констант

function getRandomArrEl(array) {
  const randomIndex = getRandomInteger(0, array.length - 1);

  return array[randomIndex];
}

function generateType() {
  const types = ['Taxi', 'Bus', 'Train', 'Ship', 'Transport', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];

  return getRandomArrEl(types);
}

function generateDestination() {
  const destinations = ['Moscow', 'Roma', 'Paris', 'Istanbul', 'Athens', 'Madrid', 'Berlin', 'Budapest', 'Vienna'];

  return getRandomArrEl(destinations);
}

function generatePrice() {
  const MAX_PRICE = 1000;
  const randomPrice = getRandomInteger(0, MAX_PRICE);

  return randomPrice;
}

function generatePhotos() {
  const MAX_QUANTITY = 5;
  const MAX_SRC_NUMBER = 100;
  const SRC = 'http://picsum.photos/248/152?r';
  const randomQuantity = getRandomInteger(1, MAX_QUANTITY);
  const photos = new Array(randomQuantity).fill().map(() => SRC + getRandomInteger(0, MAX_SRC_NUMBER));

  return photos;
}

function generateOptions() {
  const options = [
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

  const randomQuantity = getRandomInteger(0, options.length - 1);
  const randomOptions = new Array(randomQuantity).fill().map(() => {
    return getRandomArrEl(options);
  });

  return randomOptions;
}

function generateDescription() {
  const SENTENCE_MIN = 1;
  const SENTENCE_MAX = 5;

  const mockText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus';
  const mockTexts = mockText.split('.');
  const sentenceCount = getRandomInteger(SENTENCE_MIN, SENTENCE_MAX);
  let description = '';

  for (let i = 1; i <= sentenceCount; i++) {
    description += getRandomArrEl(mockTexts) + '.';
  }

  return description;

}

function generateDate() {
  const MaxGap = {
    seconds: 60,
    minutes: 60,
    hours: 24,
    days: 30,
  };

  const dateFrom = dayjs()
    .add(getRandomInteger(0, MaxGap.days), 'day')
    .add(getRandomInteger(0, MaxGap.hours), 'hour')
    .add(getRandomInteger(0, MaxGap.minutes), 'minute')
    .add(getRandomInteger(0, MaxGap.seconsds), 'second')
    .format('YYYY-MM-DD HH:mm:ss');

  const dateTo = dayjs(dateFrom)
    .add(getRandomInteger(0, MaxGap.days), 'day')
    .add(getRandomInteger(0, MaxGap.hours), 'hour')
    .add(getRandomInteger(0, MaxGap.minutes), 'minute')
    .add(getRandomInteger(0, MaxGap.seconsds), 'second')
    .format('YYYY-MM-DD HH:mm:ss');

  const date = {
    from: dateFrom,
    to: dateTo,
  };
  // console.log(date);

  return date;
}

export function generatePoint() {
  return {
    type: generateType(),
    date: generateDate(),
    destination: generateDestination(),
    price: generatePrice(),
    options: generateOptions(),
    photos: generatePhotos(),
    description: generateDescription(),
    isFavorite: Boolean(getRandomInteger(0, 1)),
  };
}

