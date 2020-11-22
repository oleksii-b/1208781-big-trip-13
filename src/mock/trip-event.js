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

export const generateEvent = () => {
  return {
    eventType: generateEventType(),
    city: generateCity(),
  };
};
