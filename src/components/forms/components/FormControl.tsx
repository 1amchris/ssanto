import React from 'react';
import { capitalize, uniqueId } from 'lodash';
import { Form, InputGroup } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import { FiInfo } from 'react-icons/fi';
import { HashLink } from 'react-router-hash-link';
import FormComponent from './FormComponent';

/**
 * FormControl
 * @return {JSX.Element} an augmented input control
 */
class FormControl extends FormComponent {
  /**
   * @constructor
   * @param {any} props .prefix is a ReactElement which will be prepended to the input control
   *              .suffix is a ReactElement which will be appended to the input control
   * @param {string} [key] Key name
   */  
  constructor(props: any, key?: string) {
    super(props, uniqueId('form/control-'), key);
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
      suffix,
      prefix,
      guideHash = '',
      ...props
    } = this.getFilteredProps();

    return this.addOverlay(
      <Form.Group
        key={this.key}
        className={`w-100 ${className ? className : ''} ${
          visuallyHidden ? 'visually-hidden' : ''
        }`}
      >
        <Form.Label visuallyHidden={hideLabel}>
          <small>
            {capitalize(t(label || this.props.name))}{' '}
            {guideHash?.length > 0 && (
              <HashLink to={`/guide#${guideHash}`}>
                <FiInfo />
              </HashLink>
            )}
          </small>
        </Form.Label>
        <InputGroup size="sm">
          {prefix && <span className="input-group-text">{prefix}</span>}
          <Form.Control {...props} id={this.id} size="sm" />
          {suffix && <span className="input-group-text">{suffix}</span>}
        </InputGroup>
      </Form.Group>
    );
  };
}

export default withTranslation()(FormControl);
