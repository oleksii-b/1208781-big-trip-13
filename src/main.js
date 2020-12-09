import {getEvent} from '../src/mock/trip-event';
import {RenderPosition, render} from './utils/render';
import FiltersView from './view/filters';
import MenuView from './view/menu';
import TripPresenter from '../src/presenter/trip';

const COUNT_POINT = 20;
const events = new Array(COUNT_POINT).fill().map(getEvent);

events.sort((a, b) => {
  if (a.date.start.isAfter(b.date.start)) {
    return 1;
  }
  if (!(a.date.start.isAfter(b.date.start))) {
    return -1;
  }
  return 0;
});

const tripControlsElement = document.querySelector(`.trip-controls`);
const tripContentElement = document.querySelector(`.trip-events`);

render(tripControlsElement, new FiltersView(), RenderPosition.BEFOREEND);
render(tripControlsElement, new MenuView(), RenderPosition.AFTERBEGIN);

const tripPresenter = new TripPresenter(tripContentElement);
tripPresenter.init(events);
