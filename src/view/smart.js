import Abstract from './abstract';
import flatpickr from 'flatpickr';

export default class Smart extends Abstract {
  constructor() {
    super();
    this._data = {};
  }

  restoreHandlers() {
    throw new Error(`Abstract method not implemented: resetHandlers`);
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();
  }

  updateData(update, isInProgress) {
    if (!update) {
      return;
    }

    this._data = Object.assign(
        {},
        this._data,
        update
    );

    if (isInProgress) {
      return;
    }

    this.updateElement();
  }

  _setDatePickers() {
    const {date: {start, finish}} = this._data;

    if (this._startDatepicker) {
      this._startDatepicker.destroy();
      this._startDatepicker = null;
    }

    if (this._endDatepicker) {
      this._endDatepicker.destroy();
      this._endDatepicker = null;
    }

    this._startDatepicker = flatpickr(
        this.getElement().querySelector(`#event-start-time-1`),
        {
          enableTime: true,
          dateFormat: `y/m/d H:i`,
          defaultDate: start.toDate(),
          onChange: this._onStartDateChange,
        }
    );

    this._endDatepicker = flatpickr(
        this.getElement().querySelector(`#event-end-time-1`),
        {
          enableTime: true,
          dateFormat: `y/m/d H:i`,
          defaultDate: finish.toDate(),
          minDate: start.toDate(),
          onChange: this._onEndDateChange,
        }
    );
  }
}
