import InfoView from '../view/info';
import PriceView from '../view/price';
import SortView from '../view/sort';
import NoPointView from '../view/no-point';
import TripListView from '../view/trip-list';
import PointPresenter from '../presenter/point';

import {render, RenderPosition} from '../utils/render';

export default class Trip {
  constructor(tripContentContainer, events) {
    this._tripContentContainer = tripContentContainer;

    this._tripListComponent = new TripListView();
    this._sortComponent = new SortView();
    this._priceComponent = new PriceView(events);
    this._noPointComponent = new NoPointView();
    this._infoComponent = new InfoView(events);
  }

  init(events) {
    this._events = events.slice();
    if (events.length) {
      this._renderInfo(events);
      this._renderPrice(events);
      this._renderSort();
      this._renderTripList();
      events.forEach((event) => this._renderPoint(event));
    } else {
      this._renderNoPoint();
    }
  }

  _renderPoint(event) {
    const pointPresenter = new PointPresenter(this._tripListComponent);
    pointPresenter.init(event);
  }

  _renderSort() {
    render(this._tripContentContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderPrice() {
    render(this._infoComponent, this._priceComponent, RenderPosition.BEFOREEND);
  }

  _renderInfo() {
    const tripMainElement = document.querySelector(`.trip-main`);
    render(tripMainElement, this._infoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderNoPoint() {
    render(this._tripContentContainer, this._noPointComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTripList() {
    render(this._tripContentContainer, this._tripListComponent, RenderPosition.BEFOREEND);

  }
}
