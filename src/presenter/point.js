import EditPointView from '../view/edit-point';
import PointView from '../view/point';
import {render, RenderPosition, replace, remove} from '../utils/render';
import {UserAction, UpdateType} from '../const';

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`,
};

export default class Point {
  constructor(tripListContainer, changeData, changeMode) {
    this._tripListContainer = tripListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._pointComponent = null;
    this._editPointComponent = null;
    this._mode = Mode.DEFAULT;
    this._prevPointComponent = null;
    this._prevEditPointComponent = null;

    this._onToggleButtonClick = this._onToggleButtonClick.bind(this);
    this._onFormSubmit = this._onFormSubmit.bind(this);
    this._onFormClose = this._onFormClose.bind(this);
    this._onFormPressEsc = this._onFormPressEsc.bind(this);
    this._onFavoriteClick = this._onFavoriteClick.bind(this);
    this._onDeleteClick = this._onDeleteClick.bind(this);
  }

  init(point, offers, destinations) {
    this._point = point;
    this._offers = offers;
    this._destinations = destinations;
    this._prevPointComponent = this._pointComponent;
    this._prevEditPointComponent = this._editPointComponent;
    this._editPointComponent = new EditPointView(point, offers, destinations);
    this._pointComponent = new PointView(point);

    this._pointComponent.setEditClickHandler(this._onToggleButtonClick);
    this._editPointComponent.setFormCloseHandler(this._onFormClose);
    this._editPointComponent.setFormSubmitHandler(this._onFormSubmit);
    this._pointComponent.setFavoriteClickHandler(this._onFavoriteClick);
    this._editPointComponent.setDeleteClickHandler(this._onDeleteClick);

    if ([this._prevEditPointComponent, this._prevPointComponent].includes(null)) {
      render(this._tripListContainer, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    this._updatePoint();
  }

  _updatePoint() {
    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, this._prevPointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._editPointComponent, this._prevEditPointComponent);
    }

    remove(this._prevPointComponent);
    remove(this._prevEditPointComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._editPointComponent.reset(this._point);
      this._replaceFormToPoint();
    }
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._editPointComponent);
  }

  _onFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.MINOR,
        Object.assign({}, this._point, {isFavorite: !this._point.isFavorite}));
  }

  _replacePointToForm() {
    replace(this._editPointComponent, this._pointComponent);
    document.addEventListener(`keydown`, this._onFormPressEsc);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToPoint() {
    replace(this._pointComponent, this._editPointComponent);
    document.removeEventListener(`keydown`, this._onFormPressEsc);
    this._mode = Mode.DEFAULT;
  }

  _onFormPressEsc(evt) {
    if ([`Esc`, `Escape`].includes(evt.key)) {
      evt.preventDefault();
      this._editPointComponent.reset(this._point);
      this._replaceFormToPoint();
    }
  }

  _onToggleButtonClick() {
    this._replacePointToForm();
  }

  _onFormClose() {
    this._editPointComponent.reset(this._point);
    this._replaceFormToPoint();
  }

  _onFormSubmit(update) {
    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.MINOR,
        update);
    this._replaceFormToPoint();
  }

  _onDeleteClick(point) {
    this._changeData(
        UserAction.DELETE_POINT,
        UpdateType.MINOR,
        point
    );
  }
}
