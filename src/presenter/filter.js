import FiltersView from '../view/filters.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {UpdateType, MenuItem} from '../const.js';


export default class Filter {
  constructor(filterContainer, filterModel, handleSiteMenuClick) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;

    // так как при клике на фильтр с экрана статистики, нужно переключиться на экран с точками маршрута
    this._handleSiteMenuClick = handleSiteMenuClick;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FiltersView(this._getFilter());
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    // нужно для переключения на точки маршрута, если был клик с экрана статистики. Если мы уже на экране точек, функция завершится после проверки
    this._handleSiteMenuClick(MenuItem.TABLE);

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _getFilter() {
    return this._filterModel.getFilter();
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._getFilter() === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }
}
