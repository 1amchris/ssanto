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
    const {
      type,
      loading,
      children,
      variant,
      className,
      visuallyHidden,
      size = 'sm',
      ...props
    } = this.getFilteredProps();

    return (
      <Button
        {...props}
        className={`w-100 ${className} ${
          visuallyHidden ? 'visually-hidden' : ''
        }`}
        variant={variant || 'none'}
        size={size}
        id={this.id}
        key={this.key}
        type={type}
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