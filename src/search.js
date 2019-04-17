import Component from './component.js';

export default class Search extends Component {
  constructor() {
    super();
    this._onInput = null;
    this._onSearchInputChange = this._onSearchInputChange.bind(this);
  }

  set onSearchInput(fn) {
    this._onInput = fn;
  }

  get template() {
    return `<input type="text" name="search" class="search__field" placeholder="Search">`.trim();
  }

  clearSearchInput() {
    this._element.value = ``;
  }

  _onSearchInputChange(evt) {
    const inputValue = evt.currentTarget.value.toLowerCase();
    if (typeof this._onInput === `function`) {
      this._onInput(inputValue);
    }
  }

  bind() {
    this._element.addEventListener(`input`, this._onSearchInputChange);
  }

  unbind() {
    this._element.removeEventListener(`input`, this._onSearchInputChange);
  }
}
