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
import { CheckboxSettingProps } from 'components/views/common/editors/CheckboxEditor';
import { SelectSettingProps } from 'components/views/common/editors/SelectEditor';

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

  // TODO: settings should be disabled instead of disappearing like they are right now. Better UX
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
      uri: `${uriBase}.dataset.uri`,
      type: 'file',
      displayName: 'Source',
      family: 'Attribute.Dataset',
      value: content?.dataset?.uri,
      shortDescription: 'The dataset source of the attribute.',
      validators: [ValidatorsUtils.required],
      accept: '.shp, .gpkg',
      onValidChange: fileChangeHandler('dataset.uri'),
    } as FileSettingProps,
    content?.dataset?.uri && [
      {
        uri: `${uriBase}.dataset.column`,
        type: 'text',
        displayName: 'Column Name',
        value: content?.dataset?.column,
        family: 'Attribute.Dataset',
        shortDescription:
          'The column of the dataset to be used. *WARNING: Make sure it is identical.*',
        onValidChange: changeHandler('dataset.column'),
      } as ISettingProps<string>,
      {
        uri: `${uriBase}.dataset.type`,
        type: 'select',
        displayName: 'Column Type',
        value: content?.dataset?.type,
        family: 'Attribute.Dataset',
        shortDescription: 'The dataset type of the selected column.',
        onValidChange: changeHandler('dataset.type'),
        options: [
          {
            uri: 'Continuous',
            displayName: 'Continuous',
            shortDescription: 'A continuous value.',
          },
          {
            uri: 'Categorical',
            displayName: 'Categorical',
            shortDescription: 'A categorical value.',
          },
          {
            uri: 'Boolean',
            displayName: 'Boolean',
            shortDescription: 'A boolean value.',
          },
        ],
      } as SelectSettingProps,
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
      !content?.dataset?.column && [
        {
          uri: `${uriBase}.scale.granularity`,
          type: 'number',
          displayName: 'Granularity',
          value: content?.scale?.granularity || 1,
          family: `Attribute.Scale`,
          shortDescription:
            'The granularity of the value scaling. The greater the granularity, the more continuous the value scaling function application will appear.',
          min: 1,
          validators: [ValidatorsUtils.required, ValidatorsUtils.atLeast(1)],
          onValidChange: changeHandler('scale.granularity'),
        } as ISettingWithValidationProps<number>,
        {
          uri: `${uriBase}.scale.centroid`,
          type: 'checkbox',
          displayName: 'Centroid',
          checked: content?.scale?.centroid,
          family: 'Attribute.Scale',
          shortDescription: 'Use the centroid of the dataset for the analysis.',
          onValidChange: changeHandler('scale.centroid'),
        } as CheckboxSettingProps,
        {
          uri: `${uriBase}.scale.max`,
          type: 'number',
          displayName: 'Maximum',
          value: content?.scale?.max || 0,
          family: `Attribute.Scale`,
          shortDescription:
            'The maximum distance until which the value scaling is applied (in meters).',
          min: 0,
          validators: [ValidatorsUtils.required, ValidatorsUtils.atLeast(0)],
          onValidChange: changeHandler('scale.max'),
        } as ISettingWithValidationProps<number>,
      ],
      {
        uri: `${uriBase}.scale.defaultValue`,
        type: 'number',
        displayName: 'Default Value',
        value: content?.scale?.defaultValue || 0,
        family: `Attribute.Scale`,
        shortDescription:
          'The default value used for missing values in the dataset.',
        min: 0,
        max: 1,
        validators: [
          ValidatorsUtils.required,
          ValidatorsUtils.atLeast(0),
          ValidatorsUtils.atMost(1),
        ],
        onValidChange: changeHandler('scale.defaultValue'),
      } as ISettingProps<number>,
    ],
  ];

  return <SettingsEditor settings={settings} />;
}

export default SSantoSecondaryObjectiveEditor;
