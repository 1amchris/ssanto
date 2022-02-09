import { uniqueId } from 'lodash';
import FormSelectOptionModel from '../../../models/form-models/FormSelectOptionModel';
import FormComponent from './FormComponent';

class FormSelect extends FormComponent {
  constructor(props: any, key?: string) {
    super(props, uniqueId('form/select-'), key);
  }

  render = () => {
    const { name, defaultValue, options, className, onChange } = this.props;

    return (
      <div key={this.key} className={className}>
        <label htmlFor={this.id} className="form-label small">
          {name}
        </label>
        <select
          id={this.id}
          className="form-select form-select-sm"
          defaultValue={defaultValue}
          onChange={onChange}
        >
          {options.map(this.getOption)}
        </select>
      </div>
    );
  };

  getOption = ({ label, value }: FormSelectOptionModel) => {
    const optionId = `${this.id}/option-${value}`;
    return (
      <option id={optionId} key={optionId} value={value}>
        {label}
      </option>
    );
  };
}

export default FormSelect;
