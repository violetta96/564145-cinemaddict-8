import {cardsData} from './data.js';
import Filter from './filter.js';
import Card from './card.js';
import Popup from './popup.js';


const CARDS_AMOUNT = 7;
const EXTRA_CARDS_AMOUNT = 2;

const initialCards = cardsData(CARDS_AMOUNT);
const extraCards = cardsData(EXTRA_CARDS_AMOUNT);

const filterItems = [
  {
    name: `All movies`,
    isActiveStatus: true,
  },
  {
    name: `Watchlist`,
  },
  {
    name: `History`,
  },
  {
    name: `Favorites`,
  },
  {
    name: `Stats`,
    isAdditional: true,
  },
];

const isExtra = true;
const mainNavigation = document.querySelector(`.main-navigation`);
const filmsListContainer = document.querySelector(`.films-list__container`);
const filmsListContainerCommented = document.querySelector(`.films-list__container--commented`);
const filmsListContainerRated = document.querySelector(`.films-list__container--rated`);

const filterCards = (cards, filterName) => {
  let filmCards;
  switch (filterName) {
    case `All`:
      filmCards = cards;
      break;
    case `Watchlist`:
      filmCards = cards.filter((it) => it.isInWatchlist);
      break;
    case `History`:
      filmCards = cards.filter((it) => it.isWatched);
      break;
    case `Favorite`:
      filmCards = cards.filter((it) => it.isFavorite);
      break;
  }
  return filmCards;
};

// функция для отрисовки фильтров
filterItems.forEach((filterData) => {
  const filterComponent = new Filter(filterData.name, filterData.isAdditional, filterData.isActive);
  mainNavigation.appendChild(filterComponent.render());

  filterComponent.onFilterClick = (evt) => {
    evt.preventDefault();
    const filter = evt.target.id;
    const target = evt.target.closest(`.main-navigation__item`);
    const activeItem = target.parentElement.querySelector(`.main-navigation__item--active`);
    if (filter === `all` || filter === `history` || filter === `watchlist`) {
      filmsListContainer.forEach((card) => {
        card.remove();
      });
      renderCards(filterCards(initialCards, filter), filmsListContainer);
    }
    if (activeItem) {
      activeItem.classList.remove(`main-navigation__item--active`);
    }
    target.classList.add(`main-navigation__item--active`);
  };
});

// функция для отрисовки карточек
const renderCards = (card, container, isextra) => {
  const cardComponent = new Card(card, isextra);
  const popupComponent = new Popup(card);
  const body = document.querySelector(`body`);
  container.appendChild(cardComponent.render());

  cardComponent.onCommentsClick = () => {
    popupComponent.render();
    body.appendChild(popupComponent.element);
  };

  cardComponent.onAddToWatchListClick = (updatedState) => {
    card.isWatchlist = updatedState;
    popupComponent.update(card);
  };

  cardComponent.onMarkAsWatchedClick = (updatedState) => {
    card.isWatched = updatedState;
    popupComponent.update(card);
  };

  cardComponent.onFavoriteClick = (updatedState) => {
    card.isFavorite = updatedState;
    popupComponent.update(card);
  };

  popupComponent.onCloseClick = () => {
    body.removeChild(popupComponent.element);
    popupComponent.unrender();
  };

  popupComponent.onSubmit = (updatedTaskData) => {
    card._comments = updatedTaskData.comments;
    card._userRating = updatedTaskData.userRating;
    card._isWatched = updatedTaskData.isWatched;
    card._isWatchlist = updatedTaskData.isWatchlist;
    card._isFavorite = updatedTaskData.isFavorite;

    cardComponent.update(card);
    body.removeChild(popupComponent.element);
    popupComponent.unrender();
  };
};

initialCards.forEach((item) => renderCards(item, filmsListContainer));
extraCards.forEach((card) => renderCards(card, filmsListContainerCommented, isExtra));
extraCards.forEach((card) => renderCards(card, filmsListContainerRated, isExtra));
