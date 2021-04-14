import Abstract from '../view/abstract.js';

const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

function render(container, child, position) {
  if (container instanceof Abstract) {
    container = container.getElement();
  }

  if (child instanceof Abstract) {
    child = child.getElement();
  }

  switch (position) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(child);
      break;

    case RenderPosition.BEFOREEND:
      container.append(child);
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

export {RenderPosition, renderTemplate, render, createElement};
