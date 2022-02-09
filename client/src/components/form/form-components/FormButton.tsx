import { uniqueId } from 'lodash';
import FormComponent from './FormComponent';

class FormButton extends FormComponent {
  constructor(props: any, key?: string) {
    super(props, uniqueId('form/button-'), key);
  }

  render = () => (
    <button
      id={this.id}
      key={this.key}
      type={this.props?.type || 'button'}
      className={`btn btn-sm ${this.props?.className}`}
      onClick={this.props?.onClick}
      onDoubleClick={this.props?.onDoubleClick}
    >
      {this.props?.children}
    </button>
  );
}

export default FormButton;
