import {getEvent} from '../src/mock/trip-event';
import {RenderPosition, render} from './utils/render';
import MenuView from './view/menu';
import TripPresenter from '../src/presenter/trip';
import PointsModel from './model/points';
import FilterModel from './model/filter';
import FilterPresenter from './presenter/filter';

const COUNT_POINT = 20;
const events = new Array(COUNT_POINT).fill().map(getEvent);

const pointsModel = new PointsModel();
pointsModel.setPoints(events);

const filterModel = new FilterModel();

const tripControlsElement = document.querySelector(`.trip-controls`);
const tripContentElement = document.querySelector(`.trip-events`);

render(tripControlsElement, new MenuView(), RenderPosition.AFTERBEGIN);

const tripPresenter = new TripPresenter(tripContentElement, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(tripControlsElement, filterModel);
tripPresenter.init();
filterPresenter.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  evt.target.disabled = true;
  tripPresenter.createPoint();
});
