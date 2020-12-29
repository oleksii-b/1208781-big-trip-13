import {FilterType} from '../const';
import dayjs from 'dayjs';

export const filter = {
  [FilterType.EVERYTHING]: (points) => points.filter((point) => point),
  [FilterType.FUTURE]: (points) => points.filter((point) => point.date.start >= dayjs()),
  [FilterType.PAST]: (points) => points.filter((point) => point.date.start < dayjs())
};
