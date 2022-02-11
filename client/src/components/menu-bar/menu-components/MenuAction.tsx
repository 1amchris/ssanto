import React from 'react';
import { withTranslation } from 'react-i18next';
import { capitalize, uniqueId } from 'lodash';
import MenuComponent from './MenuComponent';

class MenuAction extends MenuComponent {
  constructor(props: any, key?: string) {
    super(props, uniqueId('menu/action-'), key);
  }

  render = () => {
    const { t, i18n, tReady, className, label, ...rest } = this.props;

    return (
      <button
        className={`small dropdown-item ${className}`}
        key={this.key}
        {...rest}
      >
        {capitalize(t(label || 'action item'))}
      </button>
    );
  };
}

export default withTranslation()(MenuAction);
