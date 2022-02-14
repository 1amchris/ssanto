import { uniqueId } from 'lodash';
import FormComponent from './FormComponent';

/**
 * FormButton
 * @param props .children will be displayed as the body of the button
 * @returns an augmented button
 */
class FormButton extends FormComponent {
  constructor(props: any, key?: string) {
    super(props, uniqueId('form/button-'), key);
  }

  render = () => (
    <button
      {...this.props}
      id={this.id}
      key={this.key}
      className={`btn btn-sm ${this.props?.className}`}
    >
      {this.props?.children}
    </button>
  );
}

export default FormButton;
