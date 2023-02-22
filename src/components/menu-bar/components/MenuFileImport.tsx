import React, { createRef, RefObject } from 'react';
import { withTranslation } from 'react-i18next';
import { capitalize, first, uniqueId } from 'lodash';
import MenuComponent from './MenuComponent';
import { Dropdown } from 'react-bootstrap';

/**
 * @callback fileChangeCallback
 * @param {File} file The file that change
 * @return {void}
 */

/**
 * Menu import component.
 * @param {fileChangeCallback} onFileChanged Callback on file change
 * @return {JSX.Element} Html.
 */
class MenuFileImport extends MenuComponent {
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
      accept,
      onFileImported,
      ...rest
    } = this.props;

    const inputRef: RefObject<HTMLInputElement> = createRef();
    return (
      <React.Fragment>
        <input
          ref={inputRef}
          type="file"
          className="visually-hidden"
          accept={accept}
          key={this.key ? this.key + '/input' : undefined}
          onChange={this.handleFileChanged(onFileImported)}
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

  handleFileChanged =
    (onFileChanged: (file: File) => void) =>
    ({ target: { files } }: React.ChangeEvent<HTMLInputElement>) =>
      files && files.length > 0 && onFileChanged(first(files)!);
}

export default withTranslation()(MenuFileImport);
