import {createInfoTemplate} from './view/info';
import {createPriceTemplate} from './view/price';
import {createMenuTemplate} from './view/menu';
import {createFiltersTemplate} from './view/filters';
import {createSortTemplate} from './view/sort';
import {createNewPointTemplate} from './view/new-point';
import {createEditPointTemplate} from './view/edit-point';
import {createPointTemplate} from './view/point';
import {createTripListTemplate} from './view/trip-list';
import {getEvent} from './mock/trip-event';

const COUNT_POINT = 20;
const events = new Array(COUNT_POINT).fill().map(getEvent);
console.log(events);
events.sort((a, b) => {
  if (a.date.start.isAfter(b.date.start)) {
    return 1;
  }
  if (!(a.date.start.isAfter(b.date.start))) {
    return -1;
  }
  return 0;
});

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripContentElement = document.querySelector(`.trip-events`);
render(tripMainElement, createInfoTemplate(events), `afterbegin`);
const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
render(tripInfoElement, createPriceTemplate(events), `beforeend`);
render(tripControlsElement, createFiltersTemplate(), `beforeend`);
render(tripControlsElement, createMenuTemplate(), `afterbegin`);
render(tripContentElement, createNewPointTemplate(events[0]), `afterbegin`);
render(tripContentElement, createSortTemplate(), `afterbegin`);
render(tripContentElement, createTripListTemplate(), `beforeend`);
const tripList = tripContentElement.querySelector(`.trip-events__list`);
render(tripList, createEditPointTemplate(events[0]), `beforeend`);

for (let i = 1; i < COUNT_POINT; i++) {
  render(tripList, createPointTemplate(events[i]), `beforeend`);
}
