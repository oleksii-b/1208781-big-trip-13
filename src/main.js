import {createPriceTemplate} from './view/price';
import {createSortTemplate} from './view/sort';
import {createTripListTemplate} from './view/trip-list';
import {getEvent} from './mock/trip-event';
import {RenderPosition, render1} from './mock/utils';
import EditPointView from './view/edit-point';
import InfoView from './view/info';
import FiltersView from './view/filters';
import MenuView from './view/menu';
import NewPointView from './view/new-point';
import PointView from './view/point';
import PriceView from './view/price';

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
console.log(events);
const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripContentElement = document.querySelector(`.trip-events`);
render1(tripMainElement, new InfoView(events).getElement(), RenderPosition.AFTERBEGIN);
const tripInfoElement = tripMainElement.querySelector(`.trip-info`);

render1(tripControlsElement, new FiltersView().getElement(), RenderPosition.BEFOREEND);
render1(tripControlsElement, new MenuView().getElement(), RenderPosition.AFTERBEGIN);
render1(tripContentElement, new NewPointView(events[0]).getElement(), RenderPosition.AFTERBEGIN);
render(tripContentElement, createSortTemplate(), `afterbegin`);
render(tripContentElement, createTripListTemplate(), `beforeend`);
const tripList = tripContentElement.querySelector(`.trip-events__list`);
render1(tripList, new EditPointView(events[1]).getElement(), RenderPosition.BEFOREEND);
render1(tripInfoElement, new PriceView(events).getElement(), RenderPosition.BEFOREEND);

for (let i = 1; i < COUNT_POINT; i++) {
  render1(tripList, new PointView(events[i]).getElement(), RenderPosition.BEFOREEND);
}
