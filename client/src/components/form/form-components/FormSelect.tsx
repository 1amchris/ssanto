import { capitalize, uniqueId } from 'lodash';
import { withTranslation } from 'react-i18next';
import FormSelectOptionModel from '../../../models/form-models/FormSelectOptionModel';
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
    const { t, i18n, tReady, options, className, hideLabel, label, ...props } =
      this.props;
    return (
      <div key={this.key} className={className}>
        {!this.hideLabel && (
          <label htmlFor={this.props.name} className={`form-label small`}>
            {capitalize(t(label || this.props.name))}
          </label>
        )}
        <select {...props} id={this.id} className="form-select form-select-sm">
          {options?.map(this.getOption)}
        </select>
      </div>
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
