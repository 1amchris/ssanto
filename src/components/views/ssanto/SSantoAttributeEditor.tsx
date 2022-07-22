import React from 'react';
import ServerCallTarget from 'enums/ServerCallTarget';
import { useAppDispatch } from 'store/hooks';
import { call } from 'store/reducers/server';
import {
  ISettingProps,
  ISettingWithValidationProps,
} from 'models/SettingsEditorProps';
import SettingsEditor from 'components/views/common/SettingsEditor';
import ValidatorsUtils from 'utils/validators-utils';
import { FileSettingProps } from 'components/views/common/editors/FileSelector';
import IAttribute from 'models/IAttribute';

function SSantoSecondaryObjectiveEditor({ view }: any) {
  const { main, primary, secondary, attribute } = view.configs;
  const uriBase = `objectives.${main}.primaries.${primary}.secondaries.${secondary}.attributes.${attribute}`;

  const dispatch: any = useAppDispatch();
  const publishChanges = (changes: any) =>
    dispatch(
      call({
        target: ServerCallTarget.WorkspaceViewsPublishEvent,
        args: [view.uri, changes],
      })
    );

  const changeHandler = (field: string) => (value: any) =>
    publishChanges({ [`${uriBase}.${field}`]: value });

  const fileChangeHandler = (field: string) => (value: FileList) => {
    changeHandler(field)(
      value?.length > 0 ? `file://${(value[0] as any).path}` : null
    );
  };

  const content: IAttribute | undefined = view.content;
  const settings = [
    {
      uri: `${uriBase}.name`,
      type: 'text',
      displayName: 'Name',
      value: content?.name,
      family: 'Attribute',
      shortDescription: 'The name of the attribute.',
      validators: [ValidatorsUtils.required],
      onValidChange: changeHandler('name'),
    } as ISettingWithValidationProps<string>,
    {
      uri: `${uriBase}.weight`,
      type: 'number',
      displayName: 'Weight',
      value: content?.weight,
      family: `Attribute`,
      shortDescription: 'The weight of the attribute.',
      min: 0,
      max: 1,
      validators: [
        ValidatorsUtils.required,
        ValidatorsUtils.atLeast(0),
        ValidatorsUtils.atMost(1),
      ],
      onValidChange: changeHandler('weight'),
    } as ISettingProps<number>,
    {
      // TODO: it would be great if the user could have a list of files to select from instead
      uri: `${uriBase}.dataset`,
      type: 'file',
      displayName: 'Dataset',
      family: 'Attribute',
      value: content?.dataset,
      shortDescription: 'The dataset of the attribute.',
      validators: [ValidatorsUtils.required],
      accept: '.shp, .gpkg',
      onValidChange: fileChangeHandler('dataset'),
    } as FileSettingProps,
    {
      uri: `${uriBase}.scale.function`,
      type: 'text',
      displayName: 'Function',
      value: content?.scale?.function,
      family: 'Attribute.Scale',
      shortDescription: 'The scaling function of the attribute.',
      validators: [ValidatorsUtils.required],
      onValidChange: changeHandler('scale.function'),
    } as ISettingWithValidationProps<string>,
  ];

  return <SettingsEditor settings={settings} />;
}

export default SSantoSecondaryObjectiveEditor;
