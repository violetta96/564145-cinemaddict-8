import moment from 'moment';
import Component from './component.js';

const KEYCODE_ENTER = 13;
const KEYCODE_ESC = 27;
const ANIMATION_TIMEOUT = 1000;
const DELETED_COMMENT = `Comment deleted`;
const ADDED_COMMENT = `Comment added`;

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
    this._userRating = data.userRating;
    this._comments = data.comments;
    this._dateWatched = data.dateWatched;

    this._onClose = null;
    this._onComment = null;
    this._onScore = null;
    this._onFilmDetails = null;
    this._onWatchlist = null;
    this._onFavorite = null;
    this._onWatched = null;
    this._onDelete = null;
    this._onCloseButtonClick = this._onCloseButtonClick.bind(this);
    this._onChangeEmoji = this._onChangeEmoji.bind(this);
    this._onScoreClick = this._onScoreClick.bind(this);
    this._onCommentAdd = this._onCommentAdd.bind(this);
    this._onWatchlistButtonClick = this._onWatchlistButtonClick.bind(this);
    this._onWatchedButtonClick = this._onWatchedButtonClick.bind(this);
    this._onFavoriteButtonClick = this._onFavoriteButtonClick.bind(this);
    this._onEscPress = this._onEscPress.bind(this);
    this._onCommentDelete = this._onCommentDelete.bind(this);
  }

  set onClose(fn) {
    this._onClose = fn;
  }

  set onFilmDetails(fn) {
    this._onFilmDetails = fn;
  }

  set onScore(fn) {
    this._onScore = fn;
  }

  set onDelete(fn) {
    this._onDelete = fn;
  }

  set onComment(fn) {
    this._onComment = fn;
  }

  set onWatchlistClick(fn) {
    this._onWatchlist = fn;
  }

  set onFavoriteClick(fn) {
    this._onFavorite = fn;
  }

  set onWatchedClick(fn) {
    this._onWatched = fn;
  }

  get template() {
    return `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${this._picture}" alt="${this._title}">

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
                <p class="film-details__user-rating ${this._userRating ? `` : `visually-hidden`}">Your rate ${this._userRating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row ${!this._director.length ? `visually-hidden` : ``}">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${this._director}</td>
              </tr>
              <tr class="film-details__row ${!this._writers.length ? `visually-hidden` : ``}">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${this._writers.join(`, `)}</td>
              </tr>
              <tr class="film-details__row ${!this._actors.length ? `visually-hidden` : ``}">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${this._actors.join(`, `)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${moment(this._releaseDate).format(`DD MMMM YYYY`)} (${this._country})</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${this._duration}m</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${this._country}</td>
              </tr>
              <tr class="film-details__row ${![...this._genre].length ? `visually-hidden` : ``}">
                <td class="film-details__term">Genres</td>
                <td class="film-details__cell">
                ${[...this._genre].map((genre) => `
                  <span class="film-details__genre">${genre}</span>`).join(``)}
                </td>
              </tr>
            </table>

            <p class="film-details__film-description ${this._description.length > 2 ? `` : `visually-hidden`}">${this._description}</p>
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
          <div class="film-details__user-rating-controls visually-hidden">
            <span class="film-details__watched-status film-details__watched-status--active"></span>
            <button class="film-details__watched-reset" type="button">undo</button>
          </div>

          <div class="film-details__user-score">
            <div class="film-details__user-rating-poster">
              <img src="${this._picture}" alt="${this._title}" class="film-details__user-rating-img">
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

  _changeEmoji(emojiName) {
    switch (emojiName) {
      case `sleeping`:
        return `😴`;
      case `grinning`:
        return `😀`;
      case `neutral-face`:
        return `😐`;
      default:
        return ``;
    }
  }

  _getScoreHTML() {
    let fragment = ``;
    for (let i = 1; i <= 9; i++) {
      fragment += `
      <input type="radio"
             name="score"
             class="film-details__user-rating-input visually-hidden"
             value="${i}"
             id="rating-${i}" ${i === +this._userRating ? `checked` : ``}>
      <label class="film-details__user-rating-label" for="rating-${i}">${i}</label>`;
    }
    return fragment;
  }

  _getCommentsTemplate() {
    return this._comments.map((comment) => `<li class="film-details__comment">
         <span class="film-details__comment-emoji">${this._changeEmoji(comment.emotion)}</span>
         <div>
           <p class="film-details__comment-text">${comment.comment}</p>
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

  _processForm(formData) {
    const entry = {
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
      const newFormData = this._processForm(formData);

      if (typeof this._onComment === `function`) {
        this._onComment(newFormData);
      }
    }
  }

  _onCommentDelete(evt) {
    evt.preventDefault();
    if (typeof this._onDelete === `function`) {
      this._onDelete();
    }
  }

  _onEscPress(evt) {
    if (evt.keyCode === KEYCODE_ESC) {
      if (typeof this._onClose === `function`) {
        this._onClose();
      }
    }
  }

  _onChangeEmoji() {
    const emojiItem = this._element.querySelector(`.film-details__emoji-item:checked + label`).textContent;
    this._element.querySelector(`.film-details__add-emoji-label`).innerHTML = emojiItem;
  }

  _onScoreClick(evt) {
    if (evt.target.tagName === `INPUT`) {
      const newFormData = evt.target.value;
      this.update(newFormData);

      if (typeof this._onScore === `function`) {
        this._onScore(newFormData);
      }
    }
  }

  _onCloseButtonClick() {
    if (typeof this._onClose === `function`) {
      this._onClose();
    }
  }

  _onWatchlistButtonClick() {
    if (typeof this._onWatchlist === `function`) {
      this._onWatchlist();
    }
  }

  _onFavoriteButtonClick() {
    if (typeof this._onFavorite === `function`) {
      this._onFavorite();
    }
  }

  _onWatchedButtonClick() {
    if (typeof this._onWatched === `function`) {
      this._onWatched();
    }
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

  rerender() {
    this.unbind();
    this._partialUpdate();
    this.bind();
  }

  showDeleteBtn() {
    this._element.querySelector(`.film-details__watched-reset`).classList.remove(`visually-hidden`);
    this._element.querySelector(`.film-details__watched-status`).textContent = ADDED_COMMENT;
  }

  hideDeleteBtn() {
    this._element.querySelector(`.film-details__watched-status`).textContent = DELETED_COMMENT;
    this._element.querySelector(`.film-details__watched-reset`).classList.add(`visually-hidden`);
  }

  commentUnblock() {
    this._element.querySelector(`.film-details__comment-input`).disabled = false;
  }

  commentBlock() {
    this._element.querySelector(`.film-details__comment-input`).disabled = true;
  }

  showRatingControls() {
    this._element.querySelector(`.film-details__user-rating-controls`).classList.remove(`visually-hidden`);
  }

  unblockScoreInputs() {
    const userRatingInputs = this._element.querySelectorAll(`.film-details__user-rating-input`);
    Array.from(userRatingInputs).forEach((it) => {
      it.disabled = false;
    });
  }

  disableScoreInputs() {
    const userRatingInputs = this._element.querySelectorAll(`.film-details__user-rating-input`);
    Array.from(userRatingInputs).forEach((it) => {
      it.disabled = true;
    });
  }

  shake() {
    this._element.classList.add(`shake`);
    this._element.style.border = `2px solid red`;

    setTimeout(() => {
      this._element.classList.remove(`shake`);
      this._element.style.border = ``;
    }, ANIMATION_TIMEOUT);
  }

  bind() {
    this._element.querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, this._onCloseButtonClick);
    document.addEventListener(`keydown`, this._onEscPress);
    this._element.querySelector(`.film-details__user-rating-score`)
      .addEventListener(`click`, this._onScoreClick);
    this._element.querySelector(`.film-details__comment-input`)
      .addEventListener(`keydown`, this._onCommentAdd);
    this._element.querySelector(`.film-details__emoji-list`)
      .addEventListener(`change`, this._onChangeEmoji);
    this._element.querySelector(`#watchlist`)
      .addEventListener(`change`, this._onWatchlistButtonClick);
    this._element.querySelector(`#watched`)
      .addEventListener(`change`, this._onWatchedButtonClick);
    this._element.querySelector(`#favorite`)
      .addEventListener(`change`, this._onFavoriteButtonClick);
    this._element.querySelector(`.film-details__watched-reset`)
      .addEventListener(`click`, this._onCommentDelete);
  }

  unbind() {
    this._element.querySelector(`.film-details__close-btn`)
      .removeEventListener(`click`, this._onCloseButtonClick);
    document.removeEventListener(`keydown`, this._onEscPress);
    this._element.querySelector(`.film-details__user-rating-score`)
      .removeEventListener(`click`, this._onScoreClick);
    this._element.querySelector(`.film-details__comment-input`)
      .removeEventListener(`keydown`, this._onCommentAdd);
    this._element.querySelector(`.film-details__emoji-list`)
      .removeEventListener(`change`, this._onChangeEmoji);
    this._element.querySelector(`#watchlist`)
      .removeEventListener(`change`, this._onWatchListChange);
    this._element.querySelector(`#watched`)
      .removeEventListener(`change`, this._onWatchedChange);
    this._element.querySelector(`#favorite`)
      .removeEventListener(`change`, this._onFavoriteClick);
    this._element.querySelector(`.film-details__watched-reset`)
      .removeEventListener(`click`, this._onCommentDelete);
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
