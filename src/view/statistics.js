import Chart from 'chart.js';
import ChartDataTypes from 'chartjs-plugin-datalabels';


import {getTimeDifference, getTimeFormatted} from '../utils/point.js';
import SmartView from './smart.js';

const BAR_HEIGHT = 55;
const MIN_TYPES_COUNT = 4;

function createStatisticsTemplate(points) {
  const typesCount = getTypes(points).length;
  let height = BAR_HEIGHT * MIN_TYPES_COUNT;

  if (typesCount > MIN_TYPES_COUNT) {
    height = BAR_HEIGHT * typesCount;
  }

  return `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

    <div class="statistics__item statistics__item--money">
      <canvas class="statistics__chart  statistics__chart--money" width="900" height="${height}"></canvas>
    </div>

    <div class="statistics__item statistics__item--transport">
      <canvas class="statistics__chart  statistics__chart--transport" width="900" height="${height}"></canvas>
    </div>

    <div class="statistics__item statistics__item--time-spend">
      <canvas class="statistics__chart  statistics__chart--time" width="900" height="${height}"></canvas>
    </div>
  </section>`;
}

function getTypes(points) {
  const uniqueTypes = new Set();
  points.forEach((point) => {
    uniqueTypes.add(point.type.toUpperCase());
  });

  return Array.from(uniqueTypes.values());
}

function getSumPricesOfTypes(points) {
  const uniqueTypes = getTypes(points);

  const sumPrices = uniqueTypes.map((type) => {
    let sumPrice = 0;
    points.forEach((point) => {
      if (point.type.toUpperCase() === type) {
        sumPrice += point.data.price;
      }
    });

    return sumPrice;
  });

  return sumPrices;
}

function getCountsOfTypes(points) {
  const uniqueTypes = getTypes(points);

  const counts = uniqueTypes.map((type) => {
    let count = 0;
    points.forEach((point) => {
      if (point.type.toUpperCase() === type) {
        count += 1;
      }
    });

    return count;
  });

  return counts;
}

function getTimesOfTypes(points) {
  const uniqueTypes = getTypes(points);

  const times = uniqueTypes.map((type) => {
    let time = 0;
    points.forEach((point) => {
      if (point.type.toUpperCase() === type) {
        const timeDifference = getTimeDifference(point.data.date.from, point.data.date.to);
        time += timeDifference;
      }
    });
    return time;
  });

  return times;
}


function createMoneyChart(moneyCtx, points) {
  return new Chart(moneyCtx, {
    plugins: [ChartDataTypes],
    type: 'horizontalBar',
    data: {
      labels: getTypes(points),
      datasets: [{
        data: getSumPricesOfTypes(points),
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `€ ${val}`,
        },
      },
      title: {
        display: true,
        text: 'MONEY',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
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
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
}

function createTypeChart (typeCtx, points) {
  return new Chart(typeCtx, {
    plugins: [ChartDataTypes],
    type: 'horizontalBar',
    data: {
      labels: getTypes(points),
      datasets: [{
        data: getCountsOfTypes(points),
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${val}x`,
        },
      },
      title: {
        display: true,
        text: 'TYPE',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
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
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
}

function createTimeChart  (timeCtx, points) {
  return new Chart(timeCtx, {
    plugins: [ChartDataTypes],
    type: 'horizontalBar',
    data: {
      labels: getTypes(points),
      datasets: [{
        data: getTimesOfTypes(points),
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${getTimeFormatted(val)}`,
        },
      },
      title: {
        display: true,
        text: 'TIME-SPEND',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
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
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
}

export default class Statistics extends SmartView {
  constructor(points) {
    super();

    this._points = points;

    this._moneyChart = null;
    this._typeChart = null;
    this._timeChart = null;

    this._setCharts();
  }

  getTemplate() {
    return createStatisticsTemplate(this._points);
  }

  _setCharts() {
    if (this._moneyChart !== null || this._typeChart !== null || this._timeChart !== null) {
      this._moneyChart = null;
      this._typeChart = null;
      this._timeChart = null;
    }

    const moneyCtx = this.getElement().querySelector('.statistics__chart--money');
    const typeCtx = this.getElement().querySelector('.statistics__chart--transport');
    const timeCtx = this.getElement().querySelector('.statistics__chart--time');

    this._moneyChart = createMoneyChart(moneyCtx, this._points);
    this._typeChart = createTypeChart(typeCtx, this._points);
    this._timeChart = createTimeChart(timeCtx, this._points);
  }
}
