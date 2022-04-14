import React from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';

abstract class FormComponent extends React.Component {
  props: any;
  id: string;
  key?: string;
  hideLabel: boolean;

  constructor(props: any, id: string, key?: string) {
    super(props);
    this.props = props;
    this.key = key;
    this.id = id;
    this.hideLabel = this.props.hideLabel || false;
  }

  protected getFilteredProps() {
    /* eslint-disable no-unused-vars */
    const {
      tooltip,
      tooltipDelay,
      tooltipHeader,
      tooltipPlacement,
      tooltipTrigger,
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
