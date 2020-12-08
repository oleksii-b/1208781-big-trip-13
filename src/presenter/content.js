import InfoView from '../view/info';
import PriceView from '../view/price';
import SortView from '../view/sort';
import NoPointView from '../view/no-point';
import TripListView from '../view/trip-list';
import EditPointView from '../view/edit-point';
import PointView from '../view/point';
import {render, RenderPosition, replace} from '../utils/render';

const COUNT_POINT = 20;

export default class Trip {
  constructor(tripContentContainer) {
    this._tripContentContainer = tripContentContainer;

    this._tripListComponent = new TripListView();
    this._sortComponent = new SortView();
    this._priceComponent = new PriceView();
    this._noPointComponent = new NoPointView();
    this._infoComponent = new InfoView();
  }

  init(events) {
    this._events = events.slice();
    if (events.length) {
      this._renderInfo();
      this._renderPrice();
      this._renderSort();
      this._tripListComponent();
      events.forEach((event) => this._renderPoint(event));
    } else {
      this._renderNoPoint();
    }
  }

  _renderPoint(event) {
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
      if (!this._tripListComponent.getElement().querySelector(`form`)) {
        replacePointToForm();
        document.addEventListener(`keydown`, onEscKeyDown);
      }
    });

    pointEditComponent.setFormSubmitHandler(() => {
      replaceFormToPoint();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    pointEditComponent.setFormCloseHandler(() => {
      replaceFormToPoint();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    render(this._tripListComponent, pointComponent, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    render(this._tripContentContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderPrice() {
    render(this._infoComponent, this._priceComponent. RenderPosition.BEFOREEND);
  }

  _renderInfo() {
    const tripMainElement = document.querySelector(`.trip-main`);
    render(tripMainElement, this._infoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderNoPoint() {
    render(this._tripContentContainer, this._noPointComponent, RenderPosition.AFTERBEGIN);
  }

  renderTripList() {
    render(this._tripContentContainer, this._tripListComponent, RenderPosition.BEFOREEND);

  }
}
