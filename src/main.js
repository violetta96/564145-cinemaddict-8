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
    count: initialCards.length,
  },
  {
    name: `Watchlist`,
    count: initialCards.filter((item) => item.isInWatchlist).length,
  },
  {
    name: `History`,
    count: initialCards.filter((item) => item.isWatched).length,
  },
  {
    name: `Favorites`,
    count: initialCards.filter((item) => item.isFavorite).length,
  },
  {
    name: `Stats`,
    hasCards: false,
    isAdditional: true,
  },
];

const isExtra = true;
const mainNavigation = document.querySelector(`.main-navigation`);
const filmsListContainer = document.querySelector(`.films-list__container`);
const filmsListContainerCommented = document.querySelector(`.films-list__container--commented`);
const filmsListContainerRated = document.querySelector(`.films-list__container--rated`);

const filterCards = (cards, filterName) => {
  switch (filterName) {
    case `All`:
      return cards;

    case `Watchlist`:
      return cards.filter((it) => it.isInWatchlist);

    case `History`:
      return cards.filter((it) => it.isWatched);

    default:
      return cards;
  }
};

// функция для отрисовки фильтров
const renderFilters = () => {
  const fragment = document.createDocumentFragment();
  filterItems.forEach((filterData) => {
    const filterComponent = new Filter(filterData.name, filterData.isAdditional, filterData.hasCards, filterData.isActive, filterData.count);

    filterComponent.onFilter = (evt) => {
      const filterName = evt.target.textContent;
      const filteredCards = filterCards(initialCards, filterName);

      filmsListContainer.innerHTML = ``;
      renderCards(filteredCards, filmsListContainer);
    };
    fragment.appendChild(filterComponent.render());
  });
  mainNavigation.appendChild(fragment);
};

// функция для отрисовки карточек
const renderCards = (cards, container, isextra) => {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < cards.length; i++) {
    const cardData = cards[i];
    const cardComponent = new Card(cardData, isextra);
    const popupComponent = new Popup(cardData);
    const body = document.querySelector(`body`);

    cardComponent.onCommentsClick = () => {
      popupComponent.render();
      body.appendChild(popupComponent.element);
    };

    cardComponent.onAddToWatchListClick = (updatedState) => {
      cardData._isWatchlist = updatedState;
      popupComponent.update(cardData);
    };

    cardComponent.onMarkAsWatchedClick = (updatedState) => {
      cardData._isWatched = updatedState;
      popupComponent.update(cardData);
    };

    cardComponent.onFavoriteClick = (updatedState) => {
      cardData._isFavorite = updatedState;
      popupComponent.update(cardData);
    };

    popupComponent.onCloseClick = () => {
      body.removeChild(popupComponent.element);
      popupComponent.unrender();
    };

    popupComponent.onSubmit = (updatedTaskData) => {
      cardData._comments = updatedTaskData.comments;
      cardData._userRating = updatedTaskData.userRating;
      cardData._isWatched = updatedTaskData.isWatched;
      cardData._isWatchlist = updatedTaskData.isWatchlist;

      cardComponent.update(cardData);
    };

    fragment.appendChild(cardComponent.render());
  }
  container.appendChild(fragment);
};

renderFilters();
renderCards(initialCards, filmsListContainer);
renderCards(extraCards, filmsListContainerCommented, isExtra);
renderCards(extraCards, filmsListContainerRated, isExtra);
