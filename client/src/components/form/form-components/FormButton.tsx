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

  render = () => {
    const { className, loading, ...props } = this.props;
    return (
      <button
        {...props}
        id={this.id}
        key={this.key}
        className={`btn btn-sm ${className ? className : ''}`}
      >
        {loading ? (
          <div className="spinner-border spinner-border-sm mx-1" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : (
          this.props?.children
        )}
      </button>
    );
  };
}

export default FormButton;
