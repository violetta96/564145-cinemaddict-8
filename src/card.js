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

    this._onComments = null;
    this._onCommentsButtonClick = this._onCommentsButtonClick.bind(this);
    this._isFavourite = data.isFavourite;
    this._isWatched = data.isWatched;
    this._isWatchlist = data.isWatchlist;
  }

  _onCommentsButtonClick() {
    return typeof this._onComments === `function` && this._onComments();
  }

  set onCommentsClick(fn) {
    this._onComments = fn;
  }

  get template() {
    return `<article class="film-card ${this._isExtra ? `film-card--no-controls` : ``}">
              <h3 class="film-card__title">${this._title}</h3>
              <p class="film-card__rating">${this._rating}</p>
              <p class="film-card__info">
                <span class="film-card__year">${this._releaseDate.match(/\d{4}/)}</span>
                <span class="film-card__duration">${this._duration.hour}h&nbsp;${this._duration.min}m</span>
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
  }

  unbind() {
    this._element.querySelector(`.film-card__comments`)
      .removeEventListener(`click`, this._onCommentsButtonClick);
  }

  update(data) {
    this._comments = data.comments;
    this._isFavourite = data.isFavourite;
    this._isWatched = data.isWatched;
    this._isWatchlist = data.isWatchlist;

    this.unbind();
    this._partialUpdate();
    this.bind();
  }
}
