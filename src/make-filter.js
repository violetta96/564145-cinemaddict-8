const randomCardsRange = {
  MIN: 1,
  MAX: 15
};

// функция для генерирования случайного числа в диапазоне
const getRandomNumber = (max, min) => Math.floor(Math.random() * (max - min + 1)) + min;

// функция для создания филтра
export const generateFilter = ({name, id, activeStatus = false, cardRandomNumber = getRandomNumber(randomCardsRange.MIN, randomCardsRange.MAX)}) => {
  return `<a href="#${id}" id="#filter-${id}" class="main-navigation__item ${activeStatus ? `main-navigation__item--active` : ``}">
             ${name}
             <span class="main-navigation__item-count ${activeStatus ? `visually-hidden` : ``}">
               ${cardRandomNumber}
             </span>
           </a>`;
};
