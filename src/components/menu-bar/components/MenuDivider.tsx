import React from 'react';
import { uniqueId } from 'lodash';
import { Dropdown } from 'react-bootstrap';
import MenuComponent from './MenuComponent';

class MenuDivider extends MenuComponent {
  constructor(props: any, key?: string) {
    super(props, uniqueId('menu/divider-'), key);
  }

  render = () => {
    const { className, ...rest } = this.props;

    return (
      <Dropdown.Divider
        className={`small ${className ? className : ''}`}
        key={this.key}
        {...rest}
      />
    );
  };
}

export default MenuDivider;
