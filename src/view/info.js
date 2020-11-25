const createRouteInfoTemplate = (events) => {
  return events.length > 3
    ? `${events[0].city} &mdash; ... &mdash; ${events[events.length - 1].city}`
    : events.map((event) => `${event.city} &mdash;`).join(` `);
};

export const createInfoTemplate = (events) => {
  const dateStart = events[0].date.start.format(`MMM DD`);
  const dateFinish = events[0].date.start.format(`MMM`) === events[events.length - 1].date.finish.format(`MMM`)
    ? events[events.length - 1].date.finish.format(`DD`)
    : events[events.length - 1].date.finish.format(`MMM DD`);
  const routeInfoTemplate = createRouteInfoTemplate(events);
  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${routeInfoTemplate}</h1>
      <p class="trip-info__dates">${dateStart}&nbsp;&mdash;&nbsp;${dateFinish}</p>
    </div>
  </section>`;
};
