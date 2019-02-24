
import {generateFilter} from './make-filter.js';
import {generateCard, generateExtraCard} from './make-task.js';

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

const mainNavigation = document.querySelector(`.main-navigation`);
const filmsListContainer = document.querySelector(`.films-list__container`);
const filmsListContainerCommented = document.querySelector(`.films-list__container--commented`);
const filmsListContainerRated = document.querySelector(`.films-list__container--rated`);

// функция для отрисовки фильтров
const renderFilters = () => {
  let fragment = ``;
  filterItems
      .forEach((i) => {
        fragment += generateFilter(i);
      });
  mainNavigation.innerHTML = fragment;
};

// функция для отрисовки карточек
const renderCards = (cards) => {
  let fragment = ``;
  for (let i = 0; i < cards; i++) {
    fragment += generateCard();
  }
  filmsListContainer.innerHTML = fragment;
};

// функция для отрисовки дополнительных карточек
const renderExtraCards = (cards, container) => {
  let fragment = ``;
  for (let i = 0; i < cards; i++) {
    fragment += generateExtraCard();
  }
  container.innerHTML = fragment;
};

// функция для добовления оброботчика событий на фильтр
const onFilterClick = (evt) => {
  const filterName = evt.target.closest(`.main-navigation__item`);
  const id = filterName.getAttribute(`id`);
  if (filterName) {
    const cardsNumber = filterName.querySelector(`.main-navigation__item-count`).textContent;
    renderCards(cardsNumber, filmsListContainer);
    if (id === `#filter-all`) {
      renderCards(CARDS_AMOUNT, filmsListContainer);
    }
  }
};

renderFilters();
renderCards(CARDS_AMOUNT);
renderExtraCards(EXTRA_CARDS_AMOUNT, filmsListContainerCommented);
renderExtraCards(EXTRA_CARDS_AMOUNT, filmsListContainerRated);

document.body.addEventListener(`click`, onFilterClick);
