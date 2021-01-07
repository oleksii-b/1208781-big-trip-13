import SmartView from './smart';
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

const createStatTemplate = (points) => {
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
    return createStatTemplate(this._data);
  }

  removeElement() {
    super.removeElement();

    this._removeCharts();
  }

  restoreHandlers() {
    this._setCharts();
  }

  _setCharts() {
    // отрисовка трех графиков
  }

  _removeCharts() {
    // удаление графиков
  }
}
