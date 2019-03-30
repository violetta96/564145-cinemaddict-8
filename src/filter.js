import Component from './component.js';

export default class Filter extends Component {
  constructor(name, id, amount, isAdditional = false, isActiveStatus = false) {
    super();
    this._name = name;
    this._id = id;
    this._amount = amount;
    this._isActiveStatus = isActiveStatus;
    this._isAdditional = isAdditional;

    this._onFilterButtonClick = this._onFilterButtonClick.bind(this);
  }

  set onFilterClick(fn) {
    this._onFilter = fn;
  }

  _onFilterButtonClick(evt) {
    evt.preventDefault();
    if (typeof this._onFilter === `function`) {
      const target = evt.target.closest(`.main-navigation__item`);
      const filter = evt.target.id;
      const activeItem = target.parentElement.querySelector(`.main-navigation__item--active`);
      if (activeItem) {
        activeItem.classList.remove(`main-navigation__item--active`);
      }
      target.classList.add(`main-navigation__item--active`);
      this._onFilter(filter);
    }
  }

  _changeNameCase(name) {
    return name.toLowerCase();
  }

  get template() {
    return `<a
            href="#${this._changeNameCase(this._name)}"
            id="${this._id}"
            class="main-navigation__item ${this._isActiveStatus ? `main-navigation__item--active` : ``} ${this._isAdditional ? `main-navigation__item--additional` : ``}"
          >
             ${this._name}
             ${this._amount ? `<span class="main-navigation__item-count">${this._amount}</span>` : ` `}
           </a>`.trim();
  }

  bind() {
    this._element.addEventListener(`click`, this._onFilterButtonClick);
  }

  unbind() {
    this._element.removeEventListener(`click`, this._onFilterButtonClick);
  }
}
