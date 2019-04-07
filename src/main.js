import moment from 'moment';
import Filter from './filter.js';
import Card from './card.js';
import Search from './search.js';
import Popup from './popup.js';
import {drawStat, filterDateWatched} from './stat';
import API from './api';

const END_POINT = `https://es8-demo-srv.appspot.com/moowle/`;
const AUTHORIZATION = `Basic eo0w590ik29889a`;
const LOADING_ERROR = `Something went wrong while loading movies. Check your connection or try again later`;
const EXTRA_CARDS_AMOUNT = 2;
const CARDS_AMOUNT = 5;

const filmsAPI = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
const isExtra = true;
const mainNavigation = document.querySelector(`.main-navigation`);
const films = document.querySelector(`.films`);
const filmsListContainer = films.querySelector(`.films-list__container`);
const filmsListTitle = films.querySelector(`.films-list__title`);
const filmsListContainerCommented = films.querySelector(`.films-list__container--commented`);
const filmsListContainerRated = films.querySelector(`.films-list__container--rated`);
const filmsListShowMore = films.querySelector(`.films-list__show-more`);
const statistic = document.querySelector(`.statistic`);
const statisticFiltersInput = statistic.querySelectorAll(`.statistic__filters-input`);
const profileRating = document.querySelector(`.profile__rating`);
const footerStatistics = document.querySelector(`.footer__statistics__info`);
const headerSearch = document.querySelector(`.header__search`);

let filteredCards = [];
let cards = [];
let isNotFilteredCards = true;
let cardsCounter = 0;

const showFilmsTitleError = (text) => {
  filmsListTitle.textContent = text;
  filmsListTitle.classList.remove(`visually-hidden`);
};

const hideFilmsTitleError = () => {
  filmsListTitle.textContent = ` Loading movies...`;
  filmsListTitle.classList.add(`visually-hidden`);
};

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

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const filterItems = [
  {
    name: `All movies`,
    id: `all`,
    isActiveStatus: true,
    showAmount: false,
  },
  {
    name: `Watchlist`,
    id: `watchlists`,
    showAmount: true,
  },
  {
    name: `History`,
    id: `history`,
    showAmount: true,
  },
  {
    name: `Favorites`,
    id: `favorites`,
    showAmount: true,
  },
  {
    name: `Stats`,
    id: `stats`,
    isAdditional: true,
    showAmount: false,
  },
];

const filterIdNames = {
  watchlist: `watchlists`,
  history: `history`,
  favorites: `favorites`,
};

const showStats = (cardsData) => {
  statistic.classList.remove(`visually-hidden`);
  films.classList.add(`visually-hidden`);
  const filteredWatchedMovies = cardsData.filter((it) => it.isWatched);
  drawStat(filteredWatchedMovies);
};

const onStatisticFilters = (evt) => {
  const filter = evt.target.id;
  const filteredDateWatchedMovies = cards.filter((it) => it.dateWatched);
  const filteredWatchedMoviesPress = filterDateWatched(filteredDateWatchedMovies, filter);
  drawStat(filteredWatchedMoviesPress);
};

const hideStats = () => {
  statistic.classList.add(`visually-hidden`);
  films.classList.remove(`visually-hidden`);
};

const profileRatingChange = (filmsToFilter) => {
  let userStatus = ``;
  const filteredCardsamount = filmsToFilter.filter((it) => it.isWatched);
  const amount = filteredCardsamount.length;
  if (amount < 11) {
    userStatus = `novice`;
  } else if (amount < 21) {
    userStatus = `fan`;
  } else {
    userStatus = `movie buff`;
  }
  profileRating.innerHTML = ``;
  profileRating.innerHTML = userStatus;
};

const showInitialFilmsCount = (filmsToShow) => {
  const filmsToShowCount = filmsToShow.length;
  footerStatistics.innerHTML = ``;
  footerStatistics.innerHTML = filmsToShowCount;
};

const filterCards = (cardsToFilter, filterName, value = false) => {
  switch (filterName) {
    case `all`:
      return cardsToFilter;
    case `watchlists`:
      return cardsToFilter.filter((it) => it.isInWatchlist);
    case `history`:
      return cardsToFilter.filter((it) => it.isWatched);
    case `favorites`:
      return cardsToFilter.filter((it) => it.isFavorite);
    case `search`:
      return cardsToFilter.filter((card) => card.title.split(` `).find((it) => it.toLowerCase() === value));
    default:
      return cardsToFilter;
  }
};

const updateFiltersCount = (cardsData) => {
  const mainNavigationItemCount = document.querySelectorAll(`.main-navigation__item-count`);
  Array.from(mainNavigationItemCount).forEach((filter, i) => {
    filter.textContent = filterCards(cardsData, Object.values(filterIdNames)[i]).length;
  });
};

const renderFilters = (items, cardsData) => {
  mainNavigation.innerHTML = ``;
  for (const filterItem of items) {
    const filterComponent = new Filter(filterItem);
    filterComponent.onFilterClick = (filter) => {
      if (filter === `all` || filter === `history` || filter === `watchlists` || filter === `favorites`) {
        hideStats();
        filteredCards = filterCards(cardsData, filter);
        filmsListContainer.innerHTML = ``;
        isNotFilteredCards = false;
        cardsCounter = 0;
        renderCards(filteredCards, cardsData, isNotFilteredCards);
      }
      if (filter === `stats`) {
        showStats(cardsData);
      }
    };
    mainNavigation.appendChild(filterComponent.render());
  }
};

const renderCard = (card, container, cardsData, isextra) => {
  const cardComponent = new Card(card, isextra);
  const popupComponent = new Popup(card);
  const body = document.querySelector(`body`);
  container.appendChild(cardComponent.render());

  cardComponent.onCommentsClick = () => {
    popupComponent.render();
    body.appendChild(popupComponent.element);
  };

  cardComponent.onWatchlistClick = () => {
    card.isInWatchlist = !card.isInWatchlist;
    filmsAPI.updateFilm({id: card.id, data: card.toRAW()})
          .then((newCard) => {
            popupComponent.update(newCard);
          });
    updateFiltersCount(cardsData);
  };

  cardComponent.onWatchedClick = () => {
    card.isWatched = !card.isWatched;
    if (card.isWatched) {
      card.dateWatched = moment().format(`DD-MM-YYYY`);
    }
    filmsAPI.updateFilm({id: card.id, data: card.toRAW()})
          .then((newCard) => {
            popupComponent.update(newCard);
          });
    updateFiltersCount(cardsData);
    profileRatingChange(cardsData);
  };

  cardComponent.onFavoriteClick = () => {
    card.isFavorite = !card.isFavorite;
    filmsAPI.updateFilm({id: card.id, data: card.toRAW()})
          .then((newCard) => {
            popupComponent.update(newCard);
          });
    updateFiltersCount(cardsData);
    if (!card.isFavorite) {
      cardComponent.unrender();
    }
  };

  popupComponent.onComment = (newComment) => {
    card.comments.push(newComment.comment);
    popupComponent.commentBlock();

    filmsAPI.updateFilm({id: card.id, data: card.toRAW()})
            .then((newCard) => {
              cardComponent.update(newCard);
              popupComponent.update(newCard);
              popupComponent.rerender();
              popupComponent.commentUnblock();
              popupComponent.showRating();
              popupComponent.showDeleteBtn();
            })
            .catch(() => {
              card.comments.pop();
              popupComponent.shake();
              popupComponent.commentUnblock();
            });
  };

  popupComponent.onDelete = () => {
    card.comments.pop();
    filmsAPI.updateFilm({id: card.id, data: card.toRAW()})
            .then((newCard) => {
              cardComponent.update(newCard);
              popupComponent.update(newCard);
              popupComponent.rerender();
              popupComponent.hideDeleteBtn();
            })
            .catch(() => {
              popupComponent.shake();
            });
  };

  popupComponent.onWatchlistClick = () => {
    card.isInWatchlist = !card.isInWatchlist;
    filmsAPI.updateFilm({id: card.id, data: card.toRAW()})
          .then((newCard) => {
            cardComponent.update(newCard);
            popupComponent.update(newCard);
            popupComponent.rerender();
            updateFiltersCount(cardsData);
          });
  };

  popupComponent.onWatchedClick = () => {
    card.isWatched = !card.isWatched;
    if (card.isWatched) {
      card.dateWatched = moment().format(`DD-MM-YYYY`);
    }
    filmsAPI.updateFilm({id: card.id, data: card.toRAW()})
          .then((newCard) => {
            cardComponent.update(newCard);
            popupComponent.update(newCard);
            popupComponent.rerender();
            updateFiltersCount(cardsData);
            profileRatingChange(cardsData);
          });
  };

  popupComponent.onFavoriteClick = () => {
    card.isFavorite = !card.isFavorite;
    filmsAPI.updateFilm({id: card.id, data: card.toRAW()})
          .then((newCard) => {
            cardComponent.update(newCard);
            popupComponent.update(newCard);
            popupComponent.rerender();
            updateFiltersCount(cardsData);
          });
  };

  popupComponent.onScore = (newScore) => {
    const scoreInputs = popupComponent.element.querySelectorAll(`.film-details__user-rating-input`);
    card.userRating = newScore;
    popupComponent.scoreBlock(scoreInputs);

    filmsAPI.updateFilm({id: card.id, data: card.toRAW()})
            .then((newCard) => {
              popupComponent.scoreUnblock(scoreInputs);
              cardComponent.update(newCard);
              popupComponent.update(newCard);
              popupComponent.rerender();
              popupComponent.showRating();
            })
            .catch(() => {
              popupComponent.scoreUnblock(scoreInputs);
              popupComponent.shake();
            });
  };

  popupComponent.onClose = () => {
    body.removeChild(popupComponent.element);
    popupComponent.unrender();
    filmsListContainerCommented.innerHTML = ``;
    sortMostCommentedCards(cardsData).forEach((cardEx) => renderCard(cardEx, filmsListContainerCommented, isExtra));
    updateFiltersCount(cardsData);
  };

  popupComponent.onEsc = () => {
    body.removeChild(popupComponent.element);
    popupComponent.unrender();
    filmsListContainerCommented.innerHTML = ``;
    sortMostCommentedCards(cardsData).forEach((cardEx) => renderCard(cardEx, filmsListContainerCommented, isExtra));
    renderFilters(filterItems, cardsData);
  };
};

const renderCards = (cardsDataFiltered, cardsData, isCardsData) => {
  cards = [];
  if (isCardsData) {
    cards = cardsData;
  } else {
    cards = cardsDataFiltered;
  }

  if (cards.length > CARDS_AMOUNT) {
    filmsListShowMore.classList.remove(`visually-hidden`);
  }

  for (const card of cards.slice(cardsCounter, CARDS_AMOUNT + cardsCounter)) {
    renderCard(card, filmsListContainer, cardsData);
  }

  cardsCounter += CARDS_AMOUNT;

  if (cardsCounter >= cards.length) {
    filmsListShowMore.classList.add(`visually-hidden`);
  }
};

const addDateWatched = (cardsToAddDate) => {
  const filteredWatchedMovies = cardsToAddDate.filter((card) => card.isWatched);
  return filteredWatchedMovies.forEach((it) => {
    it.dateWatched = `${getRandomInt(1, 30)}-${getRandomInt(1, 12)}-${getRandomInt(2015, 2019)}`;
  });
};

const renderSearch = (cardsData) => {
  const searchComponent = new Search();
  searchComponent.onSearchInput = (inputValue) => {
    filteredCards = filterCards(cardsData, `search`, inputValue);

    if (filteredCards.length > 0) {
      filmsListContainer.innerHTML = ``;
      cardsCounter = 0;
      renderCards(filteredCards, cardsData, false);
    }

    if (inputValue === ``) {
      filmsListContainer.innerHTML = ``;
      cardsCounter = 0;
      renderCards(filteredCards, cardsData, true);
      filmsListShowMore.classList.remove(`visually-hidden`);
    }
  };
  headerSearch.appendChild(searchComponent.render());
};

filmsAPI.getFilms()
  .then((initialCardsData) => {
    hideFilmsTitleError();
    renderCards(filteredCards, initialCardsData, isNotFilteredCards);
    sortMostRatedCards(initialCardsData).forEach((card) => renderCard(card, filmsListContainerRated, initialCardsData, isExtra));
    sortMostCommentedCards(initialCardsData).forEach((card) => renderCard(card, filmsListContainerCommented, initialCardsData, isExtra));
    renderFilters(filterItems, initialCardsData);
    addDateWatched(initialCardsData);
    renderSearch(initialCardsData);
    profileRatingChange(initialCardsData);
    showInitialFilmsCount(initialCardsData);
    updateFiltersCount(initialCardsData);
    filmsListShowMore.addEventListener(`click`, () => {
      renderCards(filteredCards, initialCardsData, isNotFilteredCards);
    });
    cards = initialCardsData;
    statisticFiltersInput.forEach((item) => item.addEventListener(`click`, onStatisticFilters));
  })
  .catch(() => {
    showFilmsTitleError(LOADING_ERROR);
  });
