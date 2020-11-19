import {createInfoTemplate} from "./view/info.js";
import {createPriceTemplate} from "./view/price.js";
import {createMenuTemplate} from "./view/menu.js";
import {createFiltersTemplate} from "./view/filters.js";
import {createSortTemplate} from "./view/sort.js";
import {createNewPointTemplate} from "./view/new-point.js";
import {createEditPointTemplate} from "./view/edit-point";
import {createPointTemplate} from "./view/point.js";
import {createTripListTemplate} from "./view/trip-list.js";

const COUNT_POINT = 3;

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
render(tripContentElement, createNewPointTemplate(), `afterbegin`);
render(tripContentElement, createSortTemplate(), `afterbegin`);
render(tripContentElement, createTripListTemplate(), `beforeend`);
const tripList = tripContentElement.querySelector(`.trip-events__list`);
render(tripList, createEditPointTemplate(), `beforeend`);

for (let i = 0; i < COUNT_POINT; i++) {
  render(tripList, createPointTemplate(), `beforeend`);
}


