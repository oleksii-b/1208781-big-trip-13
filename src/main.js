import {RenderPosition, render, remove} from './utils/render';
import MenuView from './view/menu';
import TripPresenter from '../src/presenter/trip';
import PointsModel from './model/points';
import FilterModel from './model/filter';
import FilterPresenter from './presenter/filter';
import {MenuItem} from './const';
import InfoPresenter from './presenter/info';
import StatView from './view/stat';
import Api from './api.js';
import {UpdateType} from './const';

const AUTHORIZATION = `Basic 237rduhkdjasdjaasd`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;

const api = new Api(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel();
const filterModel = new FilterModel();

const tripControlsElement = document.querySelector(`.trip-controls`);
const tripContentElement = document.querySelector(`.trip-events`);
const tripMainElement = document.querySelector(`.trip-main`);
const pageBodyElement = document.querySelector(`main .page-body__container`);

const menuComponent = new MenuView();

const tripPresenter = new TripPresenter(tripContentElement, pointsModel, filterModel, api);
const filterPresenter = new FilterPresenter(tripControlsElement, filterModel);
const infoPresenter = new InfoPresenter(tripMainElement, pointsModel, filterModel);
let statComponent = null;

const onMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      tripPresenter.destroy();
      tripPresenter.init();
      tripPresenter.showTripList();
      remove(statComponent);
      break;
    case MenuItem.STATS:
      tripPresenter.hideTripList();
      statComponent = new StatView(pointsModel.getPoints());
      render(pageBodyElement, statComponent, RenderPosition.BEFOREEND);
      break;
  }
};

tripPresenter.init();
filterPresenter.init();
infoPresenter.init();

const onNewEventClick = (evt) => {
  evt.preventDefault();
  if (statComponent) {
    remove(statComponent);
  }

  tripPresenter.showTripList();
  menuComponent.setMenuItem(MenuItem.TABLE);
  evt.target.disabled = true;
  tripPresenter.createPoint();
};

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, onNewEventClick);

Promise
  .all([
    api.getPoints(),
    api.getDestinations(),
    api.getOffers()
  ])
  .then(([points, destinations, offers]) => {
    pointsModel.setDestinations(destinations);
    pointsModel.setOffers(offers);
    pointsModel.setPoints(UpdateType.INIT, points);
    render(tripControlsElement, menuComponent, RenderPosition.AFTERBEGIN);
    menuComponent.setMenuClickHandler(onMenuClick);
  })
  .catch(() => {
    pointsModel.setDestinations([]);
    pointsModel.setOffers([]);
    pointsModel.setPoints(UpdateType.INIT, []);
    render(tripControlsElement, menuComponent, RenderPosition.AFTERBEGIN);
    menuComponent.setMenuClickHandler(onMenuClick);
  });
