import { uniqueId } from 'lodash';
import { Button, Spinner } from 'react-bootstrap';
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
    const { loading, children, variant, ...props } = this.props;
    return (
      <Button
        {...props}
        variant={variant || 'none'}
        size="sm"
        id={this.id}
        key={this.key}
      >
        {loading ? (
          <Spinner animation="border" size="sm" className="mx-1" />
        ) : (
          children
        )}
      </Button>
    );
  };
}

export default FormButton;
