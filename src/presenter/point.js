import EditPointView from '../view/edit-point';
import PointView from '../view/point';
import {render, RenderPosition, replace} from '../utils/render';

export default class Point {
  constructor(tripListContainer) {
    this._tripListContainer = tripListContainer;

    this._pointComponent = null;
    this._editPointComponent = null;

    this._onToggleButtonClick = this._onToggleButtonClick.bind(this);
    this._onFormSubmit = this._onFormSubmit.bind(this);
    this._onFormClose = this._onFormClose.bind(this);
    this._onFormPressEsc = this._onFormPressEsc.bind(this);
  }

  init(event) {
    this._event = event;

    this._editPointComponent = new EditPointView(event);
    this._pointComponent = new PointView(event);

    this._pointComponent.setEditClickHandler(this._onToggleButtonClick);
    this._editPointComponent.setFormCloseHandler(this._onFormClose);
    this._editPointComponent.setFormSubmitHandler(this._onFormSubmit);


    render(this._tripListContainer, this._pointComponent, RenderPosition.BEFOREEND);
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

  _onFormSubmit() {
    this._replaceFormToPoint();
  }
}
