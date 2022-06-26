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
      uri: 'analysis.createdOn',
      type: 'text',
      displayName: 'Created On',
      value: view.content?.analysis?.createdOn,
      family: 'Analysis',
      shortDescription: 'The date the analysis was created.',
      onValidChange: updateField('analysis.createdOn'),
    } as ISettingProps<string>,
    {
      uri: 'analysis.modifiedOn',
      type: 'text',
      displayName: 'Modified On',
      value: view.content?.analysis?.modifiedOn,
      family: 'Analysis',
      shortDescription: 'The date the analysis was last modified.',
      onValidChange: updateField('analysis.modifiedOn'),
    } as ISettingProps<string>,
  ];

  console.log({ view });

  return <SettingsEditor settings={settings} />;
}

export default SSantoSettingsEditor;
