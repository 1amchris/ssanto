import React from 'react';
import { capitalize, uniqueId } from 'lodash';
import { Form } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import FormSelectOptionModel from 'models/form/FormSelectOptionModel';
import FormComponent from './FormComponent';
import { HashLink } from 'react-router-hash-link';
import { FiInfo } from 'react-icons/fi';

/**
 * FormSelect
 * @return {JSX.Element} an augmented select
 */
class FormSelect extends FormComponent {
  /**
   * @constructor
   * @param {any} props .options: Are FormSelectOptions to be chosen from by the user
   * @param {string} [key] Key name.
   */
  constructor(props: any, key?: string) {
    super(props, uniqueId('form/select-'), key);
  }

  render = () => {
    const {
      t,
      // i18n,
      // tReady,
      options,
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
        className={`w-100 ${className} ${
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
        <Form.Select {...props} id={this.id} size="sm">
          {options?.map(this.getOption)}
        </Form.Select>
      </Form.Group>
    );
  };

  getOption = ({ label, value }: FormSelectOptionModel) => {
    const { t } = this.props;
    const optionId = `${this.id}/option-${value}`;
    return (
      <option id={optionId} key={optionId} value={value}>
        {capitalize(t(label))}
      </option>
    );
  };
}

export default withTranslation()(FormSelect);
