import {createElement} from './create-element.js';

export default class Card {
  constructor(data, isExtra) {
    this._title = data.title;
    this._rating = data.rating;
    this._year = data.year;
    this._duration = data.duration;
    this._genre = data.genre;
    this._picture = data.picture;
    this._description = data.description;
    this._comments = data.comments;
    this._isExtra = isExtra;

    this._element = null;
    this._onComments = null;
    this._onCommentsButtonClick = this._onCommentsButtonClick.bind(this);
  }

  _onCommentsButtonClick() {
    return typeof this._onComments === `function` && this._onComments();
  }

  get element() {
    return this._element;
  }

  set onComments(fn) {
    this._onComments = fn;
  }

  get template() {
    return `<article class="film-card ${this._isExtra ? `film-card--no-controls` : ``}">
              <h3 class="film-card__title">${this._title}</h3>
              <p class="film-card__rating">${this._rating}</p>
              <p class="film-card__info">
                <span class="film-card__year">${this._year}</span>
                <span class="film-card__duration">${this._duration.hour}h&nbsp;${this._duration.min}m</span>
                <span class="film-card__genre">${this._genre}</span>
              </p>
              <img src="./images/posters/${this._picture}.jpg" alt="${this._picture}" class="film-card__poster">
              <p class="film-card__description">${this._description}</p>
              <button class="film-card__comments">${this._comments} comments</button>
              ${!this._isExtra ? `<form class="film-card__controls">
                <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist"><!--Add to watchlist--> WL</button>
                <button class="film-card__controls-item button film-card__controls-item--mark-as-watched"><!--Mark as watched-->WTCHD</button>
                <button class="film-card__controls-item button film-card__controls-item--favorite"><!--Mark as favorite-->FAV</button>
             </form>` : ``}
           </article>`.trim();
  }

  render() {
    if (!this._element) {
      this._element = createElement(this.template);
      this.bind();
    }
    return this._element;
  }

  unrender() {
    this.unbind();
    this._element = null;
  }

  bind() {
    this._element.querySelector(`.film-card__comments`)
          .addEventListener(`click`, this._onCommentsButtonClick);
  }

  unbind() {
    this._element.querySelector(`.film-card__comments`)
          .removeEventListener(`click`, this._onCommentsButtonClick);
  }
}
