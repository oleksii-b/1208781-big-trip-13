import AbstractView from './abstract';

const createSortTemplate = () => {
  return (
    `<section>
      <h2 class="visually-hidden">Trip events</h2>
      <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
        <div class="trip-sort__item  trip-sort__item--day">
          <input id="sort-day" class="trip-sort__input  visually-hidden"  type="radio" name="trip-sort" value="sort-day" checked>
          <label class="trip-sort__btn" for="sort-day">Day</label>
        </div>

        <div class="trip-sort__item  trip-sort__item--event">
          <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" disabled>
          <label class="trip-sort__btn" for="sort-event">Event</label>
        </div>

        <div class="trip-sort__item  trip-sort__item--time">
          <input id="sort-time" class="trip-sort__input  visually-hidden"  type="radio" name="trip-sort" value="sort-time">
          <label class="trip-sort__btn" for="sort-time">Time</label>
        </div>

        <div class="trip-sort__item  trip-sort__item--price">
          <input id="sort-price" class="trip-sort__input  visually-hidden"  type="radio" name="trip-sort" value="sort-price">
          <label class="trip-sort__btn" for="sort-price">Price</label>
        </div>

        <div class="trip-sort__item  trip-sort__item--offer">
          <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-offer" disabled>
          <label class="trip-sort__btn" for="sort-offer">Offers</label>
        </div>
      </form>
    </section>`
  );
};

export default class Sort extends AbstractView {
  constructor() {
    super();

    this._onSortTypeClick = this._onSortTypeClick.bind(this);
  }
  getTemplate() {
    return createSortTemplate();
  }

  _onSortTypeClick(evt) {
    const {target: {value}} = evt;
    if ([`sort-price`, `sort-day`, `sort-time`].includes(value)) {
      this._callback.sortTypeClick(value);
    }
  }

  setSortTypeClickHandler(callback) {
    this._callback.sortTypeClick = callback;
    this.getElement().addEventListener(`change`, this._onSortTypeClick);
  }
}
