import {createCityTemplate} from './new-point';
import {createPhotoTemplate} from './new-point';
import {createDestinationTemplate} from './new-point';
import SmartView from './smart';

const createOfferTemplate = (offers, selectedOffers) => {
  return `
  <section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
  ${offers.map((offer, index) => (
    `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title}-${index}" type="checkbox" name="event-offer-${offer.title}"
        ${selectedOffers.includes(offer) ? `checked` : ``}>
        <label class="event__offer-label" for="event-offer-${offer.title}-${index}">
          <span class="event__offer-title">${offer.name}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`
  )).join(``)}
    </div>
  </section>`;
};

const createEventTypeListTemplate = (eventType, isChecked) => {
  const eventTypeLowerCase = eventType.toLowerCase();

  return (
    `<div class="event__type-item">
        <input id="event-type-${eventTypeLowerCase}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventTypeLowerCase}" ${isChecked ? `checked` : ``}>
        <label class="event__type-label  event__type-label--${eventTypeLowerCase}" for="event-type-${eventTypeLowerCase}-1">${eventType}</label>
    </div>`
  );
};

const createEditPointTemplate = (data) => {
  const {eventType, eventTypes, city, selectedOffers, price, offers, destinations, date: {start, finish}, withOffers} = data;
  const destinationCities = createCityTemplate(destinations);
  const offerForThisType = offers.filter((offer) => offer.id.toLowerCase() === eventType.toLowerCase());
  const descriptionForThisCity = destinations.find((destination) => destination.city === city);
  const photoTemplate = descriptionForThisCity.photos.length ? createPhotoTemplate(descriptionForThisCity.photos) : ``;

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${eventType.toLowerCase()}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${eventTypes.map((elem) => createEventTypeListTemplate(elem, elem.toLowerCase() === eventType.toLowerCase())).join(``)}                
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${eventType}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value=${city} list="destination-list-1">
            <datalist id="destination-list-1">
              ${destinationCities}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${start.format(`DD/MM/YY HH:mm`)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${finish.format(`DD/MM/YY HH:mm`)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${withOffers ? createOfferTemplate(offerForThisType, selectedOffers) : ``} 
          ${createDestinationTemplate(descriptionForThisCity.description, photoTemplate)}
        </section>
      </form>
    </li>`
  );
};

export default class EditPoint extends SmartView {
  constructor(point) {
    super();
    this._data = EditPoint.parsePointToData(point);

    this._onFormSubmit = this._onFormSubmit.bind(this);
    this._onFormClose = this._onFormClose.bind(this);
    this._onEventTypeChange = this._onEventTypeChange.bind(this);
    this._onDestinationChange = this._onDestinationChange.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createEditPointTemplate(this._data);
  }

  static parsePointToData(point) {
    const offerForThisType = point.offers.filter((offer) => offer.id === point.eventType);
    return Object.assign(
        {},
        point,
        {
          withOffers: offerForThisType.length > 0,
        }
    );
  }

  static parseDataToPoint(data) {
    data = Object.assign({}, data);
    delete data.withDescription;
    delete data.withOffers;
    delete data.withPhoto;

    return data;
  }

  _onFormSubmit(evt) {
    evt.preventDefault();
    this._callback.submitForm(EditPoint.parseDataToPoint(this._data));
  }

  _onFormClose(evt) {
    evt.preventDefault();
    this._callback.closeForm();
  }

  _onEventTypeChange(evt) {
    evt.preventDefault();
    const offerForThisType = this._data.offers.filter((offer) => offer.id.toLowerCase() === evt.target.value);
    this.updateData({eventType: evt.target.value, withOffers: offerForThisType.length});
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

  _setInnerHandlers() {
    this.getElement().querySelector(`.event__type-group`).addEventListener(`change`, this._onEventTypeChange);
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`input`, this._onDestinationChange);
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
}
