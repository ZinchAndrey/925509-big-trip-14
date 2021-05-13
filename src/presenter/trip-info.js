import TripInfoBlockView from '../view/trip-info-block.js';
import TripInfoView from '../view/trip-info.js';
import TripCostView from '../view/cost';

import {RenderPosition, render, remove} from '../utils/render.js';


export default class TripInfo {
  constructor(tripMainNode) {
    this._tripMainNode = tripMainNode;

    this._tripInfoBlockComponent = null;
    this._tripInfoComponent = null;
    this._tripCostComponent = null;
  }

  init(points) {
    this._tripInfoBlockComponent = new TripInfoBlockView();

    this._renderTripInfoBlock();

    this._tripInfoNode = this._tripMainNode.querySelector('.trip-info');

    this._renderAllInfo(points);
  }

  destroy() {
    remove(this._tripInfoBlockComponent);
    remove(this._tripInfoComponent);
    remove(this._tripCostComponent);
  }

  _renderTripInfoBlock() {
    render(this._tripMainNode, this._tripInfoBlockComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTripInfo(points) {
    this._tripInfoComponent = new TripInfoView(points);
    render(this._tripInfoNode, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTripCost(points) {
    this._tripCostComponent = new TripCostView(points);
    render(this._tripInfoNode, this._tripCostComponent, RenderPosition.BEFOREEND);
  }

  _renderAllInfo(points) {
    this._renderTripInfo(points);
    this._renderTripCost(points);
  }
}
