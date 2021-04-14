const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

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

export {RenderPosition, renderTemplate, render, createElement};
