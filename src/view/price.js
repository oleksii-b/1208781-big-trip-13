import AbstractView from './abstract';

const createPriceTemplate = (events) => {
  let totalCoast = 0;
  if (events.length) {
    const totalPrice = events.reduce((acc, event) => acc + +event.price, 0);
    const totalPriceOffers = events
    .reduce((acc1, {offers, eventType}) => acc1 + offers
    .filter(({checked, id}) => checked && eventType === id.toLowerCase())
    .reduce((acc, {price}) => acc + +price, 0), 0);
    totalCoast = totalPrice + totalPriceOffers;
  }
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
