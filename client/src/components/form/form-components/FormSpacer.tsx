import { uniqueId } from 'lodash';
import FormComponent from './FormComponent';

class FormSpacer extends FormComponent {
  constructor(props: any, key?: string) {
    super(props, uniqueId('form/spacing-'), key);
  }

  render = () => (
    <div
      id={this.id}
      key={this.key}
      className={`p-1 ${this.props.className}`}
    />
  );
}

export default FormSpacer;
