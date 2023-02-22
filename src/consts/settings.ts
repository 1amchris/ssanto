import {
  ISettingProps,
  ISettingWithValidationProps,
} from 'models/SettingsEditorProps';

export const settings = [
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
    onValidChange: (value: string) => {
      console.log({ value });
    },
  } as ISettingWithValidationProps<string>,

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
        message: (value: number) => `Invalid value: ${value} is not positive.`,
      },
      {
        assert: (value: number) => value % 2 == 1,
        message: (value: number) => `Invalid value: ${value} is not odd.`,
      },
    ],
    onValidChange: (value: number) => {
      console.log({ value });
    },
  } as ISettingWithValidationProps<number>,

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
        assert: (value: string) => value.split(',').length <= 5,
        message: (value: string) =>
          `Invalid value: ${value} has too many values.`,
      },
    ],
    onValidChange: (value: string) => {
      console.log({ value });
    },
  } as ISettingWithValidationProps<string>,

  // checkbox
  {
    uri: 'workbench.editor.enablePreview',
    type: 'checkbox',
    displayName: 'Enable Preview',
    family: 'Workbench.Editor',
    shortDescription:
      'Controls whether bracket pair colorization is enabled or not. Use Workbench: Color Customizations to override the bracket highlight colors. Controls whether opened editors sohuw as preview editors. Preview editors do not stay open, are reused until explicitely set to be kep open (e.g. via double click or editing), and show file names in italics.',
    checked: false,
    onValidChange: (value: boolean) => {
      console.log({ value });
    },
  } as ISettingProps<boolean>,

  // file
  {
    uri: 'workbench.settings.File',
    type: 'file',
    displayName: 'File',
    family: 'Workbench.Settings',
    shortDescription:
      'Specifies what configuration file to use when computing the suitability of a setting for a given editor.',
    accept: '.json',
    multiple: true,
    validators: [
      {
        assert: (files: FileList | null) => files !== null,
        message: () => `Invalid. No file selected.`,
      },
      {
        assert: (files: FileList) => files.length <= 2,
        message: (files: FileList) =>
          `Invalid. ${files.length} is too many files.`,
      },
    ],
    onValidChange: (files: FileList) => {
      console.log({ files });
    },
  } as ISettingWithValidationProps<FileList>,
];
