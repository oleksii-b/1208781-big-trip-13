import AbstractView from './abstract';

const createLoadingTemplate = () => {
  return (
    `<div>
      <h2 class="visually-hidden">Trip events</h2>
      <p class="trip-events__msg">Loading...</p>
    </div>`
  );
};

export default class TripList extends AbstractView {
  getTemplate() {
    return createLoadingTemplate();
  }
}
