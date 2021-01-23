import InfoView from '../view/info';
import {render, RenderPosition, remove, replace} from '../utils/render';
import {sortDefault} from '../utils/sort';

export default class InfoPresenter {
  constructor(container, pointsModel, filterModel) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._infoComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._pointsModel.addObserver(this._onDataChange);
    this._filterModel.addObserver(this._onDataChange);
  }

  get points() {
    const points = this._pointsModel.points;

    return points.sort(sortDefault);
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

  _onDataChange() {
    this.init();
  }
}

