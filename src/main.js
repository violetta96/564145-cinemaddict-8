import {cardsData} from './data.js';
import Filter from './filter.js';
import Card from './card.js';
import Popup from './popup.js';
import {drawStat} from './stat';


const CARDS_AMOUNT = 7;
const EXTRA_CARDS_AMOUNT = 2;

const initialCards = cardsData(CARDS_AMOUNT);

const sortMostRatedCards = (extraMostRatedCards) => {
  extraMostRatedCards.sort((a, b) => b.rating - a.rating);
  let sortedMostRatedCards = [];
  for (let i = 0; i < EXTRA_CARDS_AMOUNT; i++) {
    sortedMostRatedCards.push(extraMostRatedCards[i]);
  }
  return sortedMostRatedCards;
};

const sortMostCommentedCards = (extraMostCommentedCards) => {
  extraMostCommentedCards.sort((a, b) => b.comments.length - a.comments.length);
  let sortedMostCommentedCards = [];
  for (let i = 0; i < EXTRA_CARDS_AMOUNT; i++) {
    sortedMostCommentedCards.push(extraMostCommentedCards[i]);
  }
  return sortedMostCommentedCards;
};

const mostRatedCards = sortMostRatedCards(initialCards);
const mostCommentedCards = sortMostCommentedCards(initialCards);


const filterItems = [
  {
    name: `All movies`,
    id: `all`,
    isActiveStatus: true,
  },
  {
    name: `Watchlist`,
    id: `watchlists`,
    amount: 0,
  },
  {
    name: `History`,
    id: `history`,
    amount: initialCards.filter((item) => item.isWatched).length,
  },
  {
    name: `Favorites`,
    id: `favorites`,
    amount: initialCards.filter((item) => item.isFavorite).length
  },
  {
    name: `Stats`,
    isAdditional: true,
    id: `stats`,
  },
];

const isExtra = true;
const mainNavigation = document.querySelector(`.main-navigation`);
const filmsListContainer = document.querySelector(`.films-list__container`);
const filmsListContainerCommented = document.querySelector(`.films-list__container--commented`);
const filmsListContainerRated = document.querySelector(`.films-list__container--rated`);
const films = document.querySelector(`.films`);
const statistic = document.querySelector(`.statistic`);

const filterCards = (cards, filterName) => {
  switch (filterName) {
    case `all`:
      return cards;
    case `watchlists`:
      return cards.filter((it) => it.isInWatchlist);
    case `history`:
      return cards.filter((it) => it.isWatched);
    case `favorites`:
      return cards.filter((it) => it.isFavorite);
    default:
      return cards;
  }
};

const showStats = () => {
  drawStat(initialCards);
  statistic.classList.remove(`visually-hidden`);
  films.classList.add(`visually-hidden`);
};

const hideStats = () => {
  statistic.classList.add(`visually-hidden`);
  films.classList.remove(`visually-hidden`);
};

// функция для отрисовки фильтров
const renderFilters = (items) => {
  mainNavigation.innerHTML = ``;
  items.forEach((filterData) => {
    const filterComponent = new Filter(filterData.name, filterData.id, filterData.amount, filterData.isAdditional, filterData.isActive);
    mainNavigation.appendChild(filterComponent.render());

    filterComponent.onFilterClick = (filter) => {
      if (filter === `all` || filter === `history` || filter === `watchlists` || filter === `favorites`) {
        hideStats();
        const filteredCards = filterCards(initialCards, filter);
        filmsListContainer.innerHTML = ``;
        filteredCards.forEach((card) => renderCards(card, filmsListContainer));
      }
      if (filter === `stats`) {
        showStats();
      }
    };
  });
};

// функция для отрисовки карточек
const renderCards = (card, container, isextra) => {
  const cardComponent = new Card(card, isextra);
  const popupComponent = new Popup(card);
  const body = document.querySelector(`body`);
  container.appendChild(cardComponent.render());

  cardComponent.onCommentsClick = () => {
    if (!isextra) {
      popupComponent.render();
      body.appendChild(popupComponent.element);
    }
  };

  cardComponent.onWatchlistClick = () => {
    card.isInWatchlist = !card.isInWatchlist;
    const filterAmount = filterItems.findIndex((it) => it.id === `watchlists`);
    const filteredCards = filterCards(initialCards, `watchlists`);
    if (card.isInWatchlist) {
      filterItems[filterAmount].amount = filteredCards.length;
    } else {
      filterItems[filterAmount].amount--;
    }
    popupComponent.update(card);
    renderFilters(filterItems);
  };

  cardComponent.onMarkAsWatchedClick = () => {
    card.isWatched = !card.isWatched;
    const filterAmount = filterItems.findIndex((it) => it.id === `history`);
    const filteredCards = filterCards(initialCards, `history`);
    if (card.isWatched) {
      filterItems[filterAmount].amount = filteredCards.length;
    } else {
      filterItems[filterAmount].amount--;
    }
    popupComponent.update(card);
    renderFilters(filterItems);
  };

  cardComponent.onFavoriteClick = () => {
    card.isFavorite = !card.isFavorite;
    const filterAmount = filterItems.findIndex((it) => it.id === `favorites`);
    const filteredCards = filterCards(initialCards, `favorites`);
    if (card.isFavorite) {
      filterItems[filterAmount].amount = filteredCards.length;
    } else {
      filterItems[filterAmount].amount--;
    }
    popupComponent.update(card);
    renderFilters(filterItems);
  };

  popupComponent.onCloseClick = () => {
    body.removeChild(popupComponent.element);
    popupComponent.unrender();
  };

  popupComponent.onSubmit = (updatedTaskData) => {
    card._comments = updatedTaskData.comments;
    card._userRating = updatedTaskData.userRating;
    card._isWatched = updatedTaskData.isWatched;
    card._isInWatchlist = updatedTaskData.isInWatchlist;
    card._isFavorite = updatedTaskData.isFavorite;

    cardComponent.update(card);
    body.removeChild(popupComponent.element);
    popupComponent.unrender();
    filmsListContainerCommented.innerHTML = ``;
    sortMostCommentedCards(initialCards).forEach((cardEx) => renderCards(cardEx, filmsListContainerCommented, isExtra));
  };
};

renderFilters(filterItems);
initialCards.forEach((item) => renderCards(item, filmsListContainer));
mostRatedCards.forEach((card) => renderCards(card, filmsListContainerRated, isExtra));
mostCommentedCards.forEach((card) => renderCards(card, filmsListContainerCommented, isExtra));
