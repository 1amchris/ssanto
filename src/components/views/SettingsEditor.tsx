import { Color } from 'enums/Color';
import { ISettingProps } from 'models/SettingsEditorProps';
import React, { Suspense, useContext, useState } from 'react';
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
          <span className="text-black">{setting.displayName}</span>
        </b>
        {setting.type !== 'checkbox' && setting.shortDescription && (
          <p className="small text-muted mb-2">{setting.shortDescription}</p>
        )}
        <Suspense fallback={<div>Loading...</div>}>
          <SettingFactory setting={setting} />
        </Suspense>
      </div>
    </div>
  );
}

function SettingsEditor({ settings }: any) {
  const [factories, setFactories] = useState({
    ['checkbox']: React.lazy(() => {
      return import('components/views/editors/CheckboxEditor');
    }),
    ['date']: React.lazy(() => {
      return import('components/views/editors/DateEditor');
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

  return (
    <div className="p-3">
      <SettingsEditorRegistry.Provider value={value}>
        {settings &&
          settings.map((setting: ISettingProps<any>) => (
            <SettingRow key={setting.uri} setting={setting} />
          ))}
      </SettingsEditorRegistry.Provider>
    </div>
  );
}

export default SettingsEditor;
