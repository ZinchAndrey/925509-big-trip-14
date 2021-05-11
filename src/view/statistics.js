import dayjs from 'dayjs';
import SmartView from './smart.js';

function createStatisticsTemplate(points) {
  // points будет использоваться для задания высоты канваса
  return `<section class="statistics">
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
  </section>`;
}

export default class Statistics extends SmartView {
  constructor(points) {
    super();

    this._points = points;
  }

  getTemplate() {
    return createStatisticsTemplate(this._tripPoints);
  }

  _setCharts() {
    const moneyCanvas = this.getElement().querySelector('.statistics__chart--money');
    const typeCanvas = this.getElement().querySelector('.statistics__chart--transport');
    const timeCanvas = this.getElement().querySelector('.statistics__chart--time');

    // будет вызываться функция по построению графиков
  }
}
