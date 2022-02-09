import { uniqueId } from 'lodash';
import FormComponent from './FormComponent';

class FormControl extends FormComponent {
  constructor(props: any, key?: string) {
    super(props, uniqueId('form/control-'), key);
  }

  render = () => {
    const {
      name,
      placeholder,
      className,
      value,
      suffix,
      prefix,
      plaintext = false,
      type = 'text',
      onChange,
    } = this.props;

    const prefixElement = prefix && (
      <span className="input-group-text">{prefix}</span>
    );

    const suffixElement = suffix && (
      <span className="input-group-text">{suffix}</span>
    );

    const inputElement = (
      <input
        id={this.id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${
          plaintext ? 'form-control-plaintext' : 'form-control'
        } form-control-sm`}
      />
    );

    return (
      <div key={this.key} className={className}>
        <label htmlFor={this.id} className="form-label small">
          {name}
        </label>
        {((suffix || prefix) && (
          <div className="input-group input-group-sm">
            {prefixElement}
            {inputElement}
            {suffixElement}
          </div>
        )) ||
          inputElement}
      </div>
    );
  };
}

export default FormControl;
