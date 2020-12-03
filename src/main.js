import {getEvent} from '../src/mock/trip-event';
import {RenderPosition, render, replace} from './utils/render';
import EditPointView from './view/edit-point';
import InfoView from './view/info';
import FiltersView from './view/filters';
import MenuView from './view/menu';
import PointView from './view/point';
import PriceView from './view/price';
import SortView from './view/sort';
import TripListView from './view/trip-list';
import NoPointView from './view/no-point';

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
const tripListComponent = new TripListView();

render(tripControlsElement, new FiltersView(), RenderPosition.BEFOREEND);
render(tripControlsElement, new MenuView(), RenderPosition.AFTERBEGIN);

const renderPoint = (tripListElement, event) => {
  const pointEditComponent = new EditPointView(event);
  const pointComponent = new PointView(event);

  const replacePointToForm = () => {
    replace(pointEditComponent, pointComponent);
  };

  const replaceFormToPoint = () => {
    replace(pointComponent, pointEditComponent);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Esc` || evt.key === `Escape`) {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  pointComponent.setEditClickHandler(() => {
    if (!tripListComponent.getElement().querySelector(`form`)) {
      replacePointToForm();
      document.addEventListener(`keydown`, onEscKeyDown);
    }
  });

  pointEditComponent.setSubmitFormHandler(() => {
    replaceFormToPoint();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  pointEditComponent.setCloseFormHandler(() => {
    replaceFormToPoint();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(tripListElement, pointComponent, RenderPosition.BEFOREEND);
};

const renderContent = (contentContainer, data) => {
  if (data.length) {
    render(tripMainElement, new InfoView(events), RenderPosition.AFTERBEGIN);
    const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
    render(tripInfoElement, new PriceView(events), RenderPosition.BEFOREEND);
    render(contentContainer, new SortView(), RenderPosition.AFTERBEGIN);
    render(contentContainer, tripListComponent, RenderPosition.BEFOREEND);
    data.forEach((elem) => {
      renderPoint(tripListComponent.getElement(), elem);
    });
  } else {
    render(contentContainer, new NoPointView(), RenderPosition.AFTERBEGIN);
  }
};

renderContent(tripContentElement, events);
