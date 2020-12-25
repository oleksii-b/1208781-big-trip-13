import AbstractView from './abstract';


const createFiltersTemplate = (filters, currentFilter) => {

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filters.map((filter) => {
      const {type, name} = filter;
      return (
        `<div class="trip-filters__filter">
          <input 
            id="filter-${type}" 
            class="trip-filters__filter-input  visually-hidden" 
            type="radio" 
            name="trip-filter" 
            value="${type}" 
            ${currentFilter === type ? `checked` : ``}
          >
          <label class="trip-filters__filter-label" for="filter-${type}">${name}</label>
        </div>`
      );
    }).join(``)}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class Filters extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._currentFilterType = currentFilterType;
    this._filters = filters;

    this._onFilterTypeChange = this._onFilterTypeChange.bind(this);

  }
  getTemplate() {
    return createFiltersTemplate(this._filters, this._currentFilterType);
  }

  _onFilterTypeChange(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._onFilterTypeChange);
  }
}
