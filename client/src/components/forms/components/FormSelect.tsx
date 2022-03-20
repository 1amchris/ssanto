import { capitalize, uniqueId } from 'lodash';
import { Form } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import FormSelectOptionModel from 'models/form-models/FormSelectOptionModel';
import FormComponent from './FormComponent';

/**
 * FormSelect
 * @param props .options: Are FormSelectOptions to be chosen from by the user
 * @returns an augmented select
 */
class FormSelect extends FormComponent {
  constructor(props: any, key?: string) {
    super(props, uniqueId('form/select-'), key);
  }

  render = () => {
    const {
      t,
      i18n,
      tReady,
      options,
      hideLabel,
      visuallyHidden,
      className,
      label,
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
          <small>{capitalize(t(label || this.props.name))}</small>
        </Form.Label>
        <this.Overlay>
          <Form.Select {...props} id={this.id} size="sm">
            {options?.map(this.getOption)}
          </Form.Select>
        </this.Overlay>
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
