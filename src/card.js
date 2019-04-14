import Component from './component.js';
import moment from 'moment';

const MAX_LENGTH_DESCRIPTION = 140;

export default class Card extends Component {
  constructor(data, isExtra) {
    super();
    this._id = data.id;
    this._title = data.title;
    this._rating = data.rating;
    this._releaseDate = data.releaseDate;
    this._duration = data.duration;
    this._genre = data.genre;
    this._picture = data.picture;
    this._description = data.description;
    this._isWatched = data.isWatched;
    this._isInWatchlist = data.isInWatchlist;
    this._isFavorite = data.isFavorite;
    this._comments = data.comments;
    this._dateWatched = data.dateWatched;
    this._isExtra = isExtra;
    this._onComments = null;
    this._onWatchlist = null;
    this._onsWatched = null;
    this._onFavorite = null;
    this._onCommentsButtonClick = this._onCommentsButtonClick.bind(this);
    this._onWatchlistButtonClick = this._onWatchlistButtonClick.bind(this);
    this._onWatchedButtonClick = this._onWatchedButtonClick.bind(this);
    this._onFavoriteButtonClick = this._onFavoriteButtonClick.bind(this);
  }

  set onCommentsClick(fn) {
    this._onComments = fn;
  }

  set onWatchlistClick(fn) {
    this._onWatchlist = fn;
  }

  set onWatchedClick(fn) {
    this._onWatched = fn;
  }

  set onFavoriteClick(fn) {
    this._onFavorite = fn;
  }

  get template() {
    return `<article class="film-card ${this._isExtra ? `film-card--no-controls` : ``}">
              <h3 class="film-card__title">${this._title}</h3>
              <p class="film-card__rating">${this._rating}</p>
              <p class="film-card__info">
                <span class="film-card__year">${moment(this._releaseDate).format(`YYYY`)}</span>
                <span class="film-card__duration">${moment.utc(moment.duration(this._duration, `minutes`).asMilliseconds()).format(`h[h] m[m]`)}</span>
                <span class="film-card__genre ${![...this._genre].length ? `visually-hidden` : ``}">${[...this._genre][0]}</span>
              </p>
              <img src="${this._picture}" alt="${this._title}" class="film-card__poster">
              <p class="film-card__description">${this._description.substring(0, MAX_LENGTH_DESCRIPTION) + `...`}</p>
              <button class="film-card__comments">${this._comments.length} comments</button>
              ${!this._isExtra ? `<form class="film-card__controls">
                <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist"><!--Add to watchlist--> WL</button>
                <button class="film-card__controls-item button film-card__controls-item--mark-as-watched"><!--Mark as watched-->WTCHD</button>
                <button class="film-card__controls-item button film-card__controls-item--favorite"><!--Mark as favorite-->FAV</button>
             </form>` : ``}
           </article>`.trim();
  }

  _onCommentsButtonClick() {
    return typeof this._onComments === `function` && this._onComments();
  }


  _changeDescriptionLenght(description) {
    return description.substring(0, MAX_LENGTH_DESCRIPTION);
  }

  _onWatchlistButtonClick(evt) {
    evt.preventDefault();
    if (typeof this._onWatchlist === `function`) {
      this._onWatchlist();
    }
  }

  _onWatchedButtonClick(evt) {
    evt.preventDefault();
    if (typeof this._onWatched === `function`) {
      this._onWatched();
    }
  }

  _onFavoriteButtonClick(evt) {
    evt.preventDefault();
    if (typeof this._onFavorite === `function`) {
      this._onFavorite();
    }
  }

  _partialUpdate() {
    this._element.innerHTML = this.template;
  }

  update(data) {
    if (data.comments) {
      this._comments = data.comments;
    }
    this._isWatched = data.isWatched;
    this._isInWatchlist = data.isInWatchlist;
    this._isFavorite = data.isFavorite;
    this._userRating = data.userRating;

    this.unbind();
    this._partialUpdate();
    this.bind();
  }


  bind() {
    this._element.querySelector(`.film-card__comments`)
      .addEventListener(`click`, this._onCommentsButtonClick);
    if (!this._isExtra) {
      this._element.querySelector(`.film-card__controls-item--add-to-watchlist`)
      .addEventListener(`click`, this._onWatchlistButtonClick);
      this._element.querySelector(`.film-card__controls-item--mark-as-watched`)
      .addEventListener(`click`, this._onWatchedButtonClick);
      this._element.querySelector(`.film-card__controls-item--favorite`)
      .addEventListener(`click`, this._onFavoriteButtonClick);
    }
  }

  unbind() {
    this._element.querySelector(`.film-card__comments`)
      .removeEventListener(`click`, this._onCommentsButtonClick);
    if (!this._isExtra) {
      this._element.querySelector(`.film-card__controls-item--add-to-watchlist`)
      .removeEventListener(`click`, this._onWatchlistButtonClick);
      this._element.querySelector(`.film-card__controls-item--mark-as-watched`)
      .removeEventListener(`click`, this._onWatchedButtonClick);
      this._element.querySelector(`.film-card__controls-item--favorite`)
      .removeEventListener(`click`, this._onFavoriteButtonClick);
    }
  }
}
