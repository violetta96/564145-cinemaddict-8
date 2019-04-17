import Component from './component.js';

export default class Filter extends Component {
  constructor(data) {
    super();
    this._name = data.name;
    this._id = data.id;
    this._showAmount = data.showAmount;
    this._isActiveStatus = data.isActiveStatus;
    this._isAdditional = data.isAdditional;

    this._onFilterButtonClick = this._onFilterButtonClick.bind(this);
  }

  set onFilterClick(fn) {
    this._onFilter = fn;
  }

  get template() {
    return `<a
            href="#${this._name}"
            id="${this._id}"
            class="main-navigation__item ${this._isActiveStatus ? `main-navigation__item--active` : ``} ${this._isAdditional ? `main-navigation__item--additional` : ``}"
          >
             ${this._name}
             ${this._showAmount ? `<span class="main-navigation__item-count"></span>` : ` `}
           </a>`.trim();
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

  bind() {
    this._element.addEventListener(`click`, this._onFilterButtonClick);
  }

  unbind() {
    this._element.removeEventListener(`click`, this._onFilterButtonClick);
  }
}
