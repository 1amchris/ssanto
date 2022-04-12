import { capitalize, uniqueId } from 'lodash';
import { Form, InputGroup } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import { FiInfo } from 'react-icons/fi';
import { HashLink } from 'react-router-hash-link';
import FormComponent from './FormComponent';

/**
 * FormCheckbox
 * @param props .prefix is a ReactElement which will be prepended to the input control
 *              .suffix is a ReactElement which will be appended to the input control
 * @returns an augmented input control
 */
class FormCheckbox extends FormComponent {
  constructor(props: any, key?: string) {
    super(props, uniqueId('form/checkbox-'), key);
  }

  render = () => {
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
      guide_hash = '',
      ...props
    } = this.getFilteredProps();
    console.log('FormCheckBox', { ...props });
    return (
      <Form.Group
        key={this.key}
        className={`w-100 ${className ? className : ''} ${
          visuallyHidden ? 'visually-hidden' : ''
        }`}
      >
        <Form.Label visuallyHidden={hideLabel}>
          <small>
            {capitalize(t(label || this.props.name))}{' '}
            {guide_hash?.length > 0 && (
              <HashLink to={`/guide#${guide_hash}`}>
                <FiInfo />
              </HashLink>
            )}
          </small>
        </Form.Label>
        <input {...props} type={'checkbox'} id={this.id} />
      </Form.Group>
    );
  };
}

export default withTranslation()(FormCheckbox);