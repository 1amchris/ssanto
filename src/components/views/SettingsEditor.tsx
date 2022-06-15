import { Color } from 'enums/Color';
import React, { useContext, useState } from 'react';
import { VscChevronRight } from 'react-icons/vsc';

const SettingsEditorRegistry = React.createContext({
  factories: {},
  registerFactory: (
    viewType: string,
    factory: (props: any) => React.ReactNode
  ) => {},
});

function useSettingsEditorRegistry() {
  const { factories } = useContext(SettingsEditorRegistry);

  return {
    getView: (viewType?: string) => {
      if (!viewType) return console.error('No view type provided');
      if (!Object.keys(factories).includes(viewType))
        return console.error(`No setting editor matches view type ${viewType}`);

      return (factories as any)[viewType];
    },
  };
}

function SettingRow({ setting }: any) {
  const { getView } = useSettingsEditorRegistry();
  const SettingFactory = getView(setting.type);

  const [focused, setFocused] = React.useState(false);

  return (
    <div
      className={(focused ? 'bg-light' : '') + ' p-2'}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onMouseEnter={() => setFocused(true)}
      onMouseLeave={() => setFocused(false)}
    >
      <div
        className="px-2 py-1"
        style={{
          borderLeft: '2px solid',
          borderColor: focused ? Color.Primary : '#00000000',
        }}
      >
        <b className="small mb-2">
          {setting.family !== undefined && (
            <span className="text-secondary">
              {setting.family
                ?.split('.')
                .reduce(
                  (
                    acc: React.ReactNode[],
                    family: string,
                    index: number,
                    arr: string[]
                  ) => [
                    ...acc,
                    <span key={`${family}-${index}`}>{family}</span>,
                    index < arr.length - 1 && (
                      <VscChevronRight key={`>-${index}`} />
                    ),
                  ],
                  []
                )}
              :{' '}
            </span>
          )}
          <span className="text-black">
            {setting.displayName || setting.key}
          </span>
        </b>
        {setting.type !== 'checkbox' && setting.shortDescription && (
          <p className="small text-muted mb-2">{setting.shortDescription}</p>
        )}
        <SettingFactory setting={setting} />
      </div>
    </div>
  );
}

function SettingsEditor() {
  const [factories, setFactories] = useState({
    ['checkbox']: React.lazy(() => {
      return import('components/views/editors/CheckboxEditor');
    }),
    ['file']: React.lazy(() => {
      return import('components/views/editors/FileSelector');
    }),
    ['number']: React.lazy(() => {
      return import('components/views/editors/NumberEditor');
    }),
    ['select']: React.lazy(() => {
      return import('components/views/editors/SelectEditor');
    }),
    ['text']: React.lazy(() => {
      return import('components/views/editors/TextEditor');
    }),
    // No text area (should be a full editor)
  });

  const value = {
    factories,
    registerFactory: (
      viewType: string,
      factory: (props: any) => React.ReactNode
    ) => {
      setFactories({ ...factories, [viewType]: factory });
    },
  };

  // Example
  const settings = [
    // select
    {
      uri: 'files.autoSave',
      type: 'select',
      displayName: 'Auto Save',
      family: 'Files',
      value: 'file.autoSave.afterDelay',
      shortDescription:
        'Controls auto save of editors that have unsaved changes.',
      options: [
        {
          uri: 'file.autoSave.off',
          displayName: 'off',
          shortDescription:
            'An editor with changes is never automatically saved.',
        },
        {
          uri: 'file.autoSave.afterDelay',
          displayName: 'afterDelay',
          shortDescription:
            'An editor with changes is automatically saved after the configured delay.',
        },
        {
          uri: 'file.autoSave.onFocusChange',
          displayName: 'onFocusChange',
          shortDescription:
            'An editor with changes is automatically saved when the editor loses focus.',
        },
        {
          uri: 'file.autoSave.onWindowChange',
          displayName: 'onWindowChange',
          shortDescription:
            'An editor with changes is automatically saved when the window loses focus.',
        },
      ],
    },
    // number
    {
      uri: 'editor.fontSize',
      type: 'number',
      displayName: 'Font Size',
      value: 15,
      placeholder: 'Pick something',
      family: 'Editor',
      shortDescription: 'Controls the font size in pixels.',
      validators: [
        {
          assert: (value: number) => value >= 0,
          message: (value: number) =>
            `Invalid value: ${value} is not positive.`,
        },
        {
          assert: (value: number) => value % 2 == 1,
          message: (value: number) => `Invalid value: ${value} is not odd.`,
        },
      ],
    },
    // text
    {
      uri: 'editor.fontFamily',
      type: 'text',
      displayName: 'Font Family',
      value: `JetBrains Mono, Menlo, Monaco, 'Courier New', monospace`,
      family: 'Editor',
      shortDescription: 'Controls the font family.',
      validators: [
        {
          assert: (value: string) => value.length > 5,
          message: (value: string) => `Invalid value: ${value} is too short.`,
        },
        {
          assert: (value: string) => value.split(',').length > 5,
          message: (value: string) =>
            `Invalid value: ${value} has too many values.`,
        },
      ],
    },
    // checkbox
    {
      uri: 'workbench.editor.enablePreview',
      type: 'checkbox',
      displayName: 'Enable Preview',
      family: 'Workbench.Editor',
      shortDescription:
        'Controls whether bracket pair colorization is enabled or not. Use Workbench: Color Customizations to override the bracket highlight colors. Controls whether opened editors sohuw as preview editors. Preview editors do not stay open, are reused until explicitely set to be kep open (e.g. via double click or editing), and show file names in italics.',
      checked: false,
    },
    // file
    {
      uri: 'workbench.settings.File',
      type: 'file',
      displayName: 'File',
      family: 'Workbench.Settings',
      shortDescription:
        'Specifies what configuration file to use when selecting files?',
      accept: '.json',
      multiple: false,
      validators: [
        {
          assert: (files: FileList | null) => files !== null,
          message: () => `Invalid. No file selected.`,
        },
        {
          assert: (files: FileList) => files.length <= 3,
          message: (files: FileList) =>
            `Invalid. ${files.length} is too many files.`,
        },
      ],
    },
  ];

  return (
    <SettingsEditorRegistry.Provider value={value}>
      <div className="p-3">
        {settings.map(setting => (
          <SettingRow key={setting.uri} setting={setting} />
        ))}
      </div>
    </SettingsEditorRegistry.Provider>
  );
}

export default SettingsEditor;
