import Component from './component.js';

export default class Filter extends Component {
  constructor(name, isAdditional = false, isActiveStatus = false) {
    super();
    this._name = name;
    this._isActiveStatus = isActiveStatus;
    this._isAdditional = isAdditional;

    this._onFilter = null;
    this._onFilterButtonClick = this._onFilterButtonClick.bind(this);
  }

  set onFilterClick(fn) {
    this._onFilter = fn;
  }

  _onFilterButtonClick(evt) {
    evt.preventDefault();
    if (this._element.querySelector(`.main-navigation__item`)) {
      const target = evt.target.closest(`.main-navigation__item`);
      const activeItem = target.parentElement.querySelector(`.main-navigation__item--active`);
      const filterName = evt.target.textContent;

      if (typeof this._onFilter === `function`) {
        this._onFilter(filterName);
      }

      if (activeItem) {
        activeItem.classList.remove(`main-navigation__item--active`);
      }
      target.classList.add(`main-navigation__item--active`);
    }
  }

  _changeNameCase(name) {
    return name.toLowerCase();
  }

  get template() {
    return `<a
            href="#${this._changeNameCase(this._name)}"
            class="main-navigation__item ${this._isActiveStatus ? `main-navigation__item--active` : ``} ${this._isAdditional ? `main-navigation__item--additional` : ``}"
          >
             ${this._name}
             <span class="main-navigation__item-count"></span>
           </a>`.trim();
  }

  bind() {
    this._element.addEventListener(`click`, this._onFilterButtonClick);
  }

  unbind() {
    this._element.removeEventListener(`click`, this._onFilterButtonClick);
  }
}
