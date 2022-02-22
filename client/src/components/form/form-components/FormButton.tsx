import { tooltip } from 'leaflet';
import { uniqueId } from 'lodash';
import { Button, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
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
      loading,
      children,
      variant,
      className,
      visuallyHidden,
      tooltip,
      tooltipPlacement = 'right',
      tooltipDelay = 750,
      ...props
    } = this.props;
    return (
      <OverlayTrigger
        key={this.key}
        placement={tooltipPlacement}
        delay={tooltipDelay}
        overlay={
          tooltip ? (
            <Tooltip id={`tooltip/${this.id}`}>{tooltip}</Tooltip>
          ) : (
            <></>
          )
        }
      >
        <Button
          {...props}
          className={`w-100 ${className} ${
            visuallyHidden ? 'visually-hidden' : ''
          }`}
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
      </OverlayTrigger>
    );
  };
}

export default FormButton;
