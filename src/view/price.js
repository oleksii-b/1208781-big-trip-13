export const createPriceTemplate = (events) => {
  const priceSum = events.reduce((acc, event) => acc + event.price, 0);

  // const selectedOffers = events.forEach(elem => elem.find((offer) => offers.offers.id === eventType).offers;
  // // const offersSum = selectedOffers.reduce((acc, offer) => acc + )
  // console.log(selectedOffers);
  return `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${priceSum}</span>
  </p>`;
};
