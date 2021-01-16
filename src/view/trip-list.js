import AbstractView from './abstract';

const createTripListTemplate = () => {
  return `<ul class="trip-events__list"></ul>`;
};

export default class TripList extends AbstractView {
  set isHidden(value) {
    this.getElement().parentElement.classList.toggle(`trip-events--hidden`, value);
  }

  getTemplate() {
    return createTripListTemplate();
  }
}
