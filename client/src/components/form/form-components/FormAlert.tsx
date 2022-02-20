import { uniqueId } from 'lodash';
import FormComponent from './FormComponent';

/**
 * FormAlert
 * @param props .children will be displayed as the body of the alert
 * @returns an augmented alert
 */
class FormAlert extends FormComponent {
  constructor(props: any, key?: string) {
    super(props, uniqueId('form/alert-'), key);
  }

  render = () => {
    const { className, children, ...props } = this.props;
    return (
      <small>
        <div
          {...props}
          id={this.id}
          key={this.key}
          className={`alert alert-dismissible fade show ${
            className ? className : ''
          }`}
          style={{
            paddingTop: '0.75rem',
            paddingBottom: '0.75rem',
            marginBottom: 0,
          }}
          role="alert"
        >
          {children}
          <button
            type="button"
            className="btn-close"
            style={{ paddingTop: '1rem', paddingBottom: '1rem' }}
            data-dismiss="alert"
            aria-label="Close"
          ></button>
        </div>
      </small>
    );
  };
}

export default FormAlert;
