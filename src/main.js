import {createPriceTemplate} from './view/price';
import {createMenuTemplate} from './view/menu';
import {createSortTemplate} from './view/sort';
import {createNewPointTemplate} from './view/new-point';
import {createPointTemplate} from './view/point';
import {createTripListTemplate} from './view/trip-list';
import {getEvent} from './mock/trip-event';
import {RenderPosition, render1} from './mock/utils';
import EditPointView from './view/edit-point';
import InfoView from './view/info';
import FiltersView from './view/filters';
import MenuView from './view/menu';

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
render(tripContentElement, createNewPointTemplate(events[0]), `afterbegin`);
render(tripContentElement, createSortTemplate(), `afterbegin`);
render(tripContentElement, createTripListTemplate(), `beforeend`);
const tripList = tripContentElement.querySelector(`.trip-events__list`);
render1(tripList, new EditPointView(events[1]).getElement(), RenderPosition.BEFOREEND);
render(tripInfoElement, createPriceTemplate(events), `beforeend`);

for (let i = 1; i < COUNT_POINT; i++) {
  render(tripList, createPointTemplate(events[i]), `beforeend`);
}
