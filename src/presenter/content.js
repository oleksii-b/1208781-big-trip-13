import InfoView from '../view/info';
import PriceView from '../view/price';
import SortView from '../view/sort';
import NoPointView from '../view/no-point';
import TripListView from '../view/trip-list';
import PointPresenter from '../presenter/point';
import {updateItem} from '../utils/utils';

import {render, RenderPosition} from '../utils/render';

export default class Trip {
  constructor(tripContentContainer) {
    this._tripContentContainer = tripContentContainer;
    this._pointPresenter = {};

    this._tripListComponent = new TripListView();
    this._sortComponent = new SortView();
    this._noPointComponent = new NoPointView();

    this._onPointChange = this._onPointChange.bind(this);
    this._onModeChange = this._onModeChange.bind(this);
  }

  init(points) {
    this._points = points.slice();
    if (points.length) {
      this._renderInfo(points);
      this._renderPrice(points);
      this._renderSort();
      this._renderTripList();
      points.forEach((point) => this._renderPoint(point));
    } else {
      this._renderNoPoint();
    }
  }

  _onModeChange() {
    Object.values(this._pointPresenter).forEach((presenter) => presenter.resetView());
  }

  _onPointChange(updatedPoint) {
    this._points = updateItem(this._points, updatedPoint);
    this._pointPresenter[updatedPoint.id].init(updatedPoint);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._tripListComponent, this._onPointChange, this._onModeChange);
    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _renderSort() {
    render(this._tripContentContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderPrice(points) {
    this._priceComponent = new PriceView(points);
    render(this._infoComponent, this._priceComponent, RenderPosition.BEFOREEND);
  }

  _renderInfo(points) {
    const tripMainElement = document.querySelector(`.trip-main`);
    this._infoComponent = new InfoView(points);
    render(tripMainElement, this._infoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderNoPoint() {
    render(this._tripContentContainer, this._noPointComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTripList() {
    render(this._tripContentContainer, this._tripListComponent, RenderPosition.BEFOREEND);

  }

  _clearTripList() {
    Object.values(this._pointPresenter).forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};
  }
}
