import AbstractView from './abstract';

const createTripListTemplate = () => {
  return `<ul class="trip-events__list"></ul>`;
};

export default class TripList extends AbstractView {
  getTemplate() {
    return createTripListTemplate();
  }

  set isShown(value) {
    this.getElement().parentElement.classList.toggle(`trip-events--hidden`, value);
  }
}
