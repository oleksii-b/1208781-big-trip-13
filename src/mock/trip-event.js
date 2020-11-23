const getRandomInteger = (a = 0, b = 1) => {
  const min = Math.ceil(Math.min(a, b));
  const max = Math.floor(Math.max(a, b));
  return Math.floor(min + Math.random() * (max - min + 1));
};

const generateEventType = () => {
  const eventTypes = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`, `Check-in`, `Sightseeing`, `Restaurant`];
  const randomIndex = getRandomInteger(0, eventTypes.length - 1);
  return eventTypes[randomIndex];
};

const generateCity = () => {
  const cities = [`Amsterdam`, `Chamonix`, `Geneva`];
  const randomIndex = getRandomInteger(0, cities.length - 1);
  return cities[randomIndex];
};

const generateOffers = (eventType) => {
  const offerTypes = [
    {id: `Taxi`, offers: [{name: `Order Uber`, price: `20`}]},
    {id: `Flight`, offers: [{name: `Add luggage`, price: `50`},
      {name: `Switch to comfort`, price: `80`},
      {name: `Add meal`, price: `15`},
      {name: `Choose seats`, price: `5`},
      {name: `Travel by train`, price: `40`}]},
    {id: `Bus`, offers: [{name: ``, price: ``}]},
    {id: `Train`, offers: [{name: ``, price: ``}]},
    {id: `Ship`, offers: [{name: ``, price: ``}]},
    {id: `Transport`, offers: [{name: ``, price: ``}]},
    {id: `Drive`, offers: [{name: `Rent a car`, price: `200`}]},
    {id: `Check-in`, offers: [{name: `Add breakfast`, price: `50`}]},
    {id: `Sightseeing`, offers: [{name: `Book tickets`, price: `40`}, {name: `Lunch in city`, price: `30`}]},
    {id: `Restaurant`, offers: [{name: ``, price: ``}]},
  ];
  const offers = offerTypes.find((offer) => offer.id === eventType).offers;
  const randomLength = getRandomInteger(0, offers.length);
  offers.length = randomLength;
  return offers;
};

const generateEvent = () => {
  const eventType = generateEventType();
  const offers = generateOffers(eventType);
  return {
    eventType,
    city: generateCity(),
    offers,
  };
};

