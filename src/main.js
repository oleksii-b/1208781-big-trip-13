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

const COUNT_POINT = 20;
const events = new Array(COUNT_POINT).fill().map(getEvent);
console.log(events);

const pointsModel = new PointsModel();
pointsModel.setPoints(events);

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

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  evt.target.disabled = true;
  tripPresenter.createPoint();
});
