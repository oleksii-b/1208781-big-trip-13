import {getEvent} from './mock/trip-event';
import {RenderPosition, render} from './mock/utils';
import EditPointView from './view/edit-point';
import InfoView from './view/info';
import FiltersView from './view/filters';
import MenuView from './view/menu';
import NewPointView from './view/new-point';
import PointView from './view/point';
import PriceView from './view/price';
import SortView from './view/sort';
import TripListView from './view/trip-list';

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

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripContentElement = document.querySelector(`.trip-events`);
render(tripMainElement, new InfoView(events).getElement(), RenderPosition.AFTERBEGIN);
const tripInfoElement = tripMainElement.querySelector(`.trip-info`);

render(tripControlsElement, new FiltersView().getElement(), RenderPosition.BEFOREEND);
render(tripControlsElement, new MenuView().getElement(), RenderPosition.AFTERBEGIN);
render(tripContentElement, new SortView().getElement(), RenderPosition.AFTERBEGIN);
render(tripContentElement, new TripListView().getElement(), RenderPosition.BEFOREEND);
const tripList = tripContentElement.querySelector(`.trip-events__list`);
render(tripInfoElement, new PriceView(events).getElement(), RenderPosition.BEFOREEND);

for (let i = 1; i < COUNT_POINT; i++) {
  render(tripList, new PointView(events[i]).getElement(), RenderPosition.BEFOREEND);
}
