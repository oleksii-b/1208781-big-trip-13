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

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterTypeChange = this._onFilterTypeChange.bind(this);

    this._filterModel.addObserver(this._onDataChange);
    this._pointsModel.addObserver(this._onDataChange);
  }

  init() {
    this._currentFilter = this._filterModel.filter;
    const filters = this.filters;
    const prevFilterComponent = this._filterComponent;
    this._noFilteredPoints = this.noFilteredPoints;

    this._filterComponent = new FilterView(filters, this._currentFilter, this._noFilteredPoints);
    this._filterComponent.setFilterTypeChangeHandler(this._onFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
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

  get noFilteredPoints() {
    const noFilteredPoints = {};

    Object.values(FilterType).forEach((type) => {
      noFilteredPoints[type] = this._pointsModel.getFilteredPoints(type).length > 0;
    });

    return noFilteredPoints;
  }

  _onDataChange() {
    this.init();
  }

  _onFilterTypeChange(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }
}
