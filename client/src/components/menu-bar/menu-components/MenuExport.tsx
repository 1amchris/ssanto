import React from 'react';
import { withTranslation } from 'react-i18next';
import { capitalize, uniqueId } from 'lodash';
import { saveAs } from 'file-saver';
import MenuComponent from './MenuComponent';
import { Dropdown } from 'react-bootstrap';

class MenuExport extends MenuComponent {
  constructor(props: any, key?: string) {
    super(props, uniqueId('menu/export-'), key);
  }

  render = () => {
    const { t, i18n, tReady, className, label, getExportedFile, ...rest } =
      this.props;

    return (
      <Dropdown.Item
        as="button"
        className={`small dropdown-item ${className ? className : ''}`}
        onClick={() => {
          const file: File = getExportedFile();
          saveAs(file, file.name);
        }}
        key={this.key}
        {...rest}
      >
        {capitalize(t(label || 'export item'))}
      </Dropdown.Item>
    );
  };
}

export default withTranslation()(MenuExport);
