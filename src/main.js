// import {cardsData} from './data.js';
import Filter from './filter.js';
import Card from './card.js';
import Popup from './popup.js';
import {drawStat} from './stat';
import API from './api';
// import ModelFilm from './model-card';

const APIconfig = {
  endPoint: `https://es8-demo-srv.appspot.com/moowle/`,
  authorization: `Basic eo0w590ik29889a`
};
const filmsAPI = new API(APIconfig);
const isExtra = true;
const mainNavigation = document.querySelector(`.main-navigation`);
const filmsListContainer = document.querySelector(`.films-list__container`);
const filmsListTitle = document.querySelector(`.films-list__title`);
const filmsListContainerCommented = document.querySelector(`.films-list__container--commented`);
const filmsListContainerRated = document.querySelector(`.films-list__container--rated`);
const films = document.querySelector(`.films`);
const statistic = document.querySelector(`.statistic`);

let initialCards = [];

const showFilmsTitleError = (text) => {
  filmsListTitle.textContent = text;
  filmsListTitle.classList.remove(`visually-hidden`);
};

const hideFilmsTitleError = () => {
  filmsListTitle.textContent = ` Loading movies...`;
  filmsListTitle.classList.add(`visually-hidden`);
};

const EXTRA_CARDS_AMOUNT = 2;

// const mostRatedCards = sortMostRatedCards(initialCards);
// const mostCommentedCards = sortMostCommentedCards(initialCards);

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
    amount: 0,
  },
  {
    name: `Favorites`,
    id: `favorites`,
    amount: 0,
  },
  {
    name: `Stats`,
    isAdditional: true,
    id: `stats`,
  },
];

filmsAPI.getFilms()
    .then((inCards) => {
      hideFilmsTitleError();
      initialCards = inCards;
      initialCards.forEach((item) => renderCards(item, filmsListContainer, initialCards));
      sortMostRatedCards(initialCards).forEach((card) => renderCards(card, filmsListContainerRated, initialCards, isExtra));
      sortMostCommentedCards(initialCards).forEach((card) => renderCards(card, filmsListContainerCommented, initialCards, isExtra));
      renderFilters(filterItems, initialCards);
      return initialCards;
    })
    .catch(() => {
      showFilmsTitleError(`Something went wrong while loading movies. Check your connection or try again later`);
    });

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

const showInitialAmount = (ini, name) => {
  const filterAmount = filterItems.findIndex((it) => it.id === name);
  const filteredinitialCards = filterCards(ini, name);
  filterItems[filterAmount].amount = filteredinitialCards.length;
};

// функция для отрисовки фильтров
const renderFilters = (items, initialFilterCards) => {
  mainNavigation.innerHTML = ``;
  items.forEach((filterData) => {
    const filterComponent = new Filter(filterData.name, filterData.id, filterData.amount, filterData.isAdditional, filterData.isActive);
    mainNavigation.appendChild(filterComponent.render());
    showInitialAmount(initialFilterCards, `history`);
    showInitialAmount(initialFilterCards, `watchlists`);
    showInitialAmount(initialFilterCards, `favorites`);

    filterComponent.onFilterClick = (filter) => {
      if (filter === `all` || filter === `history` || filter === `watchlists` || filter === `favorites`) {
        hideStats();
        renderFilters(filterItems, initialCards);
        const filteredCards = filterCards(initialFilterCards, filter);
        filmsListContainer.innerHTML = ``;
        filteredCards.forEach((card) => renderCards(card, filmsListContainer));
      }
      if (filter === `stats`) {
        showStats();
      }
    };
  });
};

const updateCards = (updatedCards, newCards) => {
  for (const key of Object.keys(newCards)) {
    if (key in updatedCards) {
      updatedCards[key] = newCards[key];
    }
  }
  return updatedCards;
};

// функция для отрисовки карточек
const renderCards = (card, container, initialCard, isextra) => {
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
    filmsAPI.updateFilm({id: card.id, data: card.toRAW()})
        .then((newCard) => {
          popupComponent.update(newCard);
        });
    renderFilters(filterItems, initialCards);
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
    filmsAPI.updateFilm({id: card.id, data: card.toRAW()})
        .then((newCard) => {
          popupComponent.update(newCard);
        });
    renderFilters(filterItems, initialCards);
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
    filmsAPI.updateFilm({id: card.id, data: card.toRAW()})
        .then((newCard) => {
          popupComponent.update(newCard);
        });
    renderFilters(filterItems, initialCards);
  };

  popupComponent.onComment = (newComment) => {
    card.comments.push(newComment.comment);

    filmsAPI.updateFilm({id: card.id, data: card.toRAW()})
          .then((newCard) => {
            cardComponent.update(newCard);
            popupComponent.update(newCard);
            popupComponent.rerender();
            popupComponent.commentSuccess();
          })
          .catch(() => {
            card.comments.pop();
            popupComponent.shake();
            popupComponent.commentError();
          });
  };

  popupComponent.onScore = (newScore) => {
    const scoreInputs = popupComponent.element.querySelectorAll(`.film-details__user-rating-input`);
    card.userRating = newScore.userRating;

    filmsAPI.updateFilm({id: card.id, data: card.toRAW()})
          .then((newCard) => {
            popupComponent.scoreSuccess(scoreInputs);
            cardComponent.update(newCard);
            popupComponent.update(newCard);
            popupComponent.rerender();
          })
          .catch(() => {
            popupComponent.scoreError(scoreInputs);
            popupComponent.shake();
          });
  };

  popupComponent.onClose = (updatedTaskData) => {
    const updatedMovie = updateCards(card, updatedTaskData);

    filmsAPI.updateFilm({id: updatedMovie.id, data: updatedMovie.toRAW()})
          .then((newCard) => {
            cardComponent.update(newCard);
            body.removeChild(popupComponent.element);
            popupComponent.unrender();
            filmsListContainerCommented.innerHTML = ``;
            sortMostCommentedCards(initialCard).forEach((cardEx) => renderCards(cardEx, filmsListContainerCommented, isExtra));
          })
          .catch(() => {
            popupComponent.shake();
          });
  };
};

// initialCards.forEach((item) => renderCards(item, filmsListContainer));
// mostRatedCards.forEach((card) => renderCards(card, filmsListContainerRated, isExtra));
// mostCommentedCards.forEach((card) => renderCards(card, filmsListContainerCommented, isExtra));
