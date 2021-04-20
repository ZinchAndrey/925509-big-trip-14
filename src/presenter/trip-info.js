import TripInfoBlockView from '../view/trip-info-block.js';
import TripInfoView from '../view/trip-info.js';
import TripCostView from '../view/cost';

import {RenderPosition, render} from '../utils/render.js';


export default class TripInfo {
  constructor(tripMainNode) {
    this._tripMainNode = tripMainNode;

    this._tripInfoBlockComponent = new TripInfoBlockView();
  }

  init(points) {
    this._renderTripInfoBlock();

    this._tripInfoNode = this._tripMainNode.querySelector('.trip-info');

    this._renderAllInfo(points);
  }

  _renderTripInfoBlock() {
    render(this._tripMainNode, this._tripInfoBlockComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTripInfo(points) {
    const tripInfoComponent = new TripInfoView(points);
    render(this._tripInfoNode, tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTripCost(points) {
    const tripCostComponent = new TripCostView(points);
    render(this._tripInfoNode, tripCostComponent, RenderPosition.BEFOREEND);
  }

  // возможно, понадобится для reinit() при изменении данных
  _renderAllInfo(points) {
    this._renderTripInfo(points);
    this._renderTripCost(points);
  }


}
