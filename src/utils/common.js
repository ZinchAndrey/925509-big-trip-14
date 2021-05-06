const reg = new RegExp('^\\d+$');

function getRandomInteger(a = 0, b = 1) {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
}

function getRandomArrEl(array) {
  const randomIndex = getRandomInteger(0, array.length - 1);

  return array[randomIndex];
}

function isNumber(value) {
  return reg.test(value);
}

export {getRandomInteger, getRandomArrEl, isNumber};
