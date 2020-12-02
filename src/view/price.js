import {createElement} from '../mock/utils';

const createPriceTemplate = (events) => {
  const totalPrice = events.reduce((acc, event) => acc + event.price, 0);

  const totalPriceOffers = events.reduce((acc1, elem) => acc1 + elem.selectedOffers.reduce((acc, offer) => acc + +offer.price, 0), 0);
  const totalCoast = totalPrice + totalPriceOffers;
  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCoast}</span>
    </p>`
  );
};

export default class Price {
  constructor(events) {
    this._events = events;
    this._element = null;
  }

  getTemplate() {
    return createPriceTemplate(this._events);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
