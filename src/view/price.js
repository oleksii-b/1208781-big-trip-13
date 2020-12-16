import AbstractView from './abstract';

const createPriceTemplate = (events) => {
  const totalPrice = events.reduce((acc, event) => acc + event.price, 0);
  const totalPriceOffers = events.reduce((acc1, elem) => acc1 + elem.offers.reduce((acc, offer) => acc + +offer.price, 0), 0);
  const totalCoast = totalPrice + totalPriceOffers;
  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCoast}</span>
    </p>`
  );
};

export default class Price extends AbstractView {
  constructor(events) {
    super();
    this._events = events;
  }

  getTemplate() {
    return createPriceTemplate(this._events);
  }
}
