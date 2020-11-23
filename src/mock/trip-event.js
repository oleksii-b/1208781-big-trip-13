import dayjs from 'dayjs';
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

const generateDescription = () => {
  const descriptions = [`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    `Cras aliquet varius magna, non porta ligula feugiat eget.`,
    `Fusce tristique felis at fermentum pharetra.`,
    `Aliquam id orci ut lectus varius viverra.`,
    `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
    `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
    `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
    `Sed sed nisi sed augue convallis suscipit in sed felis.`,
    `Aliquam erat volutpat.`,
    `Nunc fermentum tortor ac porta dapibus.`,
    `In rutrum ac purus sit amet tempus.`
  ];
  let description = ``;
  const randomIndex = getRandomInteger(1, 5);
  for (let i = 1; i <= randomIndex; i++) {
    description += descriptions[getRandomInteger(0, descriptions.length - 1)];
  }
  return description;
};

const generatePhoto = () => {
  let photos = [];
  for (let i = 1; i <= getRandomInteger(1, 6); i++) {
    photos.push(`http://picsum.photos/248/152?r=${Math.random()}`);
  }
  return photos;
};

const generateDate = () => {
  const MAX_MINUTES = 59;
  const MAX_HOURS = 23;
  const MAX_DAYS = 1;
  const dateStart = dayjs().add(getRandomInteger(-MAX_DAYS, 0), `day`)
  .add(getRandomInteger(-MAX_HOURS, 0), `h`)
  .add(getRandomInteger(-MAX_MINUTES, 0), `m`).format(`DD:HH:mm`);
  const dateFinish = dayjs().add(getRandomInteger(0, MAX_DAYS), `day`)
  .add(getRandomInteger(0, MAX_HOURS), `h`)
  .add(getRandomInteger(0, MAX_MINUTES), `m`).format(`DD:HH:mm`);
  // const shift = dateStart.diff(dateFinish).format(`DD:HH:mm`);
  console.log(dateStart);
  console.log(dateFinish);
  console.log(shift);
};
generateDate();

export const generateEvent = () => {
  const eventType = generateEventType();
  const offers = generateOffers(eventType);
  return {
    eventType,
    city: generateCity(),
    offers,
    destination: {description: generateDescription(),
      photos: generatePhoto()},
    price: getRandomInteger(20, 200),
    isFavorite: Boolean(getRandomInteger(0, 1))
  };
};

