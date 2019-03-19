import card from './data.js';
import {generateFilter} from './make-filter.js';
import Card from './card.js';
import Popup from './popup.js';


const CARDS_AMOUNT = 7;
const EXTRA_CARDS_AMOUNT = 2;

const filterItems = [
  {
    name: `All movies`,
    id: `all`,
    activeStatus: true
  },
  {
    name: `Watchlist`,
    id: `watchlist`,
  },
  {
    name: `History`,
    id: `history`,
  },
  {
    name: `Favorites`,
    id: `Favorites`,
  }
];

const isExtra = true;
const mainNavigation = document.querySelector(`.main-navigation`);
const filmsListContainer = document.querySelector(`.films-list__container`);
const filmsListContainerCommented = document.querySelector(`.films-list__container--commented`);
const filmsListContainerRated = document.querySelector(`.films-list__container--rated`);

// функция для отрисовки фильтров
const renderFilters = () => {
  let fragment = ``;
  filterItems.forEach((item) => {
    fragment += generateFilter(item);
  });
  mainNavigation.innerHTML = fragment;
};

// функция для отрисовки карточек
const renderCards = (amount, container, isextra) => {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < amount; i++) {
    const cardData = card();
    const cardComponent = new Card(cardData, isextra);
    const popupComponent = new Popup(cardData);
    const body = document.querySelector(`body`);

    cardComponent.onCommentsClick = () => {
      popupComponent.render();
      body.appendChild(popupComponent.element);
    };

    popupComponent.onCloseClick = () => {
      body.removeChild(popupComponent.element);
      popupComponent.unrender();
    };

    popupComponent.onSubmit = (updatedTaskData) => {
      cardData._comments = updatedTaskData.comments;
      cardData._userRating = updatedTaskData.userRating;
      cardData._isFavourite = updatedTaskData.isFavourite;
      cardData._isWatched = updatedTaskData.isWatched;
      cardData._isWatchlist = updatedTaskData.isWatchlist;

      cardComponent.update(cardData);
    };

    fragment.appendChild(cardComponent.render());
  }
  container.appendChild(fragment);
};

// функция для добовления оброботчика событий на фильтр
const onFilterClick = (evt) => {
  const filterName = evt.target.closest(`.main-navigation__item`);
  if (filterName) {
    filmsListContainer.innerHTML = ``;
    const id = filterName.id;
    const cardsNumber = filterName.querySelector(`.main-navigation__item-count`).textContent;
    renderCards(cardsNumber, filmsListContainer);
    if (id === `#filter-all`) {
      renderCards(CARDS_AMOUNT, filmsListContainer);
    }
  }
};

renderFilters();
renderCards(CARDS_AMOUNT, filmsListContainer);
renderCards(EXTRA_CARDS_AMOUNT, filmsListContainerCommented, isExtra);
renderCards(EXTRA_CARDS_AMOUNT, filmsListContainerRated, isExtra);

document.body.addEventListener(`click`, onFilterClick);
