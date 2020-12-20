import dayjs from 'dayjs';
import {getRandomInteger} from '../utils/common';
import SmartView from './smart';

export const createPhotoTemplate = (photos) => {
  return photos.map((photo) =>
    `<img class="event__photo" src="${photo}" alt="Event photo">`).join(``);
};

export const createEventTypeListTemplate = (eventType, isChecked) => {
  const eventTypeLowerCase = eventType.toLowerCase();

  return (
    `<div class="event__type-item">
      <input id="event-type-${eventTypeLowerCase}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventTypeLowerCase}" ${isChecked ? `checked` : ``}>
      <label class="event__type-label  event__type-label--${eventTypeLowerCase}" for="event-type-${eventTypeLowerCase}-1">${eventType}</label>
    </div>`
  );
};

const createOfferTemplate = (offers) => {
  return `
  <section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
  ${offers.map((offer, index) => {
    const {title, name, price} = offer;
    const id = `event-offer-${title}-${index}`;

    return (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="${id}" type="checkbox" name="event-offer-${title}"
        ${getRandomInteger(0, 1) ? `checked` : ``}>
        <label class="event__offer-label" for="${id}">
          <span class="event__offer-title">${name}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
        </label>
      </div>`
    );
  }).join(``)}
    </div>
  </section>`;
};

export const createDestinationTemplate = (description, photos) => {
  if (description.length || photos) {
    return (
      `<section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${description}</p>

        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${photos}
          </div>
        </div>
      </section>`
    );
  }

  return ``;
};

export const createCityTemplate = (cities) => {
  return cities.map(({city}) =>
    `<option value=${city}></option>`).join(``);
};

const createNewPointTemplate = (data) => {
  const {eventType, eventTypes, offerForThisType, destinations} = data;
  const destinationCities = createCityTemplate(destinations);
  const defaultCity = destinations.city[0];
  const descriptionForThisCity = destinations.find(({city}) => city === defaultCity);
  const photoTemplate = descriptionForThisCity.photos.length ? createPhotoTemplate(descriptionForThisCity.photos) : ``;

  return (
    `<form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${eventTypes.map((event) => createEventTypeListTemplate(event, event.toLowerCase() === eventType.toLowerCase())).join(``)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${eventType}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${defaultCity}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${destinationCities}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs().format(`DD/MM/YY HH:mm`)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayjs().format(`DD/MM/YY HH:mm`)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
      </header>
      <section class="event__details">
        ${offerForThisType.length ? createOfferTemplate(offerForThisType) : ``}
        ${createDestinationTemplate(descriptionForThisCity.description, photoTemplate)}      
      </section>
    </form>`
  );
};

export default class NewPoint extends SmartView {
  constructor(point) {
    super();
    this._data = NewPoint.parsePointToData(point);

    this._onFormSubmit = this._onFormSubmit.bind(this);
    this._onFormClose = this._onFormClose.bind(this);
    this._onEventTypeChange = this._onEventTypeChange.bind(this);
    this._onDestinationChange = this._onDestinationChange.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createNewPointTemplate(this._data);
  }

  static parsePointToData(point) {
    const offers = JSON.parse(JSON.stringify(point.offers));
    const offerForThisType = offers.filter((offer) => offer.id.toLowerCase() === point.eventType.toLowerCase());
    return Object.assign(
        {},
        point,
        {
          offerForThisType,
          offers,
        }
    );
  }

  static parseDataToPoint(data) {
    data = Object.assign({}, data);
    delete data.offerForThisType;

    return data;
  }

  _onFormSubmit(evt) {
    evt.preventDefault();
    this._callback.submitForm(NewPoint.parseDataToPoint(this._data));
  }

  _onFormClose(evt) {
    evt.preventDefault();
    this._callback.closeForm();
  }

  _onEventTypeChange(evt) {
    evt.preventDefault();
    for (let offer of this._data.offers) {
      offer.checked = false;
    }
    const offerForThisType = this._data.offers.filter((offer) => offer.id.toLowerCase() === evt.target.value);
    this.updateData({eventType: evt.target.value, offerForThisType});
  }

  _onDestinationChange(evt) {
    evt.preventDefault();
    if (!this._data.cities.includes(evt.target.value)) {
      this.getElement().querySelector(`.event__input--destination`).setCustomValidity(`Введите город из списка`);
    } else {
      this.getElement().querySelector(`.event__input--destination`).setCustomValidity(``);
      this.updateData({city: evt.target.value});
    }
  }

  _onOffersChange(evt) {
    evt.preventDefault();
    const offerElement = this._data.offers.find((elem) => elem.title === evt.target.name);
    offerElement.checked = offerElement.checked ? false : true;
    this.updateData({offers: this._data.offers}, true);
  }

  _onPriceInput(evt) {
    evt.preventDefault();
    this.updateData({price: evt.target.value}, true);
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.event__type-group`).addEventListener(`change`, this._onEventTypeChange);
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`input`, this._onDestinationChange);
    this.getElement().querySelector(`.event__input--price`).addEventListener(`input`, this._onPriceInput);

    if (this._data.offerForThisType.length) {
      this.getElement().querySelector(`.event__available-offers`).addEventListener(`change`, this._onOffersChange);
    }
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormCloseHandler(this._callback.closeForm);
    this.setFormSubmitHandler(this._callback.submitForm);
  }

  setFormSubmitHandler(callback) {
    this._callback.submitForm = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._onFormSubmit);
  }

  setFormCloseHandler(callback) {
    this._callback.closeForm = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._onFormClose);
  }

  reset(point) {
    this.updateData(NewPoint.parsePointToData(point));
  }
}
