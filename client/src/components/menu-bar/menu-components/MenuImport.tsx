import React, { createRef, RefObject } from 'react';
import { withTranslation } from 'react-i18next';
import { capitalize, first, uniqueId } from 'lodash';
import MenuComponent from './MenuComponent';

class MenuImport extends MenuComponent {
  constructor(props: any, key?: string) {
    super(props, uniqueId('menu/import-'), key);
  }

  render = () => {
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
          onChange={this.handleFileChanged(onFileImported)}
        />
        <button
          className={`small dropdown-item ${className}`}
          onClick={() => inputRef.current?.click()}
          {...rest}
        >
          {capitalize(t(label || 'import item'))}
        </button>
      </React.Fragment>
    );
  };

  handleFileChanged =
    (onFileChanged: (file: File) => void) =>
    ({ target: { files } }: React.ChangeEvent<HTMLInputElement>) =>
      files && files.length > 0 && onFileChanged(first(files)!);
}

export default withTranslation()(MenuImport);
