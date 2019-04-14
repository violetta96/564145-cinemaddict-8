import Filter from './filter.js';
import Card from './card.js';
import Search from './search.js';
import Popup from './popup.js';
import Statistic from './stat.js';
import API from './api';
import Provider from './provider.js';
import Store from './store.js';

const END_POINT = `https://es8-demo-srv.appspot.com/moowle/`;
const FILMS_STORE_KEY = `films-store-key`;
const AUTHORIZATION = `Basic eo0w590ik29889a`;
const LOADING_ERROR = `Something went wrong while loading movies. Check your connection or try again later`;
const LOADING_MOVIES = `Loading movies...`;
const CARDS_AMOUNT = 5;

const FilterIdNames = {
  WATCHLIST: `watchlists`,
  HISTORY: `history`,
  FAVORITES: `favorites`,
};

const ProfileRatingNames = {
  NOVICE: `novice`,
  FAN: `fan`,
  BUFF: `movie buff`,
};

const ProfileRatingAmount = {
  NOVICE: `11`,
  FAN: `20`,
};

let filteredCards = [];
let cards = [];
let isNotFilteredCards = true;
let cardsCounter = 0;
const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
const store = new Store({key: FILMS_STORE_KEY, storage: localStorage});
const provider = new Provider({api, store});
const isExtra = true;
const main = document.querySelector(`.main`);
const mainNavigation = main.querySelector(`.main-navigation`);
const films = document.querySelector(`.films`);
const filmsListContainer = films.querySelector(`.films-list__container`);
const filmsListTitle = films.querySelector(`.films-list__title`);
const filmsListContainerCommented = films.querySelector(`.films-list__container--commented`);
const filmsListContainerRated = films.querySelector(`.films-list__container--rated`);
const filmsListShowMore = films.querySelector(`.films-list__show-more`);
const profileRating = document.querySelector(`.profile__rating`);
const footerStatistics = document.querySelector(`.footer__statistics__info`);
const headerSearch = document.querySelector(`.header__search`);
const statisticComponent = new Statistic(cards);
const searchComponent = new Search();
main.appendChild(statisticComponent.render());
statisticComponent.hideStatistic();

window.addEventListener(`offline`, () => {
  document.title = `${document.title}[OFFLINE]`;
});

window.addEventListener(`online`, () => {
  document.title = document.title.split(`[OFFLINE]`)[0];
  provider.syncFilms();
});

const showFilmsTitleError = (text) => {
  filmsListTitle.textContent = text;
  filmsListTitle.classList.remove(`visually-hidden`);
};

const hideFilmsTitleError = () => {
  filmsListTitle.textContent = LOADING_MOVIES;
  filmsListTitle.classList.add(`visually-hidden`);
};

const sortMostRatedCards = (extraCards) => {
  return [...extraCards].sort((a, b) => b.rating - a.rating);
};

const sortMostCommentedCards = (extraCards) => {
  return [...extraCards].sort((a, b) => b.comments.length - a.comments.length);
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

const profileRatingChange = (filmsToFilter) => {
  let userStatus = ``;
  const filteredCardsAmount = filmsToFilter.filter((it) => it.isWatched);
  const amount = filteredCardsAmount.length;
  if (amount < ProfileRatingAmount.NOVICE) {
    userStatus = ProfileRatingNames.NOVICE;
  } else if (amount < ProfileRatingAmount.FAN) {
    userStatus = ProfileRatingNames.FAN;
  } else {
    userStatus = ProfileRatingNames.BUFF;
  }
  profileRating.textContent = userStatus;
};

const filterCards = (cardsToFilter, filterName, searchValue) => {
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
      return cardsToFilter.filter(
          (card) => card.title.split(` `).find(
              (it) => it.toLowerCase() === searchValue
          )
      );
    default:
      return cardsToFilter;
  }
};

const updateFiltersCount = (cardsData) => {
  const mainNavigationItemCount = document.querySelectorAll(`.main-navigation__item-count`);
  Array.from(mainNavigationItemCount).forEach((filter, i) => {
    filter.textContent = filterCards(cardsData, Object.values(FilterIdNames)[i]).length;
  });
};

const renderFilters = (items, cardsData) => {
  mainNavigation.innerHTML = ``;
  for (const filterItem of items) {
    const filterComponent = new Filter(filterItem);
    filterComponent.onFilterClick = (filter) => {
      searchComponent.clearSearchInput();
      if (filter === `all` || filter === `history` || filter === `watchlists` || filter === `favorites`) {
        films.classList.remove(`visually-hidden`);
        statisticComponent.hideStatistic();
        filteredCards = filterCards(cardsData, filter);
        filmsListContainer.innerHTML = ``;
        isNotFilteredCards = false;
        cardsCounter = 0;
        renderCards(cardsData);
      }
      if (filter === `stats`) {
        films.classList.add(`visually-hidden`);
        statisticComponent.showStatistic();
        statisticComponent.updateStatisticFilters(cardsData);
      }
    };
    mainNavigation.appendChild(filterComponent.render());
  }
};

const renderMostCommentedCards = (cardsData) => {
  filmsListContainerCommented.innerHTML = ``;
  sortMostCommentedCards(cardsData).splice(0, 2).forEach((extraCard) => renderCard(extraCard, filmsListContainerCommented, cardsData, isExtra));
};

const renderCard = (card, container, cardsData, isextra) => {
  const cardComponent = new Card(card, isextra);
  const popupComponent = new Popup(card);
  container.appendChild(cardComponent.render());
  cardComponent.onCommentsClick = () => {
    popupComponent.render();
    document.body.appendChild(popupComponent.element);
  };
  popupComponent.onClose = () => {
    document.body.removeChild(popupComponent.element);
    popupComponent.unrender();
  };
  cardComponent.onWatchlistClick = () => {
    card.isInWatchlist = !card.isInWatchlist;
    provider.updateFilm({id: card.id, data: card.toRAW()})
          .then((newCard) => {
            popupComponent.update(newCard);
          });
    updateFiltersCount(cardsData);
  };
  cardComponent.onWatchedClick = () => {
    card.isWatched = !card.isWatched;
    if (card.isWatched) {
      card.dateWatched = Date.now();
    }
    provider.updateFilm({id: card.id, data: card.toRAW()})
          .then((newCard) => {
            popupComponent.update(newCard);
          });
    updateFiltersCount(cardsData);
    profileRatingChange(cardsData);
  };
  cardComponent.onFavoriteClick = () => {
    card.isFavorite = !card.isFavorite;
    provider.updateFilm({id: card.id, data: card.toRAW()})
          .then((newCard) => {
            popupComponent.update(newCard);
          });
    updateFiltersCount(cardsData);
  };
  popupComponent.onComment = (newComment) => {
    card.comments.push(newComment.comment);
    popupComponent.commentBlock();
    provider.updateFilm({id: card.id, data: card.toRAW()})
            .then((newCard) => {
              cardComponent.update(newCard);
              popupComponent.update(newCard);
              popupComponent.rerender();
              popupComponent.commentUnblock();
              popupComponent.showRatingControls();
              popupComponent.showDeleteBtn();
              renderMostCommentedCards(cardsData);
            })
            .catch(() => {
              popupComponent.shake();
              popupComponent.commentUnblock();
            });
  };
  popupComponent.onDelete = () => {
    card.comments.pop();
    provider.updateFilm({id: card.id, data: card.toRAW()})
            .then((newCard) => {
              cardComponent.update(newCard);
              popupComponent.update(newCard);
              popupComponent.rerender();
              popupComponent.showRatingControls();
              popupComponent.hideDeleteBtn();
              renderMostCommentedCards(cardsData);
            })
            .catch(() => {
              popupComponent.shake();
            });
  };
  popupComponent.onWatchlistClick = () => {
    card.isInWatchlist = !card.isInWatchlist;
    provider.updateFilm({id: card.id, data: card.toRAW()})
          .then((newCard) => {
            cardComponent.update(newCard);
            popupComponent.update(newCard);
            popupComponent.rerender();
            updateFiltersCount(cardsData);
          });
  };
  popupComponent.onWatchedClick = () => {
    card.isWatched = !card.isWatched;
    provider.updateFilm({id: card.id, data: card.toRAW()})
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
    provider.updateFilm({id: card.id, data: card.toRAW()})
          .then((newCard) => {
            cardComponent.update(newCard);
            popupComponent.update(newCard);
            popupComponent.rerender();
            updateFiltersCount(cardsData);
          });
  };
  popupComponent.onScore = (newScore) => {
    card.userRating = newScore;
    popupComponent.disableScoreInputs();
    provider.updateFilm({id: card.id, data: card.toRAW()})
            .then((newCard) => {
              popupComponent.unblockScoreInputs();
              cardComponent.update(newCard);
              popupComponent.update(newCard);
              popupComponent.rerender();
            })
            .catch(() => {
              popupComponent.unblockScoreInputs();
              popupComponent.shake();
            });
  };
};

const renderCards = (cardsData) => {
  let cardsToRender = [];

  cardsToRender = isNotFilteredCards ? cardsData : filteredCards;

  if (cardsToRender.length > CARDS_AMOUNT) {
    filmsListShowMore.classList.remove(`visually-hidden`);
  }

  for (const card of cardsToRender.slice(cardsCounter, CARDS_AMOUNT + cardsCounter)) {
    renderCard(card, filmsListContainer, cardsData);
  }

  cardsCounter += CARDS_AMOUNT;

  if (cardsCounter >= cardsToRender.length) {
    filmsListShowMore.classList.add(`visually-hidden`);
  }
};

const renderSearch = (cardsData) => {
  searchComponent.onSearchInput = (inputValue) => {
    filteredCards = filterCards(cardsData, `search`, inputValue);

    if (filteredCards.length > 0) {
      filmsListContainer.innerHTML = ``;
      cardsCounter = 0;
      isNotFilteredCards = false;
      renderCards(cardsData);
    }

    if (inputValue === ``) {
      filmsListContainer.innerHTML = ``;
      cardsCounter = 0;
      isNotFilteredCards = true;
      renderCards(cardsData);
    }
  };
  headerSearch.appendChild(searchComponent.render());
};

provider.getFilms()
  .then((initialCardsData) => {
    hideFilmsTitleError();
    renderCards(initialCardsData);
    sortMostRatedCards(initialCardsData).splice(0, 2).forEach((card) => renderCard(card, filmsListContainerRated, initialCardsData, isExtra));
    sortMostCommentedCards(initialCardsData).splice(0, 2).forEach((card) => renderCard(card, filmsListContainerCommented, initialCardsData, isExtra));
    renderFilters(filterItems, initialCardsData);
    renderSearch(initialCardsData);
    profileRatingChange(initialCardsData);
    footerStatistics.textContent = initialCardsData.length;
    updateFiltersCount(initialCardsData);
    filmsListShowMore.addEventListener(`click`, () => {
      renderCards(initialCardsData);
    });
    cards = initialCardsData;
  })
  .catch(() => {
    showFilmsTitleError(LOADING_ERROR);
  });
