import { uniqueId } from 'lodash';
import { Alert } from 'react-bootstrap';
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
    const { children, ...props } = this.props;
    return (
      <small>
        <Alert
          {...props}
          id={this.id}
          key={this.key}
          style={{
            paddingTop: '0.55rem',
            paddingBottom: '0.55rem',
            marginBottom: 0,
          }}
        >
          {children}
        </Alert>
      </small>
    );
  };
}

export default FormAlert;
