import NewPointView from '../view/new-point';
import {remove, render, RenderPosition} from '../utils/render';
import {UserAction, UpdateType, newPoint} from '../utils/const';
import {nanoid} from 'nanoid';

export default class PointNew {
  constructor(tripListContainer, changeData) {
    this._tripListContainer = tripListContainer;
    this._changeData = changeData;
    this._tripContentContainer = tripListContainer;

    this._newPointComponent = null;

    this._onFormSubmit = this._onFormSubmit.bind(this);
    this._onFormClose = this._onFormClose.bind(this);
    this._onFormPressEsc = this._onFormPressEsc.bind(this);
  }

  init(offers, destinations) {
    if (this._newPointComponent !== null) {
      return;
    }

    this._newPointComponent = new NewPointView(newPoint, offers, destinations);
    this._newPointComponent.setFormSubmitHandler(this._onFormSubmit);
    this._newPointComponent.setFormCloseHandler(this._onFormClose);

    render(this._tripListContainer, this._newPointComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener(`keydown`, this._onFormPressEsc);
  }

  destroy() {
    if (this._newPointComponent !== null) {
      remove(this._newPointComponent);
      this._newPointComponent = null;
      document.querySelector(`.trip-main__event-add-btn`).disabled = false;
      document.removeEventListener(`keydown`, this._onFormPressEsc);
    }
  }

  setSaving() {
    this._newPointComponent.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._newPointComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this._newPointComponent.shake(resetFormState);
  }

  _onFormSubmit(point) {
    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        Object.assign({id: nanoid()}, point)
    );
  }

  _onFormPressEsc(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }

  _onFormClose() {
    this.destroy();
  }
}
