import InfoView from '../view/info';
import PriceView from '../view/price';
import SortView from '../view/sort';
import NoPointView from '../view/no-point';
import TripListView from '../view/trip-list';
import PointPresenter from '../presenter/point';
import PointNewPresenter from '../presenter/point-new';
import {render, RenderPosition, remove} from '../utils/render';
import {SortType, UserAction, UpdateType, FilterType} from '../const';
import {sortPriceDown, sortTimeDown, sortDefault} from '../utils/sort';
import {filter} from '../utils/filter';

export default class Trip {
  constructor(tripContentContainer, pointsModel, filterModel) {
    this._tripContentContainer = tripContentContainer;
    this._pointPresenter = {};
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._currentSortType = SortType.DEFAULT;

    this._tripListComponent = new TripListView();
    this._sortComponent = null;
    this._priceComponent = null;
    this._infoComponent = null;
    this._noPointComponent = new NoPointView();

    this._onModeChange = this._onModeChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewAction = this._onViewAction.bind(this);
    this._onModelEvent = this._onModelEvent.bind(this);

    this._pointsModel.addObserver(this._onModelEvent);
    this._filterModel.addObserver(this._onModelEvent);

    this._pointNewPresenter = new PointNewPresenter(this._tripListComponent, this._onViewAction);
  }

  init() {
    this._renderTrip();
  }

  createPoint() {
    this._currentSortType = SortType.DEFAULT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._pointNewPresenter.init();
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();

    const filteredPoints = filter[filterType](points);
    switch (this._currentSortType) {
      case SortType.PRICE_DOWN:
        return filteredPoints.sort(sortPriceDown);
      case SortType.TIME_DOWN:
        return filteredPoints.sort(sortTimeDown);
    }

    return filteredPoints.sort(sortDefault);
  }

  _onModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearTrip();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        this._clearTrip(true);
        this._renderTrip();
        break;
    }
  }

  _onViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  _onSortTypeChange(sortType) {
    this._currentSortType = sortType;
    this._clearTrip();
    this._renderTrip();
  }

  _onModeChange() {
    this._pointNewPresenter.destroy();
    Object.values(this._pointPresenter).forEach((presenter) => presenter.resetView());
  }

  _onPointChange(updatedPoint) {
    this._pointPresenter[updatedPoint.id].init(updatedPoint);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._tripListComponent, this._onViewAction, this._onModeChange);
    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    render(this._tripContentContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  _renderPrice(points) {
    if (this._priceComponent !== null) {
      this._priceComponent = null;
    }

    this._priceComponent = new PriceView(points);
    render(this._infoComponent, this._priceComponent, RenderPosition.BEFOREEND);
  }

  _renderInfo(points) {
    if (this._infoComponent !== null) {
      this._infoComponent = null;
    }

    const tripMainElement = document.querySelector(`.trip-main`);
    this._infoComponent = new InfoView(points);
    render(tripMainElement, this._infoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderNoPoint() {
    render(this._tripContentContainer, this._noPointComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTripList(points) {
    render(this._tripContentContainer, this._tripListComponent, RenderPosition.BEFOREEND);
    points.forEach((point) => this._renderPoint(point));
  }

  _clearTrip(resetSortType = false) {
    this._pointNewPresenter.destroy();
    Object.values(this._pointPresenter).forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};

    remove(this._noPointComponent);
    remove(this._sortComponent);
    remove(this._priceComponent);
    remove(this._infoComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderTrip() {
    const points = this._getPoints();
    this._renderInfo(points);
    this._renderPrice(points);

    if (points.length) {
      this._renderSort();
      this._renderTripList(points);
    } else {
      this._renderNoPoint();
    }
  }
}
