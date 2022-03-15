import React from 'react';
import { withTranslation } from 'react-i18next';
import { capitalize, uniqueId } from 'lodash';
import { Link } from 'react-router-dom';
import MenuComponent from './MenuComponent';

class MenuLink extends MenuComponent {
  constructor(props: any, key?: string) {
    super(props, uniqueId('menu/action-'), key);
  }

  render = () => {
    const { t, i18n, tReady, className, label, targetUrl, ...rest } =
      this.props;

    return (
      <Link
        to={targetUrl}
        className={`small dropdown-item ${className}`}
        {...rest}
      >
        {capitalize(t(label || 'navigation item'))}
      </Link>
    );
  };
}

export default withTranslation()(MenuLink);
