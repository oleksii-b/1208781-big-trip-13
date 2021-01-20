import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const addZeroToNumber = (number) => {
  return (number < 10 ? `0${number}` : number);
};

export const getEventDuration = (diffInMs) => {
  const timeDuration = dayjs.duration(diffInMs);
  const days = timeDuration.days();
  const hours = timeDuration.hours();
  const minutes = timeDuration.minutes();

  return `
    ${(days > 0 && addZeroToNumber(days) + `D`) || ``}
    ${((days > 0 || hours > 0) && addZeroToNumber(hours) + `H`) || ``}
    ${addZeroToNumber(minutes)}M`;
};

export const getDurationDays = (diffInMs) => {
  const timeDuration = dayjs.duration(diffInMs);
  const days = timeDuration.days();
  const hours = timeDuration.hours();

  return (
    `${addZeroToNumber(days) + `D`}
    ${((days > 0 || hours > 0) && addZeroToNumber(hours) + `H`) || ``}`
  );
};

export const getRandomInteger = (a = 0, b = 1) => {
  const min = Math.ceil(Math.min(a, b));
  const max = Math.floor(Math.max(a, b));

  return Math.floor(min + Math.random() * (max - min + 1));
};

export const getUpdatedPoints = (items, point) => {
  return items.map((item) => item.id === point.id ? point : item);
};

export const isOnline = () => {
  return window.navigator.onLine;
};
