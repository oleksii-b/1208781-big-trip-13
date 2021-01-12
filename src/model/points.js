import Observer from '../utils/observer';
import Api from '../api';
import dayjs from 'dayjs';

export default class Points extends Observer {
  constructor() {
    super();
    this._points = [];
    this._api = new Api()
  }

  setPoints(points) {
    this._points = points.slice();
  }

  setDestinations(destinations) {
    this._destinations = destinations;
  }

  setOffers(offers) {
    this._offers = offers;
  }

  getPoints() {
    return this._points;
  }

  static adaptToClient(point) {
    let srcPhotos = [];
    let cities = [];
    let destinations = [];
    let photos = [];
    this._destinations.forEach((description) => {
      description.pictures.forEach((picture) => photos.push(picture.src))
    })

    point.description.pictures.forEach((picture) => srcPhotos.push(picture.src));
    this._destinations.forEach((destination) => cities.push(destination.name));
    this._destinations.forEach((destination) => destinations.push({city: destination.name, description: destination.description, photos}));
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
          destination: {
            city: point.name,
            description: point.description,
            photos: srcPhotos,
          },
          cities,
          destinations: this._destinations,
          

        }
    );
  }

  updatePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

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
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting point`);
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType);
  }
}
