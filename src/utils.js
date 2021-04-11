const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
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

function render(container, template, position) {
  switch (position) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(template);
      break;

    case RenderPosition.BEFOREEND:
      container.append(template);
      break;
  }
}

function renderTemplate(container, template, place) {
  container.insertAdjacentHTML(place, template);
}

function createElement(template) {
  // template должен иметь цельную обертку
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
}

export {RenderPosition, getRandomInteger, getRandomArrEl, renderTemplate, render, createElement};
