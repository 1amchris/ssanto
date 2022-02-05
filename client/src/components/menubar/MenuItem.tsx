import React from 'react';
import { withTranslation } from 'react-i18next';
import { capitalize } from 'lodash';

function MenuItem({ t, options: { name, enabled, action } }: any): JSX.Element {
  return (
    <button
      className={`small dropdown-item ${enabled || 'disabled'}`}
      onClick={action}
    >
      {capitalize(t(name))}
    </button>
  );
}

export default withTranslation()(MenuItem);
