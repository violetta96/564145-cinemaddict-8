import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from 'moment';
import Component from './component.js';
import {createElement} from './create-element.js';

export default class Statistic extends Component {

  constructor(films) {
    super();

    this._films = films;
    this._chart = null;
    this._watchedFilms = this._films.filter((film) => film.isWatched);
    this._filteredFilms = this._watchedFilms;

    this._onStatisticFilters = this._onStatisticFilters.bind(this);
  }


  _onStatisticFilters() {
    const filter = this._element.querySelector(`.statistic__filters-input:checked`).value;

    switch (filter) {
      case `all-time`:
        this._filteredFilms = this._watchedFilms;
        break;
      case `today`:
        this._filteredFilms = this._watchedFilms.filter((film) => moment(film.dateWatched).format(`D MMMM YYYY`) === moment().format(`D MMMM YYYY`));
        break;
      case `week`:
        this._filteredFilms = this._watchedFilms.filter((film) => moment(film.dateWatched) > moment().subtract(1, `w`));
        break;
      case `month`:
        this._filteredFilms = this._watchedFilms.filter((film) => moment(film.dateWatched) > moment().subtract(1, `months`));
        break;
      case `year`:
        this._filteredFilms = this._watchedFilms.filter((film) => moment(film.dateWatched) > moment().subtract(1, `y`));
        break;
    }

    this._update();
  }

  _sortObject(obj) {
    const sorted = Object.entries(obj).sort((a, b) => {
      return b[1] - a[1];
    });
    return sorted;
  }

  _filterByGenre() {
    let genresStats = {};

    this._filteredFilms.forEach((movie) => {
      movie.genre.forEach((value) => {
        if (genresStats.hasOwnProperty(value)) {
          genresStats[value]++;
        } else {
          genresStats[value] = 1;
        }
      });
    });

    const sortedGenresStats = this._sortObject(genresStats);
    genresStats.labels = sortedGenresStats.map((item) => item[0]);
    genresStats.values = sortedGenresStats.map((item) => item[1]);

    return [genresStats.labels, genresStats.values];
  }

  _generateCharts() {
    const [genresStatsLabels, genresStatsValues] = this._filterByGenre();
    const statisticCtx = this._element.querySelector(`.statistic__chart`);
    const BAR_HEIGHT = 50;
    statisticCtx.height = BAR_HEIGHT * genresStatsLabels.length;

    this._chart = new Chart(statisticCtx, this._generateChart());

    this._chart.data = {
      labels: genresStatsLabels,
      datasets: [{
        data: genresStatsValues,
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    };

    this._chart.update();
  }

  _generateChart() {
    return {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
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
    };
  }

  _getDuration() {
    const totalDuration = this._filteredFilms.reduce((acc, movie) => acc + movie.duration, 0);
    return `${Math.floor(totalDuration / 60)}
            <span class="statistic__item-description">h</span>
            ${(totalDuration - Math.floor(totalDuration / 60) * 60)}
            <span class="statistic__item-description">m</span>`;
  }

  _getTopGenres() {
    const [genresStatsLabels] = this._filterByGenre();
    const topGenre = genresStatsLabels[0];

    return `${topGenre ? topGenre : `none`}`;
  }

  _getWatchedFilms() {
    return `${this._filteredFilms.length} <span class="statistic__item-description">movie${this._filteredFilms.length === 1 ? `` : `s`}</span>`;
  }

  _update() {
    this._chart.destroy();
    this._generateCharts();
    this._element.querySelector(`.statistic__item-text--watched`).innerHTML = this._getWatchedFilms();
    this._element.querySelector(`.statistic__item-text--duration`).innerHTML = this._getDuration();
    this._element.querySelector(`.statistic__item-text--genres`).innerHTML = this._getTopGenres();
  }

  get template() {
    return `<section class="statistic">
      <p class="statistic__rank">Your rank <span class="statistic__rank-label">Sci-Fighter</span></p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
        <label for="statistic-all-time" class="statistic__filters-label">All time</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
        <label for="statistic-today" class="statistic__filters-label">Today</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
        <label for="statistic-week" class="statistic__filters-label">Week</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
        <label for="statistic-month" class="statistic__filters-label">Month</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
        <label for="statistic-year" class="statistic__filters-label">Year</label>
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text statistic__item-text--watched">${this._getWatchedFilms()}</p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text statistic__item-text--duration">${this._getDuration()}</p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text statistic__item-text--genres">${this._getTopGenres()}</p>
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>

    </section>`;
  }

  render() {
    if (!this._element) {
      this._element = createElement(this.template);
      this.bind();
    }
    this._generateCharts();
    return this._element;
  }

  bind() {
    this._element.querySelectorAll(`.statistic__filters-input`).forEach((element) => {
      element.addEventListener(`click`, this._onStatisticFilters);
    });
  }

  unbind() {
    this._element.querySelectorAll(`.statistic__filters-input`).forEach((element) => {
      element.removeEventListener(`click`, this._onStatisticFilters);
    });
  }
}
