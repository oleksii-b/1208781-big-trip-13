import dayjs from 'dayjs';
import {getRandomInteger} from './utils';

const generateEventType = () => {
  const eventTypes = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`, `Check-in`, `Sightseeing`, `Restaurant`];
  const randomIndex = getRandomInteger(0, eventTypes.length - 1);
  return eventTypes[randomIndex];
};
const cities = [`Amsterdam`, `Chamonix`, `Geneva`, `London`, `Moscow`, `Brussels`, `Budapest`, `Madrid`, `Helsinki`, `Paris`, `Prague`];
const generateCity = () => {
  const randomIndex = getRandomInteger(0, cities.length - 1);
  return cities[randomIndex];
};

const generateOffers = () => {
  const offerTypes = [
    {id: `Flight`, offers: [{name: `Add luggage`, price: `50`},
      {name: `Switch to comfort`, price: `80`},
      {name: `Add meal`, price: `15`},
      {name: `Choose seats`, price: `5`},
      {name: `Travel by train`, price: `40`}]},
    {id: `Taxi`, offers: [{name: `Order Uber`, price: `20`}]},
    {id: `Bus`, offers: []},
    {id: `Train`, offers: []},
    {id: `Ship`, offers: []},
    {id: `Transport`, offers: []},
    {id: `Drive`, offers: [{name: `Rent a car`, price: `200`}]},
    {id: `Check-in`, offers: [{name: `Add breakfast`, price: `50`}]},
    {id: `Sightseeing`, offers: [{name: `Book tickets`, price: `40`}, {name: `Lunch in city`, price: `30`}]},
    {id: `Restaurant`, offers: []},
  ];
  return offerTypes;
};
const getSelectedOffers = (offers, type) => {
  return offers.find((offer) => offer.id === type).offers;
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


let startEvent = dayjs();
const generateDate = () => {
  const MAX_MINUTES = 59;
  const MAX_HOURS = 23;
  const start = startEvent;
  const finish = startEvent.add(getRandomInteger(0, MAX_HOURS), `h`)
    .add(getRandomInteger(0, MAX_MINUTES), `m`);
  startEvent = finish;
  return {
    start,
    finish,
  };
};


export const generateEvent = () => {
  const eventType = generateEventType();
  const offers = generateOffers(eventType);
  return {
    eventType,
    city: generateCity(),
    offers,
    selectedOffers: getSelectedOffers(offers, eventType),
    destination: {description: generateDescription(),
      photos: generatePhoto(),
      cities},
    price: getRandomInteger(20, 200),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    date: generateDate(),
  };
};

