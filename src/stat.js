import Chart from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels';

const statisticText = document.querySelectorAll(`.statistic__item-text`);
const statisticCtx = document.querySelector(`.statistic__chart`);

const drawStat = (cards) => {
  const genresStats = getStat(cards);
  const BAR_HEIGHT = 50;
  statisticCtx.height = BAR_HEIGHT * genresStats.labels.length;
  const myChart = new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: genresStats.labels,
      datasets: [{
        data: genresStats.values,
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
  const [hours, mins] = genresStats.totalDuration;
  statisticText[0].innerHTML = `${genresStats.total }<span class="statistic__item-description">movies</span>`;
  statisticText[1].innerHTML = `${hours}<span class="statistic__item-description">h</span>${mins}<span class="statistic__item-description">m</span>`;
  statisticText[2].innerHTML = `${genresStats.topGenre ? genresStats.topGenre : genresStats.topGenreDefault}`;
};


const getStat = (movies) => {
  const genresStats = {};
  const filteredMovies = movies.filter((movie) => movie.isWatched);
  filteredMovies.forEach((movie) => {
    movie.genre.forEach((value) => {
      if (genresStats.hasOwnProperty(value)) {
        genresStats[value]++;
      } else {
        genresStats[value] = 1;
      }
    });
  });
  genresStats.labels = Object.keys(genresStats).sort((a, b) => b - a);
  genresStats.values = Object.values(genresStats).sort((a, b) => b - a);
  genresStats.topGenre = genresStats.labels[0];
  genresStats.topGenreDefault = `none`;
  genresStats.totalDuration = countDuration(getTotalDuration(filteredMovies));
  genresStats.total = filteredMovies.length;

  return genresStats;
};

const countDuration = (duration) => {
  const hour = Math.floor(duration / 60);
  const min = duration - hour * 60;
  const arr = [hour, min];
  return arr;
};

const getTotalDuration = (movies) => {
  return movies.reduce((acc, movie) => {
    return acc + movie.duration;
  }, 0);
};

export {drawStat};
