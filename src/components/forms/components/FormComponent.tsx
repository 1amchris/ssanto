import React from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';

/**
 * @deprecated
 * FormComponent
 * @param {any} children Children of the form overlay
 * @return {JSX.Element} Html.
 */
abstract class FormComponent extends React.Component {
  props: any;
  id: string;
  key?: string;
  hideLabel: boolean;

  /**
   * @constructor
   * @param {any} props .name will be used by the form to indentify the input and create a key: value object
   *              .label [optional] is the displayed content
   *              .hideLabel [optional] will hide the label (but keep it in DOM for accessiblity reasons)
   *              .className [optional] will apply classes to the elements
   *              ... any html attributes might work, including but not limited to:
   *                - disabled
   *                - readonly
   *                - accept
   *                - etc.
   * @param {string} id will be applied to elements to uniquely identify them in the DOM
   * @param {string} [key] will be applied if specified to help React identify elements
   */
  constructor(props: any, id: string, key?: string) {
    super(props);
    this.props = props;
    this.key = key;
    this.id = id;
    this.hideLabel = this.props.hideLabel || false;
  }

  /**
   * Return the filtered properties from props attribute.
   * @return {any} Filtered properties
   */
  protected getFilteredProps() {
    const {
      // tooltip,
      // tooltipDelay,
      // tooltipHeader,
      // tooltipPlacement,
      // tooltipTrigger,
      ...rest
    } = this.props;
    return rest;
  }

  addOverlay = (children: any) => {
    const {
      tooltipTrigger = ['hover', 'focus'],
      tooltipPlacement = 'right',
      tooltipDelay = 650,
      tooltip,
    } = this.props;
    return (
      <OverlayTrigger
        trigger={tooltipTrigger}
        placement={tooltipPlacement}
        delay={tooltipDelay}
        overlay={
          tooltip ? (
            <Popover id={`tooltip/${this.id}`}>
              <Popover.Body>{tooltip}</Popover.Body>
            </Popover>
          ) : (
            <></>
          )
        }
      >
        {children}
      </OverlayTrigger>
    );
  };
}

export default FormComponent;
