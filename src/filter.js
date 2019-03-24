import Component from './component.js';

export default class Filter extends Component {
  constructor(name, isAdditional = false, isActiveStatus = false) {
    super();
    this._name = name;
    this._isActiveStatus = isActiveStatus;
    this._isAdditional = isAdditional;

    this._onFilterButtonClick = this._onFilterButtonClick.bind(this);
    this._onStatsButtonClick = this._onStatsButtonClick.bind(this);
  }

  set onFilterClick(fn) {
    this._onFilter = fn;
  }

  set onStatsClick(fn) {
    this._onStats = fn;
  }

  _onStatsButtonClick(evt) {
    evt.preventDefault();
    if (typeof this._onStats === `function`) {
      this._onStats();
    }
  }

  _onFilterButtonClick(evt) {
    evt.preventDefault();
    if (typeof this._onFilter === `function`) {
      this._onFilter(evt);
    }
  }

  _changeNameCase(name) {
    return name.toLowerCase();
  }

  get template() {
    return `<a
            href="#${this._changeNameCase(this._name)}"
            id="${this._name}"
            class="main-navigation__item ${this._isActiveStatus ? `main-navigation__item--active` : ``} ${this._isAdditional ? `main-navigation__item--additional` : ``}"
          >
             ${this._name}
             <span class="main-navigation__item-count"></span>
           </a>`.trim();
  }

  bind() {
    if (!this._element.classList.contains(`.main-navigation__item--additional`)) {
      this._element.addEventListener(`click`, this._onFilterButtonClick);
    }
    this._element.addEventListener(`click`, this._onStatsButtonClick);
  }

  unbind() {
    if (!this._element.classList.contains(`.main-navigation__item--additional`)) {
      this._element.removeEventListener(`click`, this._onFilterButtonClick);
    }
    this._element.removeEventListener(`click`, this._onStatsButtonClick);
  }
}
