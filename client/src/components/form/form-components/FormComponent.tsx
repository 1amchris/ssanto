import React from 'react';

/**
 * FormComponent
 * @param props .name will be used by the form to indentify the input and create a key: value object
 *              .label [optional] is the displayed content
 *              .hideLabel [optional] will hide the label (but keep it in DOM for accessiblity reasons)
 *              .className [optional] will apply classes to the elements
 *              ... any html attributes might work, including but not limited to:
 *                - disabled
 *                - readonly
 *                - accept
 *                - etc.
 * @param id will be applied to elements to uniquely identify them in the DOM
 * @param key will be applied if specified to help React identify elements
 */
abstract class FormComponent extends React.Component {
  props: any;
  id: string;
  key?: string;
  hideLabel: boolean;

  constructor(props: any, id: string, key?: string) {
    super(props);
    this.props = props;
    this.key = key;
    this.id = id;
    this.hideLabel = this.props.hideLabel || false;
  }
}

export default FormComponent;
