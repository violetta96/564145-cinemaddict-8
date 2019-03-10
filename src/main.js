import card from './data.js';
import {generateFilter} from './make-filter.js';
import Card from './card.js';
import Popup from './popup.js';
// import {generateCard} from './make-card.js';

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
const renderCards = (cards, container, isextra) => {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < cards; i++) {
    const cardComponent = new Card(card(), isextra);
    const popupComponent = new Popup(card());
    const body = document.querySelector(`body`);

    cardComponent.onComments = () => {
      popupComponent.render();
      body.appendChild(popupComponent.element);
    };

    popupComponent.onClose = () => {
      body.removeChild(popupComponent.element);
      popupComponent.unrender();
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
