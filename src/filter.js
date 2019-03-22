import Component from './component.js';

export default class Filter extends Component {
  constructor(name, isAdditional = false, hasCards = true, isActiveStatus = false, count) {
    super();
    this._name = name;
    this._count = count;
    this._hasCards = hasCards;
    this._isActiveStatus = isActiveStatus;
    this._isAdditional = isAdditional;

    this._onFilter = null;
    this._onFilterClick = this._onFilterClick.bind(this);
  }

  set onFilter(fn) {
    this._onFilter = fn;
  }

  _onFilterClick(evt) {
    evt.preventDefault();
    const target = evt.target.closest(`.main-navigation__item`);
    const activeItem = target.parentElement.querySelector(`.main-navigation__item--active`);

    if (typeof this._onFilter === `function`) {
      this._onFilter(evt);
    }

    if (activeItem) {
      activeItem.classList.remove(`main-navigation__item--active`);
    }
    target.classList.add(`main-navigation__item--active`);
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
             <span class="main-navigation__item-count ${!this._hasCards ? `visually-hidden` : ``}">${this._count}</span>
           </a>`.trim();
  }

  bind() {
    this._element.addEventListener(`click`, this._onFilterClick);
  }

  unbind() {
    this._element.removeEventListener(`click`, this._onFilterClick);
  }
}
