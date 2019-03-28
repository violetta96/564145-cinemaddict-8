import Component from './component.js';

export default class Card extends Component {
  constructor(data, isExtra) {
    super();
    this._title = data.title;
    this._rating = data.rating;
    this._releaseDate = data.releaseDate;
    this._duration = data.duration;
    this._genre = data.genre;
    this._picture = data.picture;
    this._description = data.description;
    this._comments = data.comments;
    this._isExtra = isExtra;
    this._isInWatchlist = data.isInWatchlist;
    this._isWatched = data.isWatched;
    this._isFavorite = data.isFavorite;

    this._onComments = null;
    this._onWatchlist = null;
    this._onMarkAsWatched = null;
    this._onFavorite = null;
    this._onCommentsButtonClick = this._onCommentsButtonClick.bind(this);
    this._onAddInWatchlistButtonClick = this._onAddInWatchlistButtonClick.bind(this);
    this._onMarkAsWatchedButtonClick = this._onMarkAsWatchedButtonClick.bind(this);
    this._onFavoriteButtonClick = this._onFavoriteButtonClick.bind(this);
  }

  _onCommentsButtonClick() {
    return typeof this._onComments === `function` && this._onComments();
  }

  _onAddInWatchlistButtonClick(evt) {
    evt.preventDefault();
    if (typeof this._onWatchlist === `function`) {
      this.isInWatchlist = !this.isInWatchlist;
      this._onWatchlist();
    }
  }

  _onMarkAsWatchedButtonClick(evt) {
    evt.preventDefault();
    if (typeof this._onMarkAsWatched === `function`) {
      this.isWatched = !this.isWatched;
      this._onMarkAsWatched();
    }
  }

  _onFavoriteButtonClick(evt) {
    evt.preventDefault();
    if (typeof this._onFavorite === `function`) {
      this.isFavorite = !this.isFavorite;
      this._onFavorite();
    }
  }

  set onCommentsClick(fn) {
    this._onComments = fn;
  }

  set onWatchlistClick(fn) {
    this._onWatchlist = fn;
  }

  set onMarkAsWatchedClick(fn) {
    this._onMarkAsWatched = fn;
  }

  set onFavoriteClick(fn) {
    this._onFavorite = fn;
  }

  _countDuration(duration) {
    const hour = Math.floor(duration / 60);
    const min = duration - hour * 60;
    const arr = [hour, min];
    return arr;
  }

  get template() {
    const [hours, mins] = this._countDuration(this._duration);
    return `<article class="film-card ${this._isExtra ? `film-card--no-controls` : ``}">
              <h3 class="film-card__title">${this._title}</h3>
              <p class="film-card__rating">${this._rating}</p>
              <p class="film-card__info">
                <span class="film-card__year">${this._releaseDate.match(/\d{4}/)}</span>
                <span class="film-card__duration">${hours}h&nbsp;${mins}m</span>
                <span class="film-card__genre">${this._genre[0]}</span>
              </p>
              <img src="./images/posters/${this._picture}.jpg" alt="${this._picture}" class="film-card__poster">
              <p class="film-card__description">${this._description}</p>
              <button class="film-card__comments">${this._comments.length} comments</button>
              ${!this._isExtra ? `<form class="film-card__controls">
                <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist"><!--Add to watchlist--> WL</button>
                <button class="film-card__controls-item button film-card__controls-item--mark-as-watched"><!--Mark as watched-->WTCHD</button>
                <button class="film-card__controls-item button film-card__controls-item--favorite"><!--Mark as favorite-->FAV</button>
             </form>` : ``}
           </article>`.trim();
  }

  _partialUpdate() {
    this._element.innerHTML = this.template;
  }

  bind() {
    this._element.querySelector(`.film-card__comments`)
      .addEventListener(`click`, this._onCommentsButtonClick);
    if (!this._isExtra) {
      this._element.querySelector(`.film-card__controls-item--add-to-watchlist`)
      .addEventListener(`click`, this._onAddInWatchlistButtonClick);
      this._element.querySelector(`.film-card__controls-item--mark-as-watched`)
      .addEventListener(`click`, this._onMarkAsWatchedButtonClick);
      this._element.querySelector(`.film-card__controls-item--favorite`)
      .addEventListener(`click`, this._onFavoriteButtonClick);
    }
  }

  unbind() {
    this._element.querySelector(`.film-card__comments`)
      .removeEventListener(`click`, this._onCommentsButtonClick);
    if (!this._isExtra) {
      this._element.querySelector(`.film-card__controls-item--add-to-watchlist`)
      .removeEventListener(`click`, this._onAddInWatchlistButtonClick);
      this._element.querySelector(`.film-card__controls-item--mark-as-watched`)
      .removeEventListener(`click`, this._onMarkAsWatchedButtonClick);
      this._element.querySelector(`.film-card__controls-item--favorite`)
      .removeEventListener(`click`, this._onFavoriteButtonClick);
    }
  }

  update(data) {
    this._comments = data.comments;
    this._isWatched = data.isWatched;
    this._isInWatchlist = data.isInWatchlist;
    this._isFavorite = data.isFavorite;

    this.unbind();
    this._partialUpdate();
    this.bind();
  }
}
