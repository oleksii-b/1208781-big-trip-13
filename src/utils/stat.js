import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getDurationDays} from '../utils/common';

export const renderMoneyChart = (moneyCtx, points, labels) => {
  const costsForTypes = [];
  labels.forEach((type) => {
    let cost = 0;
    points.forEach((point) => {
      cost += point.eventType.toUpperCase() === type ? +point.price : 0;
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
        anchor: `start`,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `€ ${val}`,
        },
      },
      title: {
        display: true,
        text: `MONEY`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`,
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
};

export const renderTypeChart = (typeCtx, points, labels) => {
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
        anchor: `start`,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}x`,
        },
      },
      title: {
        display: true,
        text: `TYPE`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`,
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
};

export const renderTimeChart = (typeCtx, points, labels) => {
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
        anchor: `start`,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => getDurationDays(val),
        },
      },
      title: {
        display: true,
        text: `TIME-SPEND`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`,
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
};
