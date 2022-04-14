import React from 'react';
import { withTranslation } from 'react-i18next';
import { capitalize, uniqueId } from 'lodash';
import MenuComponent from './MenuComponent';
import { Dropdown } from 'react-bootstrap';

class MenuAction extends MenuComponent {
  constructor(props: any, key?: string) {
    super(props, uniqueId('menu/action-'), key);
  }

  render = () => {
    /* eslint-disable no-unused-vars */
    const { t, i18n, tReady, className, label, ...rest } = this.props;

    return (
      <Dropdown.Item
        as="button"
        className={`small dropdown-item ${className ? className : ''}`}
        key={this.key}
        {...rest}
      >
        {capitalize(t(label || 'action item'))}
      </Dropdown.Item>
    );
  };
}

export default withTranslation()(MenuAction);
