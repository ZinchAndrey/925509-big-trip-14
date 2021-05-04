import FiltersView from '../view/filters.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
// import {filter} from '../utils/filter.js';
import {UpdateType} from '../const.js';


export default class Filter {
  constructor(filterContainer, filterModel, pointsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._pointsModel = pointsModel; // вероятно, здесь не нужна, так как не нужно считать количество задач в фильтре, как в демке

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
  }

  init() {
    // const filter = this._getFilter;
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FiltersView(this._getFilter());
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this._init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._getFilter() === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilter() {
    return this._filterModel.getFilter();
  }
}
