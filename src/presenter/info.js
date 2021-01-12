import InfoView from '../view/info';
import {render, RenderPosition, remove, replace} from '../utils/render';
import {sortDefault} from '../utils/sort';
import {filter} from '../utils/filter';

export default class InfoPresenter {
  constructor(container, pointsModel, filterModel) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;

    this._infoComponent = null;

    this._onModelEvent = this._onModelEvent.bind(this);
    this._pointsModel.addObserver(this._onModelEvent);
    this._filterModel.addObserver(this._onModelEvent);
  }

  init() {
    const points = this.points;
    const prevInfoComponent = this._infoComponent;

    this._infoComponent = new InfoView(points);

    if (prevInfoComponent === null) {
      render(this._container, this._infoComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this._infoComponent, prevInfoComponent);
    remove(prevInfoComponent);
  }

  get points() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filteredPoints = filter[filterType](points);

    return filteredPoints.sort(sortDefault);
  }

  _onModelEvent() {
    this.init();
  }
}

