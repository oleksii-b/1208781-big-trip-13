import {getEvent} from '../src/mock/trip-event';
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
import { UpdateType } from './const';

const COUNT_POINT = 20;
const AUTHORIZATION = `Basic 237rduhkdjasdjaasd`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;

const events = new Array(COUNT_POINT).fill().map(getEvent);
console.log(events)
const api = new Api(END_POINT, AUTHORIZATION);
api.getPoints().then((points) => {
  console.log(points);
})
api.getDestinations().then((destinations) => {
  console.log(destinations)
})
api.getOffers().then((offers) => {
  console.log(offers)
})

const pointsModel = new PointsModel();
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
  });
// pointsModel.setPoints(events);

const filterModel = new FilterModel();

const tripControlsElement = document.querySelector(`.trip-controls`);
const tripContentElement = document.querySelector(`.trip-events`);
const tripMainElement = document.querySelector(`.trip-main`);

const menuComponent = new MenuView();

render(tripControlsElement, menuComponent, RenderPosition.AFTERBEGIN);

const tripPresenter = new TripPresenter(tripContentElement, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(tripControlsElement, filterModel);
const infoPresenter = new InfoPresenter(tripMainElement, pointsModel, filterModel);
let statComponent = null;

const onMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      tripPresenter.init();
      remove(statComponent);
      break;
    case MenuItem.STATS:
      tripPresenter.destroy();
      statComponent = new StatView(pointsModel.getPoints());
      render(tripContentElement, statComponent, RenderPosition.BEFOREEND);
      break;
  }
};

menuComponent.setMenuClickHandler(onMenuClick);
tripPresenter.init();

filterPresenter.init();
infoPresenter.init();

const onNewEventClick = (evt) => {
  evt.preventDefault();
  if (statComponent) {
    remove(statComponent);
  }

  tripPresenter.destroy();
  tripPresenter.init();
  menuComponent.setMenuItem(MenuItem.TABLE);
  evt.target.disabled = true;
  tripPresenter.createPoint();
};

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, onNewEventClick);
