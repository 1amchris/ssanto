import React from 'react';
import { uniqueId } from 'lodash';
import FormComponent from './FormComponent';

/**
 * Adds space between two controls in a form
 */
class FormSpacer extends FormComponent {
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
