import PointsModel from '../model/points';
import {isOnline} from '../utils/common.js';

const getSyncedPoints = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.point);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {

    return Object.assign(
        {},
        acc,
        {
          [current.id]: current,
        }
    );
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  get points() {
    if (isOnline()) {
      return this._api.points
        .then((points) => {
          const items = createStoreStructure(points.map(PointsModel.adaptToServer));
          this._store.setItems(items);
          return points;
        });
    }
    const storePoints = Object.values(this._store.items);
    return Promise.resolve(storePoints.map(PointsModel.adaptToClient));
  }

  get offers() {
    if (isOnline()) {
      return this._api.offers
        .then((offers) => {
          this._store.setExtraData(`offers`, offers);
          return offers;
        });
    }
    return Promise.resolve(this._store.getExtraData(`offers`));
  }

  get destinations() {
    if (isOnline()) {
      return this._api.destinations
        .then((destinations) => {
          this._store.setExtraData(`destinations`, destinations);
          return destinations;
        });
    }
    return Promise.resolve(this._store.getExtraData(`destinations`));
  }

  updatePoint(point) {
    if (isOnline()) {
      return this._api.updatePoint(point)
        .then((updatedPoint) => {
          this._store.setItem(updatedPoint.id, PointsModel.adaptToServer(updatedPoint));
          return updatedPoint;
        });
    }

    this._store.setItem(point.id, PointsModel.adaptToServer(Object.assign({}, point)));

    return Promise.resolve(point);
  }

  addPoint(point) {
    if (isOnline()) {
      return this._api.addPoint(point)
        .then((newPoint) => {
          this._store.setItem(newPoint.id, PointsModel.adaptToServer(newPoint));
          return newPoint;
        });
    }

    return Promise.reject(new Error(`Add point failed`));
  }

  deletePoint(point) {
    if (isOnline()) {
      return this._api.deletePoint(point)
        .then(() => this._store.removeItem(point.id));
    }

    return Promise.reject(new Error(`Delete point failed`));
  }

  sync() {
    if (isOnline()) {
      const storePoints = Object.values(this._store.items);

      return this._api.sync(storePoints)
        .then((response) => {
          // Забираем из ответа синхронизированные задачи
          const createdPoints = getSyncedPoints(response.created);
          const updatedPoints = getSyncedPoints(response.updated);

          // Добавляем синхронизированные задачи в хранилище.
          // Хранилище должно быть актуальным в любой момент.
          const items = createStoreStructure([...createdPoints, ...updatedPoints]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}
