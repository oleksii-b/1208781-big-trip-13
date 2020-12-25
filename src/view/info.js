import AbstractView from './abstract';

const createRouteInfoTemplate = (events) => {
  return events.length > 3
    ? `${events[0].destination.city} &mdash; ... &mdash; ${events[events.length - 1].destination.city}`
    : events.map((event) => `${event.destination.city} &mdash;`).join(` `).slice(0, -7);
};

const createInfoTemplate = (events) => {
  let dateFinish = ``;
  let dateStart = ``;
  let routeInfoTemplate = ``;

  if (events.length) {
    dateStart = events[0].date.start.format(`MMM DD`) + `&nbsp;&mdash;&nbsp;`;
    dateFinish = events[0].date.start.format(`MMM`) === events[events.length - 1].date.finish.format(`MMM`)
      ? events[events.length - 1].date.finish.format(`DD`)
      : events[events.length - 1].date.finish.format(`MMM DD`);
    routeInfoTemplate = createRouteInfoTemplate(events);
  }

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${routeInfoTemplate}</h1>
        <p class="trip-info__dates">${dateStart}${dateFinish}</p>
      </div>
    </section>`
  );
};

export default class Info extends AbstractView {
  constructor(route) {
    super();
    this._route = route;
  }

  getTemplate() {
    return createInfoTemplate(this._route);
  }
}
