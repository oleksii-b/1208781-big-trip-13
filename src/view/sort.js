import AbstractView from './abstract';
import {SortType} from '../const';

const createSortTemplate = () => {
  return (
    `<section>
      <h2 class="visually-hidden">Trip events</h2>
      <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
        <div class="trip-sort__item  trip-sort__item--day">
          <input id="sort-day" class="trip-sort__input  visually-hidden" data-sort-type="${SortType.DEFAULT}" type="radio" name="trip-sort" value="sort-day" checked>
          <label class="trip-sort__btn" for="sort-day">Day</label>
        </div>

        <div class="trip-sort__item  trip-sort__item--event">
          <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" disabled>
          <label class="trip-sort__btn" for="sort-event">Event</label>
        </div>

        <div class="trip-sort__item  trip-sort__item--time">
          <input id="sort-time" class="trip-sort__input  visually-hidden" data-sort-type="${SortType.TIME_DOWN}" type="radio" name="trip-sort" value="sort-time">
          <label class="trip-sort__btn" for="sort-time">Time</label>
        </div>

        <div class="trip-sort__item  trip-sort__item--price">
          <input id="sort-price" class="trip-sort__input  visually-hidden" data-sort-type="${SortType.PRICE_DOWN}" type="radio" name="trip-sort" value="sort-price">
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
    if ([`sort-price`, `sort-day`, `sort-time`].includes(evt.target.value)) {
      this._callback.sortTypeClick(evt.target.dataset.sortType);
    }
  }

  setSortTypeClickHandler(callback) {
    this._callback.sortTypeClick = callback;
    this.getElement().addEventListener(`click`, this._onSortTypeClick);
  }
}
