import SmartView from './smart';
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getDurationDays} from '../utils/common';
import {BAR_HEIGHT} from '../const';

const renderMoneyChart = (moneyCtx, points, labels) => {
  const costsForTypes = [];
  labels.forEach((type) => {
    let cost = 0;
    points.forEach((point) => {
      cost += point.eventType.toUpperCase() === type ? point.price : 0;
    });
    costsForTypes.push(cost);
  });

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels,
      datasets: [{
        data: costsForTypes,
        backgroundColor: `#1E90FF`,
        hoverBackgroundColor: `#B0E0E6`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `€ ${val}`
        }
      },
      title: {
        display: true,
        text: `MONEY`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const renderTypeChart = (typeCtx, points, labels) => {
  const countOfTypes = [];
  labels.forEach((type) => {
    let count = 0;
    points.forEach((point) => {
      count += point.eventType.toUpperCase() === type ? 1 : 0;
    });
    countOfTypes.push(count);
  });

  return new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels,
      datasets: [{
        data: countOfTypes,
        backgroundColor: `#1E90FF`,
        hoverBackgroundColor: `#B0E0E6`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}x`
        }
      },
      title: {
        display: true,
        text: `TYPE`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const renderTimeChart = (typeCtx, points, labels) => {
  const durationTimeOfTypes = [];
  labels.forEach((type) => {
    let duration = 0;
    points.forEach((point) => {
      duration += point.eventType.toUpperCase() === type ? point.date.finish.diff(point.date.start) : 0;
    });
    durationTimeOfTypes.push(duration);
  });

  return new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels,
      datasets: [{
        data: durationTimeOfTypes,
        backgroundColor: `#1E90FF`,
        hoverBackgroundColor: `#B0E0E6`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => getDurationDays(val)
        }
      },
      title: {
        display: true,
        text: `TIME-SPEND`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const createStatTemplate = () => {
  return (
    `<section class="statistics">
        <h2 class="visually-hidden">Trip statistics</h2>

        <div class="statistics__item statistics__item--money">
          <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
        </div>

        <div class="statistics__item statistics__item--transport">
          <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
        </div>

        <div class="statistics__item statistics__item--time-spend">
          <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
        </div>
    </section>`
  );
};

export default class Statistics extends SmartView {
  constructor(points) {
    super();

    this._data = points;

    this._moneyChart = null;
    this._timeChart = null;
    this._typeChart = null;

    this._setCharts();
  }

  getTemplate() {
    return createStatTemplate();
  }

  removeElement() {
    super.removeElement();

    this._removeCharts();
  }

  restoreHandlers() {
    this._setCharts();
  }

  _setCharts() {
    this._removeCharts();

    const moneyCtx = this.getElement().querySelector(`.statistics__chart--money`);
    const typeCtx = this.getElement().querySelector(`.statistics__chart--transport`);
    const timeCtx = this.getElement().querySelector(`.statistics__chart--time`);

    const types = [];
    this._data.forEach((point) => types.push(point.eventType.toUpperCase()));
    const labels = [...new Set(types)];

    moneyCtx.height = BAR_HEIGHT * labels.length;
    typeCtx.height = BAR_HEIGHT * labels.length;
    timeCtx.height = BAR_HEIGHT * labels.length;
    this._moneyChart = renderMoneyChart(moneyCtx, this._data, labels);
    this._typeChart = renderTypeChart(typeCtx, this._data, labels);
    this._timeChart = renderTimeChart(timeCtx, this._data, labels);
  }

  _removeCharts() {
    if ([this._moneyChart, this._typeChart, this._timeChart].includes(null)) {
      this._moneyChart = null;
      this._typeChart = null;
      this._timeChart = null;
    }
  }
}
