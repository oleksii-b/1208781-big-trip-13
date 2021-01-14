import SmartView from './smart';
import {BAR_HEIGHT} from '../const';
import {renderMoneyChart, renderTimeChart, renderTypeChart} from '../utils/stat';

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

    const statElement = this.getElement();

    const moneyCtx = statElement.querySelector(`.statistics__chart--money`);
    const typeCtx = statElement.querySelector(`.statistics__chart--transport`);
    const timeCtx = statElement.querySelector(`.statistics__chart--time`);

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
