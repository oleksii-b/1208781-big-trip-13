import FilterView from '../view/filters';
import {render, RenderPosition, remove, replace} from '../utils/render';
import {FilterType, UpdateType} from '../utils/const';

export default class Filter {
  constructor(filterContainer, filterModel, pointsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._pointsModel = pointsModel;

    this._currentFilter = null;
    this._noFilteredPoints = null;
    this._filterComponent = null;

    this._onModelEvent = this._onModelEvent.bind(this);
    this._onFilterTypeChange = this._onFilterTypeChange.bind(this);

    this._filterModel.addObserver(this._onModelEvent);
    this._pointsModel.addObserver(this._onModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();
    const filters = this.filters;
    const prevFilterComponent = this._filterComponent;
    this._noFilteredPoints = this._getNoFilteredPoints();

    this._filterComponent = new FilterView(filters, this._currentFilter, this._noFilteredPoints);
    this._filterComponent.setFilterTypeChangeHandler(this._onFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _getNoFilteredPoints() {
    const noFilteredPoints = {};

    Object.values(FilterType).forEach((type) => {
      noFilteredPoints[type] = this._pointsModel.getFilteredPoints(type).length > 0;
    });

    return noFilteredPoints;
  }

  _onModelEvent() {
    this.init();
  }

  _onFilterTypeChange(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  get filters() {
    return [
      {
        type: FilterType.EVERYTHING,
        name: `Everything`
      },
      {
        type: FilterType.FUTURE,
        name: `Future`
      },
      {
        type: FilterType.PAST,
        name: `Past`
      }
    ];
  }
}
