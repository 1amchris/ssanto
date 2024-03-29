import React from 'react';
import { capitalize } from 'lodash';
import { withTranslation } from 'react-i18next';
import { DropdownButton } from 'react-bootstrap';

/**
 * Menu component.
 * @param {any} param0 Parameters for the menu.
 * @return {JSX.Element} Html.
 */
function Menu({ t, label, disabled, children }: any) {
  return (
    <DropdownButton
      variant="none"
      size="sm"
      className="small py-0"
      disabled={disabled}
      title={capitalize(t(label || 'menu'))}
    >
      {children}
    </DropdownButton>
  );
}

export default withTranslation()(Menu);
