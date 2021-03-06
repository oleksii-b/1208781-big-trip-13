import SortView from '../view/sort';
import NoPointView from '../view/no-point';
import TripListView from '../view/trip-list';
import Loading from '../view/loading';
import PointPresenter, {State} from '../presenter/point';
import PointNewPresenter from '../presenter/point-new';
import {render, RenderPosition, remove} from '../utils/render';
import {SortType, UserAction, UpdateType, FilterType} from '../utils/const';
import {sortPriceDown, sortTimeDown, sortDefault} from '../utils/sort';
import {filter} from '../utils/filter';

export default class Trip {
  constructor(tripContentContainer, pointsModel, filterModel, api) {
    this._tripContentContainer = tripContentContainer;
    this._pointPresenter = {};
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._currentSortType = SortType.DEFAULT;
    this._tripListComponent = new TripListView();
    this._sortComponent = null;
    this._infoComponent = null;
    this._noPointComponent = new NoPointView();
    this._loadingComponent = new Loading();
    this._api = api;
    this._isLoading = true;

    this._onModeChange = this._onModeChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewAction = this._onViewAction.bind(this);
    this._onDataChange = this._onDataChange.bind(this);

    this._pointNewPresenter = new PointNewPresenter(this._tripListComponent, this._onViewAction);
  }

  get points() {
    const filterType = this._filterModel.filter;
    const points = this._pointsModel.points;
    const filteredPoints = filter[filterType](points);

    switch (this._currentSortType) {
      case SortType.PRICE_DOWN:
        return filteredPoints.sort(sortPriceDown);
      case SortType.TIME_DOWN:
        return filteredPoints.sort(sortTimeDown);
    }

    return filteredPoints.sort(sortDefault);
  }

  get offers() {
    return this._pointsModel.offers;
  }

  get destinations() {
    return this._pointsModel.destinations;
  }

  init() {
    this._renderTrip();

    this._pointsModel.addObserver(this._onDataChange);
    this._filterModel.addObserver(this._onDataChange);
  }

  destroy() {
    this._clearTrip(true);

    this._pointsModel.removeObserver(this._onDataChange);
    this._filterModel.removeObserver(this._onDataChange);

  }

  showTripList() {
    this._tripListComponent.show();
  }

  hideTripList() {
    this._tripListComponent.hide();
  }

  createPoint() {
    const offers = this.offers;
    const destinations = this.destinations;
    this._currentSortType = SortType.DEFAULT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._pointNewPresenter.init(offers, destinations);
  }

  _renderPoint(point, offers, destinations) {
    const pointPresenter = new PointPresenter(this._tripListComponent, this._onViewAction, this._onModeChange);
    pointPresenter.init(point, offers, destinations);
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

  _renderNoPoint() {
    render(this._tripContentContainer, this._noPointComponent, RenderPosition.AFTERBEGIN);
  }

  _renderLoading() {
    render(this._tripContentContainer, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderList(points, offers, destinations) {
    render(this._tripContentContainer, this._tripListComponent, RenderPosition.BEFOREEND);
    points.forEach((point) => this._renderPoint(point, offers, destinations));
  }

  _clearTrip(resetSortType = false) {
    this._pointNewPresenter.destroy();
    Object.values(this._pointPresenter).forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};

    remove(this._noPointComponent);
    remove(this._sortComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderTrip() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const points = this.points;
    const offers = this.offers;
    const destinations = this.destinations;

    if (points.length) {
      remove(this._noPointComponent);
      this._renderSort();
      this._renderList(points, offers, destinations);
    } else {
      this._renderNoPoint();
    }
  }

  _onDataChange(updateType, data) {
    const {PATCH, MINOR, MAJOR, INIT} = UpdateType;

    switch (updateType) {
      case PATCH:
        this._pointPresenter[data.id].init(data);
        break;
      case MINOR:
        this._clearTrip();
        this._renderTrip();
        break;
      case MAJOR:
        this._clearTrip(true);
        this._renderTrip();
        break;
      case INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderTrip();
        break;
    }
  }

  _onViewAction(actionType, updateType, update) {
    const {UPDATE_POINT, ADD_POINT, DELETE_POINT} = UserAction;

    switch (actionType) {
      case UPDATE_POINT:
        this._pointPresenter[update.id].setViewState(State.SAVING);
        this._api.updatePoint(update)
          .then((response) => this._pointsModel.updatePoint(updateType, response))
          .catch(() => this._pointPresenter[update.id].setViewState(State.ABORTING));
        break;
      case ADD_POINT:
        this._pointNewPresenter.setSaving();
        this._api.addPoint(update)
          .then((response) => this._pointsModel.addPoint(updateType, response))
          .catch(() => this._pointNewPresenter.setAborting());
        break;
      case DELETE_POINT:
        this._pointPresenter[update.id].setViewState(State.DELETING);
        this._api.deletePoint(update)
          .then(() => this._pointsModel.deletePoint(updateType, update))
          .catch(() => this._pointPresenter[update.id].setViewState(State.ABORTING));
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
}
