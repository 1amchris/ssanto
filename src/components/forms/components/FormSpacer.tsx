import React from 'react';
import { uniqueId } from 'lodash';
import FormComponent from './FormComponent';

/**
 * @deprecated
 * FormSpacer
 * Adds space between two controls in a form
 * @return {JSX.Element} space between two controls in a form
 */
class FormSpacer extends FormComponent {
  /**
   * @constructor
   * @param {any} props Props. TODO
   * @param {string} [key] Key name.
   */
  constructor(props: any, key?: string) {
    super(props, uniqueId('form/spacing-'), key);
  }

  /**
   * @override
   */
  render = () => (
    <div
      {...this.props}
      id={this.id}
      key={this.key}
      className={`p-1 ${this.props.className}`}
    />
  );
}

export default FormSpacer;
