import { capitalize, uniqueId } from 'lodash';
import { Form, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import FormComponent from './FormComponent';

/**
 * FormControl
 * @param props .prefix is a ReactElement which will be prepended to the input control
 *              .suffix is a ReactElement which will be appended to the input control
 * @returns an augmented input control
 */
class FormControl extends FormComponent {
  constructor(props: any, key?: string) {
    super(props, uniqueId('form/control-'), key);
  }

  render = () => {
    const {
      t,
      i18n,
      tReady,
      hideLabel,
      visuallyHidden,
      className,
      label,
      suffix,
      prefix,
      tooltipPlacement = 'right',
      tooltipDelay = 750,
      tooltip,
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
        <Form.Group
          key={this.key}
          className={`w-100 ${className} ${
            visuallyHidden ? 'visually-hidden' : ''
          }`}
        >
          <Form.Label visuallyHidden={hideLabel}>
            <small>{capitalize(t(label || this.props.name))}</small>
          </Form.Label>
          <InputGroup size="sm">
            {prefix && <span className="input-group-text">{prefix}</span>}
            <Form.Control {...props} id={this.id} size="sm" />
            {suffix && <span className="input-group-text">{suffix}</span>}
          </InputGroup>
        </Form.Group>
      </OverlayTrigger>
    );
  };
}

export default withTranslation()(FormControl);
