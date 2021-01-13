import dayjs from 'dayjs';

export const SortType = {
  DEFAULT: `sort-day`,
  PRICE_DOWN: `sort-price`,
  TIME_DOWN: `sort-time`,
};

export const UserAction = {
  UPDATE_POINT: `UPDATE_POINT`,
  ADD_POINT: `ADD_POINT`,
  DELETE_POINT: `DELETE_POINT`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  INIT: `INIT`,
};

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const MenuItem = {
  TABLE: `Table`,
  STATS: `Stats`,
};

export const BAR_HEIGHT = 55;

export const newPoint = {
  price: 0,
  eventType: `taxi`,
  offers: [],
  destination: {
    description: ``,
    pictures: [],
  },
  date: {
    start: dayjs(),
    finish: dayjs(),
  },
  isFavorite: false,
};
