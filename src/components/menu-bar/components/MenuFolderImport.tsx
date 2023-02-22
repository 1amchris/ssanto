import React, { createRef, RefObject } from 'react';
import { withTranslation } from 'react-i18next';
import { capitalize, uniqueId } from 'lodash';
import MenuComponent from './MenuComponent';
import { Dropdown } from 'react-bootstrap';

/**
 * Menu import component.
 * @param {folderChangeCallback} onFolderChanged Callback on folder change
 * @return {JSX.Element} Html.
 */
class MenuFolderImport extends MenuComponent {
  /**
   * @constructor
   * @param {any} props Props. TODO
   * @param {string} [key] Key name
   */
  constructor(props: any, key?: string) {
    super(props, uniqueId('menu/import-'), key);
  }

  render = () => {
    /* eslint-disable no-unused-vars */
    const {
      t,
      i18n,
      tReady,
      className,
      label,
      onFolderImported,
      onPathImported,
      ...rest
    } = this.props;

    const inputRef: RefObject<HTMLInputElement> = createRef();
    return (
      <React.Fragment>
        <input
          ref={inputRef}
          type="file"
          className="visually-hidden"
          key={this.key ? this.key + '/input' : undefined}
          onChange={this.handleFolderChanged(onFolderImported)}
          /* @ts-expect-error */
          directory=""
          webkitdirectory=""
        />
        <Dropdown.Item
          as="button"
          className={`small dropdown-item ${className}`}
          onClick={() => inputRef.current?.click()}
          key={this.key}
          {...rest}
        >
          {capitalize(t(label || 'import item'))}
        </Dropdown.Item>
      </React.Fragment>
    );
  };

  handleFolderChanged =
    (onFolderChanged: (files: FileList) => void) =>
    ({ target: { files } }: React.ChangeEvent<HTMLInputElement>) =>
      files && files.length > 0 && onFolderChanged(files);
}

export default withTranslation()(MenuFolderImport);
