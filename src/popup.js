import moment from 'moment';
import Component from './component.js';

const KEYCODE_ENTER = 13;

export default class Popup extends Component {
  constructor(data) {
    super();
    this._id = data.id;
    this._title = data.title;
    this._titleOriginal = data.titleOriginal;
    this._rating = data.rating;
    this._releaseDate = data.releaseDate;
    this._duration = data.duration;
    this._genre = data.genre;
    this._picture = data.picture;
    this._description = data.description;
    this._director = data.director;
    this._writers = data.writers;
    this._actors = data.actors;
    this._country = data.country;
    this._age = data.age;

    this._isWatched = data.isWatched;
    this._isInWatchlist = data.isInWatchlist;
    this._isFavorite = data.isFavorite;
    this._userRating = null;
    this._comments = data.comments;

    this._onClose = null;
    this._onComment = null;
    this._onScore = null;
    this._onCloseButtonClick = this._onCloseButtonClick.bind(this);
    this._onChangeEmoji = this._onChangeEmoji.bind(this);
    this._onScoreClick = this._onScoreClick.bind(this);
    this._onCommentAdd = this._onCommentAdd.bind(this);
    this._filmChangeWatched = this._filmChangeWatched.bind(this);
    this._onFilmDetailsControls = this._onFilmDetailsControls.bind(this);
  }

  _changeEmoji(emojiName) {
    switch (emojiName) {
      case `sleeping`:
        return `😴`;
      case `grinning`:
        return `😀`;
      case `neutral-face`:
        return `😐`;
      default:
        return `None`;
    }
  }

  // функция для генерирования разметки
  _getScoreHTML() {
    let fragment = ``;
    for (let i = 1; i <= 10; i++) {
      fragment += `<input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="${i}" id="rating-${i}" ${i === +this._userRating ? `checked` : ``}>
      <label class="film-details__user-rating-label" for="rating-${i}">${i}</label>`;
    }
    return fragment;
  }

  _getCommentsTemplate() {
    return this._comments.map((comment) => `<li class="film-details__comment">
         <span class="film-details__comment-emoji">${this._changeEmoji(comment.emotion)}</span>
         <div>
           <p class="film-details__comment-text">${this._firstLatterChange(comment.comment)}</p>
           <p class="film-details__comment-info">
             <span class="film-details__comment-author">${comment.author}</span>
             <span class="film-details__comment-day">${moment(comment.date).fromNow()}</span>
           </p>
         </div>
       </li>`).join(``);
  }

  _partialUpdate() {
    this._element.innerHTML = this.template;
  }

  set onClose(fn) {
    this._onClose = fn;
  }

  set onScore(fn) {
    this._onScore = fn;
  }

  set onComment(fn) {
    this._onComment = fn;
  }

  _processForm(formData) {
    const entry = {
      isFavourite: ``,
      isWatched: ``,
      isWatchlist: ``,
      userRating: ``,
      comment: {
        author: `User`,
        emotion: ``,
        comment: ``,
        date: new Date(),
      },
    };


    const cardMapper = Popup.createMapper(entry);

    for (const pair of formData.entries()) {
      const [property, value] = pair;
      if (cardMapper[property]) {
        cardMapper[property](value);
      }
    }
    return entry;
  }

  _onCommentAdd(evt) {
    if (evt.ctrlKey && evt.keyCode === KEYCODE_ENTER) {
      evt.preventDefault();
      const formData = new FormData(this._element.querySelector(`.film-details__inner`));
      const newData = this._processForm(formData);

      if (typeof this._onComment === `function`) {
        this._onComment(newData);
      }
    }
  }

  _onChangeEmoji() {
    const emojiItem = this._element.querySelector(`.film-details__emoji-item:checked + label`).textContent;
    this._element.querySelector(`.film-details__add-emoji-label`).innerHTML = emojiItem;
  }

  _onScoreClick(evt) {
    if (evt.target.tagName === `INPUT`) {
      const formData = new FormData(this._element.querySelector(`.film-details__inner`));
      const newData = this._processForm(formData);
      this.update(newData);

      if (typeof this._onScore === `function`) {
        this._onScore(newData);
      }
    }
  }

  _filmChangeWatched() {
    this._element.querySelector(`input[name=watched]`).checked = false;
    this._element.querySelector(`.film-details__watched-status`).classList.remove(`film-details__watched-status--active`);
  }

  _onCloseButtonClick() {
    const formData = new FormData(this._element.querySelector(`.film-details__inner`));
    const newData = this._processForm(formData);

    this.update(newData);

    if (typeof this._onClose === `function`) {
      this._onClose(newData);
    }
  }

  _onFilmDetailsControls() {
    const field = {
      favorite: `isFavorite`,
      watched: `isWatched`,
      toWatchlist: `inInWatchlist`};

    if (field) {
      this[field] = !this[field];

      const formData = new FormData(this._element.querySelector(`.film-details__inner`));
      const updatedFormData = this._processForm(formData);

      this.unbind();
      this.update(updatedFormData);
      this._partialUpdate();
      this.bind();

      this._onClose(updatedFormData);
    }
  }


  _countDuration(duration) {
    const hour = moment.duration(duration).hours();
    const min = moment.duration(duration).minutes();
    const time = (hour * 60) + min;
    return time;
  }

  _getGenreItems(items) {
    let newArray = [...items];
    return newArray;
  }

  _firstLatterChange(string) {
    string = string[0].toUpperCase() + string.substring(1);
    return string;
  }

  get template() {
    return `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="images/posters/${this._picture}.jpg" alt="${this._title}">

            <p class="film-details__age">${this._age}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${this._title}</h3>
                <p class="film-details__title-original">Original: ${this._titleOriginal}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${this._rating}</p>
                <p class="film-details__user-rating">Your rate ${this._userRating || `No rate`}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${this._director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${Array.from(this._writers).join(`, `)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${Array.from(this._actors).join(`, `)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${moment(this._releaseDate).format(`DD MMMM YYYY`)} (${this._country})</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${this._countDuration(this._duration)}m</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${this._country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genres</td>
                <td class="film-details__cell">
                ${this._getGenreItems(this._genre).map((genre) => `
                  <span class="film-details__genre">${genre}</span>`).join(``)}
                  <span class="film-details__genre ${this._getGenreItems(this._genre) ? `hidden` : ``}">None</span>
                </td>
              </tr>
            </table>

            <p class="film-details__film-description">
              ${this._firstLatterChange(this._description)}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${this._isInWatchlist ? `checked` : ``}>
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${this._isWatched ? `checked` : ``}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${this._isFavorite ? `checked` : ``}>
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
        </section>

        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this._comments.length}</span></h3>

          <ul class="film-details__comments-list">
             ${this._getCommentsTemplate()}
          </ul>

          <div class="film-details__new-comment">
            <div>
              <label for="add-emoji" class="film-details__add-emoji-label">😐</label>
              <input type="checkbox" class="film-details__add-emoji visually-hidden" id="add-emoji">

              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                <label class="film-details__emoji-label" for="emoji-sleeping">😴</label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-neutral-face" value="neutral-face" checked>
                <label class="film-details__emoji-label" for="emoji-neutral-face">😐</label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-grinning" value="grinning">
                <label class="film-details__emoji-label" for="emoji-grinning">😀</label>
              </div>
            </div>
            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="← Select reaction, add comment here" name="comment"></textarea>
            </label>
          </div>
        </section>

        <section class="film-details__user-rating-wrap">
          <div class="film-details__user-rating-controls">
            <span class="film-details__watched-status ${this._isWatched ? `film-details__watched-status--active` : ``}">Already watched</span>
            <button class="film-details__watched-reset" type="button">undo</button>
          </div>

          <div class="film-details__user-score">
            <div class="film-details__user-rating-poster">
              <img src="images/posters/${this._picture}.jpg" alt="${this._title}" class="film-details__user-rating-img">
            </div>

            <section class="film-details__user-rating-inner">
              <h3 class="film-details__user-rating-title">${this._title}</h3>

              <p class="film-details__user-rating-feelings">How you feel it?</p>

              <div class="film-details__user-rating-score">
                ${this._getScoreHTML()}
              </div>
            </section>
          </div>
        </section>
      </form>
    </section>`.trim();
  }

  bind() {
    this._element.querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, this._onCloseButtonClick);
    this._element.querySelector(`.film-details__user-rating-score`)
      .addEventListener(`click`, this._onScoreClick);
    this._element.querySelector(`.film-details__comment-input`)
      .addEventListener(`keydown`, this._onCommentAdd);
    this._element.querySelector(`.film-details__emoji-list`)
      .addEventListener(`change`, this._onChangeEmoji);
    this.element.querySelector(`.film-details__watched-reset`)
      .addEventListener(`click`, this._filmChangeWatched);
    this._element.querySelector(`.film-details__controls`)
      .addEventListener(`change`, this._onFilmDetailsControls);
  }

  unbind() {
    this._element.querySelector(`.film-details__close-btn`)
      .removeEventListener(`click`, this._onCloseButtonClick);
    this._element.querySelector(`.film-details__user-rating-score`)
      .removeEventListener(`click`, this._onScoreClick);
    this._element.querySelector(`.film-details__comment-input`)
      .removeEventListener(`keydown`, this._onCommentAdd);
    this._element.querySelector(`.film-details__emoji-list`)
      .removeEventListener(`change`, this._onChangeEmoji);
    this.element.querySelector(`.film-details__watched-reset`)
      .removeEventListener(`click`, this._filmChangeWatched);
    this._element.querySelector(`.film-details__controls`)
      .removeEventListener(`change`, this._onFilmDetailsControls);
  }

  update(data) {
    if (data.comments) {
      this._comments = data.comments;
    }
    this._isWatched = data.isWatched;
    this._isInWatchlist = data.isInWatchlist;
    this._isFavorite = data.isFavorite;
    this._userRating = data.userRating;
  }

  commentSuccess() {
    this._element.querySelector(`.film-details__comment-input`).disabled = false;
  }

  commentError() {
    this._element.querySelector(`.film-details__comment-input`).disabled = true;
  }

  scoreSuccess(inputs) {
    Array.from(inputs).forEach((it) => {
      it.disabled = false;
    });
  }

  scoreError(inputs) {
    Array.from(inputs).forEach((it) => {
      it.disabled = true;
    });
  }

  shake() {
    const ANIMATION_TIMEOUT = 600;
    this._element.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;
    this._element.style.border = `2px solid red`;

    setTimeout(() => {
      this._element.style.animation = ``;
      this._element.style.border = ``;
    }, ANIMATION_TIMEOUT);
  }

  static createMapper(target) {
    return {
      'comment': (value) => {
        target.comment.comment = value;
      },
      'comment-emoji': (value) => {
        target.comment.emotion = value;
      },
      'score': (value) => {
        target.userRating = value;
      },
      'watched': (value) => {
        if (value === `on`) {
          target.isWatched = true;
        }
        if (value === ``) {
          target.isWatched = false;
        }
      },
      'watchlist': (value) => {
        if (value === `on`) {
          target.isInWatchlist = true;
        }
        if (value === ``) {
          target.isInWatchlist = false;
        }
      },
      'favorite': (value) => {
        if (value === `on`) {
          target.isFavorite = true;
        }
        if (value === ``) {
          target.isFavorite = false;
        }
      },
    };
  }
}
