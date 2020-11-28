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

const tripListComponent = new TripListView();
render(tripContentElement, tripListComponent.getElement(), RenderPosition.BEFOREEND);

render(tripInfoElement, new PriceView(events).getElement(), RenderPosition.BEFOREEND);
const renderPoint = (tripListElement, event) => {
  const pointEditComponent = new EditPointView(event);
  const pointComponent = new PointView(event);

  const replacePointToForm = () => {
    tripListElement.replaceChild(pointEditComponent.getElement(), pointComponent.getElement());
  };

  const replaceFormToPoint = () => {
    tripListElement.replaceChild(pointComponent.getElement(), pointEditComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Esc` || evt.key === `Escape`) {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  pointComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replacePointToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  pointEditComponent.getElement().querySelector(`form`).addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceFormToPoint();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  pointEditComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replaceFormToPoint();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });
  render(tripListElement, pointComponent.getElement(), RenderPosition.BEFOREEND);
};

for (let i = 1; i < COUNT_POINT; i++) {
  renderPoint(tripListComponent.getElement(), events[i]);
}
