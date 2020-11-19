import {createInfoTemplate} from "./view/info.js";
import {createPriceTemplate} from "./view/price.js";
import {createMenuTemplate} from "./view/menu.js";
import {reateFiltersTemplate} from "./view/filters.js";
import {createSortTemplate} from "./view/sort.js";
import {createNewPointTemplate} from "./view/new-point.js";
import {createEditPointTemplate} from "./view/edit-point";
import {createPointTemplate} from "./view/point.js";

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);

render(tripMainElement, createInfoTemplate(), `afterbegin`);
const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
render(tripInfoElement, createPriceTemplate(), `beforeend`);
render(tripControlsElement, createFiltersTemplate(), `beforeend`);

