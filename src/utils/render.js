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

function replace(newChild, oldChild) {
  if (oldChild instanceof Abstract) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof Abstract) {
    newChild = newChild.getElement();
  }

  const parent = oldChild.parentElement;

  if (parent === null || oldChild === null || newChild === null) {
    throw new Error('Can\'t replace unexisting elements');
  }

  parent.replaceChild(newChild, oldChild);
}

function remove(component) {
  if (component === null) {
    return;
  }

  if (!(component instanceof Abstract)) {
    throw new Error('Can remove only components');
  }

  component.getElement().remove();
  component.removeElement();
}

export {RenderPosition, renderTemplate, render, createElement, replace, remove};
