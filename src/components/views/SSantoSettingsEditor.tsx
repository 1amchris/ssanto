import React from 'react';
import {
  ISettingProps,
  ISettingWithValidationProps,
} from 'models/SettingsEditorProps';
import SettingsEditor from 'components/views/SettingsEditor';
import ValidatorsUtils from 'utils/validators-utils';

function SSantoSettingsEditor({ view }: any) {
  const settings = [
    {
      uri: 'analysis.name',
      type: 'text',
      displayName: 'Name',
      value: view.content?.analysis?.name,
      family: 'Analysis',
      shortDescription: 'The name of the author of the analysis.',
      validators: [ValidatorsUtils.required],
      onValidChange: (value: string) => {
        console.log({ name: value });
      },
    } as ISettingWithValidationProps<string>,
    {
      uri: 'analysis.description',
      type: 'text',
      displayName: 'Description',
      value: view.content?.analysis?.description,
      family: 'Analysis',
      shortDescription: 'Description of the analysis',
      onValidChange: (value: string) => {
        console.log({ description: value });
      },
    } as ISettingProps<string>,
    {
      uri: 'analysis.author.name',
      type: 'text',
      displayName: 'Name',
      value: view.content?.analysis?.author?.name,
      family: 'Analysis.Author',
      shortDescription: 'The name of the author of the analysis.',
      onValidChange: (value: string) => {
        console.log({ 'author.name': value });
      },
    } as ISettingProps<string>,
    {
      uri: 'analysis.author.email',
      type: 'text',
      displayName: 'Email',
      value: view.content?.analysis?.author?.email,
      family: 'Analysis.Author',
      shortDescription: 'The email of the author of the analysis.',
      validators: [ValidatorsUtils.email],
      onValidChange: (value: string) => {
        console.log({ 'author.email': value });
      },
    } as ISettingProps<string>,
    {
      uri: 'analysis.author.website',
      type: 'text',
      displayName: 'Website',
      value: view.content?.analysis?.author?.website,
      family: 'Analysis.Author',
      shortDescription: 'The website of the author of the analysis.',
      validators: [ValidatorsUtils.url],
      onValidChange: (value: string) => {
        console.log({ 'author.website': value });
      },
    } as ISettingWithValidationProps<string>,
    {
      uri: 'analysis.createdOn',
      type: 'text',
      displayName: 'Created On',
      value: view.content?.analysis?.createdOn,
      family: 'Analysis',
      shortDescription: 'The date the analysis was created.',
      onValidChange: (value: string) => {
        console.log({ createdOn: value });
      },
    } as ISettingProps<string>,
    {
      uri: 'analysis.modifiedOn',
      type: 'text',
      displayName: 'Modified On',
      value: view.content?.analysis?.modifiedOn,
      family: 'Analysis',
      shortDescription: 'The date the analysis was last modified.',
      onValidChange: (value: string) => {
        console.log({ modifiedOn: value });
      },
    } as ISettingProps<string>,
  ];

  return <SettingsEditor settings={settings} />;
}

export default SSantoSettingsEditor;
