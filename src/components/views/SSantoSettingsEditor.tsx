import React from 'react';
import {
  ISettingProps,
  ISettingWithValidationProps,
} from 'models/SettingsEditorProps';
import SettingsEditor from 'components/views/SettingsEditor';
import ValidatorsUtils from 'utils/validators-utils';
import { useAppDispatch } from 'store/hooks';
import { call } from 'store/reducers/server';
import ServerCallTarget from 'enums/ServerCallTarget';
import { FileSettingProps } from 'components/views/editors/FileSelector';

function SSantoSettingsEditor({ view }: any) {
  const dispatch = useAppDispatch();
  const updateField = (field: string) => (value: any) => {
    const changes = { [field]: value };
    dispatch(
      call({
        target: ServerCallTarget.WorkspaceViewsPublishChanges,
        args: [view.uri, changes],
      })
    );
  };

  const updateFile = (field: string) => (value: FileList) => {
    updateField(field)(
      value.length > 0 ? `file://${(value[0] as any).path}` : null
    );
  };

  const settings = [
    {
      uri: 'analysis.name',
      type: 'text',
      displayName: 'Name',
      value: view.content?.analysis?.name,
      family: 'Analysis',
      shortDescription: 'The name of the author of the analysis.',
      validators: [ValidatorsUtils.required],
      onValidChange: updateField('analysis.name'),
    } as ISettingWithValidationProps<string>,
    {
      uri: 'analysis.description',
      type: 'text',
      displayName: 'Description',
      value: view.content?.analysis?.description,
      family: 'Analysis',
      shortDescription: 'Description of the analysis',
      onValidChange: updateField('analysis.description'),
    } as ISettingProps<string>,
    {
      uri: 'analysis.author.name',
      type: 'text',
      displayName: 'Name',
      value: view.content?.analysis?.author?.name,
      family: 'Analysis.Author',
      shortDescription: 'The name of the author of the analysis.',
      onValidChange: updateField('analysis.author.name'),
    } as ISettingProps<string>,
    {
      uri: 'analysis.author.email',
      type: 'text',
      displayName: 'Email',
      value: view.content?.analysis?.author?.email,
      family: 'Analysis.Author',
      shortDescription: 'The email of the author of the analysis.',
      validators: [ValidatorsUtils.email],
      onValidChange: updateField('analysis.author.email'),
    } as ISettingProps<string>,
    {
      uri: 'analysis.author.website',
      type: 'text',
      displayName: 'Website',
      value: view.content?.analysis?.author?.website,
      family: 'Analysis.Author',
      shortDescription: 'The website of the author of the analysis.',
      validators: [ValidatorsUtils.url],
      onValidChange: updateField('analysis.author.website'),
    } as ISettingWithValidationProps<string>,
    {
      // TODO: it would be great if the user could have a list of files to select from instead
      uri: 'analysis.studyArea',
      type: 'file',
      displayName: 'Study Area',
      family: 'Analysis',
      value: view.content?.analysis?.studyArea,
      shortDescription: 'The study area of the analysis.',
      validators: [ValidatorsUtils.required],
      accept: '.shp',
      onValidChange: updateFile('analysis.studyArea'),
    } as FileSettingProps,
    {
      uri: 'analysis.createdOn',
      type: 'date',
      displayName: 'Created On',
      value: view.content?.analysis?.createdOn,
      family: 'Analysis',
      shortDescription: 'The date the analysis was created.',
      max: new Date().toISOString().split('T')[0],
      disabled: true,
      onValidChange: updateField('analysis.createdOn'),
    } as ISettingProps<string>,
    {
      uri: 'analysis.modifiedOn',
      type: 'date',
      displayName: 'Modified On',
      value: view.content?.analysis?.modifiedOn,
      family: 'Analysis',
      shortDescription: 'The date the analysis was last modified.',
      min: view.content?.analysis?.createdOn,
      max: new Date().toISOString().split('T')[0],
      disabled: true,
      onValidChange: updateField('analysis.modifiedOn'),
    } as ISettingProps<string>,
  ];

  return <SettingsEditor settings={settings} />;
}

export default SSantoSettingsEditor;
