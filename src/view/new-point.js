import dayjs from 'dayjs';
import SmartView from './smart';
import flatpickr from 'flatpickr';

export const createPhotoTemplate = (photos) => {
  return photos.map((photo) =>
    `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`).join(``);
};

export const createEventTypeListTemplate = (eventType) => {
  const eventTypeLowerCase = eventType.toLowerCase();

  return (
    `<div class="event__type-item">
      <input 
        id="event-type-${eventTypeLowerCase}-1" 
        class="event__type-input  visually-hidden" 
        type="radio" 
        name="event-type" 
        value="${eventTypeLowerCase}" 
      >
      <label class="event__type-label  event__type-label--${eventTypeLowerCase}" 
      for="event-type-${eventTypeLowerCase}-1">${eventType}
      </label>
    </div>`
  );
};

const createOfferTemplate = (offers) => {
  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
      ${offers.map((offer, index) => {
      const {title, price} = offer;
      const id = `event-offer-${title}-${index}`;

      return (
        `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" 
          id="${id}" 
          type="checkbox" 
          name="event-offer-${title}"
          >
          <label class="event__offer-label" for="${id}">
            <span class="event__offer-title">${title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${price}</span>
          </label>
        </div>`
      );
    }).join(``)}
      </div>
    </section>`
  );
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

export const createCityTemplate = (destinations) => {
  return destinations.map(({name}) =>
    `<option value=${name}></option>`).join(``);
};

const createNewPointTemplate = (data, offers, destinations) => {
  const {eventType, date: {start, finish}, destination: {city, pictures, description}} = data;

  const destinationCities = createCityTemplate(destinations);
  const offersForThisType = offers.filter((offer) => offer.type === eventType.toLowerCase())[0].offers;
  const photoTemplate = pictures.length
    ? createPhotoTemplate(pictures)
    : ``;

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
                ${offers.map((elem) => createEventTypeListTemplate(elem.type)).join(``)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${eventType}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city}" list="destination-list-1">
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
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Cancel</button>
        </header>
        <section class="event__details">
          ${offersForThisType.length ? createOfferTemplate(offersForThisType) : ``}
          ${createDestinationTemplate(description, photoTemplate)}      
        </section>
      </form>
    </li>`
  );
};

export default class NewPoint extends SmartView {
  constructor(point, offers, destinations) {
    super();
    this._offers = offers;
    this._destinations = destinations;
    this._startDatepicker = null;
    this._endDatepicker = null;
    this._data = NewPoint.parsePointToData(point, this._offers, this._destinations);
    this._onFormSubmit = this._onFormSubmit.bind(this);
    this._onFormClose = this._onFormClose.bind(this);
    this._onEventTypeChange = this._onEventTypeChange.bind(this);
    this._onDestinationChange = this._onDestinationChange.bind(this);
    this._onStartDateChange = this._onStartDateChange.bind(this);
    this._onEndDateChange = this._onEndDateChange.bind(this);
    this._onOffersChange = this._onOffersChange.bind(this);
    this._onPriceInput = this._onPriceInput.bind(this);

    this._setInnerHandlers();
    this._setDatePickers();
  }

  getTemplate() {
    return createNewPointTemplate(this._data, this._offers, this._destinations);
  }

  static parsePointToData(point, offers, destinations) {
    const checkedOffers = JSON.parse(JSON.stringify(point.offers));
    const offerForThisType = offers.filter((offer) => offer.type === point.eventType.toLowerCase())[0].offers;

    return Object.assign(
        {},
        point,
        {
          offerForThisType,
          checkedOffers,
          destination: {
            city: destinations[0].name,
            description: destinations[0].description,
            pictures: destinations[0].pictures,
          },
        }
    );
  }

  static parseDataToPoint(data) {
    data = Object.assign({},
        data,
        {
          offers: data.checkedOffers,
        }
    );
    delete data.offerForThisType;
    delete data.checkedOffers;

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
    const offerForThisType = this._offers.filter((offer) => offer.type === evt.target.value)[0].offers;
    this.updateData({eventType: evt.target.value, offerForThisType, checkedOffers: []});
  }

  _onDestinationChange(evt) {
    evt.preventDefault();
    if (!this._destinations.some((destination) => destination.name === evt.target.value)) {
      this.getElement().querySelector(`.event__input--destination`).setCustomValidity(`Введите город из списка`);
    } else {
      const selectedDestination = (this._destinations.find((destination) => destination.name === evt.target.value));
      this.getElement().querySelector(`.event__input--destination`).setCustomValidity(``);
      this.updateData(
          {
            destination: {
              city: evt.target.value,
              description: selectedDestination.description,
              pictures: selectedDestination.pictures,

            },
          });
    }
  }

  _onOffersChange(evt) {
    evt.preventDefault();
    if (this._data.checkedOffers.some((offer) => `event-offer-${offer.title}` === evt.target.name)) {
      this._data.checkedOffers = this._data.checkedOffers.filter((offer) => `event-offer-${offer.title}` !== evt.target.name);
    } else {
      this._data.checkedOffers.push(this._data.offerForThisType.find((offer) => `event-offer-${offer.title}` === evt.target.name));
    }
    this.updateData({offers: this._data.checkedOffers}, true);
  }

  _onPriceInput(evt) {
    evt.preventDefault();
    this.updateData({price: +evt.target.value}, true);
  }

  _setDatePickers() {
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
          defaultDate: this._data.date.start.toDate(),
          onChange: this._onStartDateChange,
        }
    );

    this._endDatepicker = flatpickr(
        this.getElement().querySelector(`#event-end-time-1`),
        {
          enableTime: true,
          dateFormat: `y/m/d H:i`,
          defaultDate: this._data.date.finish.toDate(),
          minDate: this._data.date.start.toDate(),
          onChange: this._onEndDateChange,
        }
    );
  }

  _onStartDateChange(userDate) {
    this.updateData({
      date: {
        start: dayjs(userDate),
        finish: dayjs(userDate),
      },
    }, true);
    this._startDatepicker.set(userDate);
    this._endDatepicker.set(`minDate`, this._data.date.start.toDate());
  }

  _onEndDateChange([userDate]) {
    this.updateData({
      date: {
        start: this._data.date.start,
        finish: dayjs(userDate),
      },
    }, true);
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
    this._setDatePickers();
  }

  setFormSubmitHandler(callback) {
    this._callback.submitForm = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._onFormSubmit);
  }

  setFormCloseHandler(callback) {
    this._callback.closeForm = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._onFormClose);
  }

  reset(point) {
    this.updateData(NewPoint.parsePointToData(point));
  }
}
