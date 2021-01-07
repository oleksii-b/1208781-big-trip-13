import AbstractView from './abstract';
import {MenuItem} from '../const';

const createMenuTemplate = () => {
  return (
    `<section>
      <h2 class="visually-hidden">Switch trip view</h2>
      <nav class="trip-controls__trip-tabs  trip-tabs">
        <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-value="${MenuItem.TABLE}">Table</a>
        <a class="trip-tabs__btn" href="#" data-value="${MenuItem.STATS}">Stats</a>
      </nav>
    </section>`
  );
};

export default class Menu extends AbstractView {
  constructor() {
    super();

    this._onMenuClick = this._onMenuClick.bind(this);
  }

  getTemplate() {
    return createMenuTemplate();
  }

  _onMenuClick(evt) {
    if (evt.target.classList.contains(`trip-tabs__btn`) && !evt.target.classList.contains(`trip-tabs__btn--active`)) {
      evt.preventDefault();
      this._callback.menuClick(evt.target.textContent);
      this.setMenuItem(evt.target.textContent);
    }

  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._onMenuClick);
  }

  setMenuItem(menuItem) {
    const item = this.getElement().querySelector(`[data-value=${menuItem}]`);
    const prevItem = this.getElement().querySelector(`.trip-tabs__btn--active`);

    if (item !== null && prevItem !== null) {
      prevItem.classList.remove(`trip-tabs__btn--active`);
      item.classList.add(`trip-tabs__btn--active`);
    }
  }

}
