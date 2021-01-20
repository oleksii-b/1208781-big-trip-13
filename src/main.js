import {RenderPosition, render, remove} from './utils/render';
import MenuView from './view/menu';
import TripPresenter from '../src/presenter/trip';
import PointsModel from './model/points';
import FilterModel from './model/filter';
import FilterPresenter from './presenter/filter';
import {MenuItem} from './utils/const';
import InfoPresenter from './presenter/info';
import StatView from './view/stat';
import Api from './api/api';
import {UpdateType} from './utils/const';
import {isOnline} from './utils/common';
import {toast} from './utils/toast/toast';
import Store from './api/store';
import Provider from './api/provider';

const AUTHORIZATION = `Basic 237sdf34sdf`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;
const STORE_PREFIX = `bigtrip-localstorage`;
const STORE_VER = `v13`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);
const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const menuComponent = new MenuView();
let statComponent = null;
const tripControlsElement = document.querySelector(`.trip-controls`);
const tripContentElement = document.querySelector(`.trip-events`);
const tripMainElement = document.querySelector(`.trip-main`);
const pageBodyElement = document.querySelector(`main .page-body__container`);
const addNewPointButton = document.querySelector(`.trip-main__event-add-btn`);

const tripPresenter = new TripPresenter(tripContentElement, pointsModel, filterModel, apiWithProvider);
const filterPresenter = new FilterPresenter(tripControlsElement, filterModel, pointsModel);
const infoPresenter = new InfoPresenter(tripMainElement, pointsModel, filterModel);

const onMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      tripPresenter.destroy();
      tripPresenter.init();
      tripPresenter.showTripList();
      remove(statComponent);
      break;
    case MenuItem.STATS:
      addNewPointButton.disabled = false;
      tripPresenter.hideTripList();
      statComponent = new StatView(pointsModel.points);
      render(pageBodyElement, statComponent, RenderPosition.BEFOREEND);
      break;
  }
};

const onNewEventClick = (evt) => {
  evt.preventDefault();
  if (!isOnline()) {
    toast(`You can't create new point offline`);
    return;
  }
  if (statComponent) {
    remove(statComponent);
  }
  tripPresenter.showTripList();
  menuComponent.setMenuItem(MenuItem.TABLE);
  evt.target.disabled = true;
  tripPresenter.createPoint();
};

Promise
  .all([
    apiWithProvider.points,
    apiWithProvider.destinations,
    apiWithProvider.offers
  ])
  .then(([points, destinations, offers]) => {
    pointsModel.setDestinations(destinations);
    pointsModel.setOffers(offers);
    pointsModel.setPoints(UpdateType.INIT, points);
    render(tripControlsElement, menuComponent, RenderPosition.AFTERBEGIN);
    menuComponent.setMenuClickHandler(onMenuClick);
    filterPresenter.init();
    infoPresenter.init();
  })
  .catch(() => {
    pointsModel.setDestinations([]);
    pointsModel.setOffers([]);
    pointsModel.setPoints(UpdateType.INIT, []);
    render(tripControlsElement, menuComponent, RenderPosition.AFTERBEGIN);
    menuComponent.setMenuClickHandler(onMenuClick);
    filterPresenter.init();
    infoPresenter.init();
  });

tripPresenter.init();
addNewPointButton.addEventListener(`click`, onNewEventClick);

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`./sw.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
