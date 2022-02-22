import { capitalize, uniqueId } from 'lodash';
import { Form, InputGroup } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import FormComponent from './FormComponent';

/**
 * FormControl
 * @param props .prefix is a ReactElement which will be prepended to the input control
 *              .suffix is a ReactElement which will be appended to the input control
 * @returns an augmented input control
 */
class FormControl extends FormComponent {
  constructor(props: any, key?: string) {
    super(props, uniqueId('form/control-'), key);
  }

  render = () => {
    const { t, i18n, tReady, hideLabel, label, suffix, prefix, ...props } =
      this.props;

    return (
      <Form.Group key={this.key} className="mb-3">
        <Form.Label visuallyHidden={hideLabel}>
          <small>{capitalize(t(label || this.props.name))}</small>
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
