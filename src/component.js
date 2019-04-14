import {createElement} from './create-element.js';

const COMPONENT_ERROR = `Can't instantiate BaseComponent, only concrete one.`;
const TEMPLATE_ERROR = `You have to define template.`;

export default class Component {
  constructor() {
    if (new.target === Component) {
      throw new Error(COMPONENT_ERROR);
    }

    this._element = null;
  }

  get element() {
    return this._element;
  }

  get template() {
    throw new Error(TEMPLATE_ERROR);
  }

  render() {
    if (!this._element) {
      this._element = createElement(this.template);
      this.bind();
    }
    return this._element;
  }

  unrender() {
    this.unbind();
    this._element.remove();
    this._element = null;
  }

  update() {}

  bind() {}

  unbind() {}

}
