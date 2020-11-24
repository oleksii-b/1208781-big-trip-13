import {createInfoTemplate} from './view/info.js';
import {createPriceTemplate} from './view/price.js';
import {createMenuTemplate} from './view/menu.js';
import {createFiltersTemplate} from './view/filters.js';
import {createSortTemplate} from './view/sort.js';
import {createNewPointTemplate} from './view/new-point.js';
import {createEditPointTemplate} from './view/edit-point';
import {createPointTemplate} from './view/point.js';
import {createTripListTemplate} from './view/trip-list.js';
import {generateEvent} from './mock/trip-event.js';

const COUNT_POINT = 20;
const events = new Array(COUNT_POINT).fill().map(generateEvent);
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
render(tripMainElement, createInfoTemplate(), `afterbegin`);
const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
render(tripInfoElement, createPriceTemplate(), `beforeend`);
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
