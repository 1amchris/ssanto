import React from 'react';
import { capitalize, uniqueId } from 'lodash';
import { Form } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import { FiInfo } from 'react-icons/fi';
import { HashLink } from 'react-router-hash-link';
import FormComponent from './FormComponent';

class FormCheckbox extends FormComponent {
  constructor(props: any, key?: string) {
    super(props, uniqueId('form/checkbox-'), key);
  }

  render = () => {
    /* eslint-disable no-unused-vars */
    const {
      t,
      i18n,
      tReady,
      hideLabel,
      visuallyHidden,
      className,
      label,
      guideHash = '',
      ...props
    } = this.getFilteredProps();
    return (
      <Form.Group
        key={this.key}
        className={`w-100 pt-1 ${className ? className : ''} ${
          visuallyHidden ? 'visually-hidden' : ''
        }`}
      >
        <Form.Check
          type="checkbox"
          id={this.id}
          label={
            <small>
              {capitalize(t(label || this.props.name))}{' '}
              {guideHash?.length > 0 && (
                <HashLink to={`/guide#${guideHash}`}>
                  <FiInfo />
                </HashLink>
              )}{' '}
            </small>
          }
          {...props}
        />
      </Form.Group>
    );
  };
}

export default withTranslation()(FormCheckbox);
