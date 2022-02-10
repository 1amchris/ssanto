import { capitalize, uniqueId } from 'lodash';
import { withTranslation } from 'react-i18next';
import FormComponent from './FormComponent';

class FormControl extends FormComponent {
  constructor(props: any, key?: string) {
    super(props, uniqueId('form/control-'), key);
  }

  render = () => {
    const {
      t,
      i18n,
      tReady,
      label,
      className,
      suffix,
      prefix,
      plaintext = false,
      ...props
    } = this.props;

    const prefixElement = prefix && (
      <span className="input-group-text">{prefix}</span>
    );

    const suffixElement = suffix && (
      <span className="input-group-text">{suffix}</span>
    );

    const inputElement = (
      <input
        {...props}
        id={this.id}
        className={`${
          plaintext ? 'form-control-plaintext' : 'form-control'
        } form-control-sm`}
      />
    );

    return (
      <div key={this.key} className={className}>
        <label htmlFor={this.props.name} className="form-label small">
          {capitalize(t(label || this.props.name))}
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

export default withTranslation()(FormControl);
