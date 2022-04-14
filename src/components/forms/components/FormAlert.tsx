import React from 'react';
import { uniqueId } from 'lodash';
import { Alert } from 'react-bootstrap';
import FormComponent from './FormComponent';

class FormAlert extends FormComponent {
  constructor(props: any, key?: string) {
    super(props, uniqueId('form/alert-'), key);
  }

  render = () => {
    const { children, visuallyHidden, className, ...props } = this.props;
    return (
      <small className={`w-100 ${visuallyHidden ? 'visually-hidden' : ''}`}>
        <Alert
          {...props}
          id={this.id}
          key={this.key}
          className={className}
          style={{
            paddingTop: '0.55rem',
            paddingBottom: '0.55rem',
            marginBottom: 0,
          }}
        >
          {children}
        </Alert>
      </small>
    );
  };
}

export default FormAlert;
