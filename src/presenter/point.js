import EditPointView from '../view/edit-point';
import PointView from '../view/point';
import {render, RenderPosition, replace, remove} from '../utils/render';

export default class Point {
  constructor(tripListContainer, changeData) {
    this._tripListContainer = tripListContainer;
    this._changeData = changeData;

    this._pointComponent = null;
    this._editPointComponent = null;

    this._onToggleButtonClick = this._onToggleButtonClick.bind(this);
    this._onFormSubmit = this._onFormSubmit.bind(this);
    this._onFormClose = this._onFormClose.bind(this);
    this._onFormPressEsc = this._onFormPressEsc.bind(this);
    this._onFavoriteClick = this._onFavoriteClick.bind(this);
  }

  init(point) {
    this._point = point;

    const prevPointComponent = this._pointComponent;
    const prevEditPointComponent = this._editPointComponent;

    this._editPointComponent = new EditPointView(point);
    this._pointComponent = new PointView(point);

    this._pointComponent.setEditClickHandler(this._onToggleButtonClick);
    this._editPointComponent.setFormCloseHandler(this._onFormClose);
    this._editPointComponent.setFormSubmitHandler(this._onFormSubmit);
    this._pointComponent.setFavoriteClickHandler(this._onFavoriteClick);

    if ([prevEditPointComponent, prevPointComponent].includes(null)) {
      render(this._tripListContainer, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._tripListContainer.getElement().contains(prevPointComponent.getElement())) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._tripListContainer.getElement().contains(prevEditPointComponent.getElement())) {
      replace(this._editPointComponent, prevEditPointComponent);
    }

    remove(prevPointComponent);
    remove(prevEditPointComponent);
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._editPointComponent);
  }

  _onFavoriteClick() {
    this._changeData(Object.assign({}, this._point, {isFavorite: !this._point.isFavorite}));
  }

  _replacePointToForm() {
    replace(this._editPointComponent, this._pointComponent);
    document.addEventListener(`keydown`, this._onFormPressEsc);
  }

  _replaceFormToPoint() {
    replace(this._pointComponent, this._editPointComponent);
    document.removeEventListener(`keydown`, this._onFormPressEsc);
  }

  _onFormPressEsc(evt) {
    if (evt.key === `Esc` || evt.key === `Escape`) {
      evt.preventDefault();
      this._replaceFormToPoint();
    }
  }

  _onToggleButtonClick() {
    this._replacePointToForm();
  }

  _onFormClose() {
    this._replaceFormToPoint();
  }

  _onFormSubmit(point) {
    this._changeData(point);
    this._replaceFormToPoint();
  }
}
