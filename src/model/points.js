import Observer from '../utils/observer';
import dayjs from 'dayjs';
import {filter} from '../utils/filter';

export default class Points extends Observer {
  constructor() {
    super();
    this._points = [];
  }

  get points() {
    return this._points;
  }

  get offers() {
    return this._offers;
  }

  get destinations() {
    return this._destinations;
  }

  setPoints(updateType, points) {
    this._points = points.slice();

    this._notify(updateType);
  }

  setDestinations(destinations) {
    this._destinations = destinations;
  }

  setOffers(offers) {
    this._offers = offers;
  }

  getFilteredPoints(filterType) {
    return filter[filterType](this._points);
  }

  updatePoint(updateType, update) {
    const index = this._points.findIndex(({id}) => id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting point`);
    }

    this._points = this._points.map((point, i) => i === index ? update : point);
    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this._points.unshift(update);
    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this._points.findIndex(({id}) => id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting point`);
    }

    this._points.splice(index, 1);
    this._notify(updateType);
  }

  static adaptToClient(point) {
    const adaptedPoint = Object.assign(
        {},
        point,
        {
          eventType: point.type,
          isFavorite: point.is_favorite,
          price: point.base_price,
          date: {
            start: dayjs(point.date_from),
            finish: dayjs(point.date_to),
          },
          destination: Object.assign(
              {},
              point.destination,
              {
                city: point.destination.name,
              }
          ),
        }
    );

    delete adaptedPoint.type;
    delete adaptedPoint.is_favorite;
    delete adaptedPoint.base_price;
    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.destination.name;

    return adaptedPoint;
  }

  static adaptToServer(point) {
    const adaptedPoint = Object.assign(
        {},
        point,
        {
          "type": point.eventType,
          "date_from": point.date.start.toDate().toISOString(),
          "date_to": point.date.finish.toDate().toISOString(),
          "destination": {
            "name": point.destination.city,
            "description": point.destination.description,
            "pictures": point.destination.pictures,
          },
          "base_price": +point.price,
          "is_favorite": point.isFavorite,
        }
    );

    delete adaptedPoint.eventType;
    delete adaptedPoint.isFavorite;
    delete adaptedPoint.price;
    delete adaptedPoint.date;
    delete adaptedPoint.destination.city;

    return adaptedPoint;
  }
}
