import React from 'react';
import { capitalize } from 'lodash';
import { withTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import {
  selectAnalysis,
  injectSetErrorCreator,
  injectSetLoadingCreator,
} from 'store/reducers/analysis';
import Form from 'components/forms/Form';
import { Control, Button, Spacer, Select } from 'components/forms/components';
import { call } from 'store/reducers/server';
import ServerCallTargets from 'enums/ServerCallTargets';
import CallModel from 'models/server-coms/CallModel';
import LoadingValue from 'models/LoadingValue';

function StudyArea({ t, disabled }: any) {
  const property = 'study_area';
  const selector = useAppSelector(selectAnalysis);
  const dispatch = useAppDispatch();
  const properties = selector.properties[property];
  const files = selector.properties['files'];
  const filesChoices = [{ value: '', label: '' }];
  for (let i = 0; i < files.length; i += 1) {
    filesChoices.push({ value: files[i].name, label: files[i].name });
  }

  const getErrors = selector.properties.study_areaError;
  const isLoading = selector.properties.study_areaLoading;

  const controls = [
    <Control
      visuallyHidden={!properties}
      label="selected file"
      value={`${properties}`}
      disabled
    />,
    <Select
      label="select study area"
      name="study_area_file"
      tooltip="Some tooltip"
      required
      defaultValue={properties}
      options={filesChoices}
    />,
    <Spacer />,
    <Button variant="outline-primary" type="submit" loading={isLoading}>
      {capitalize(t('apply'))}
    </Button>,
  ];

  return (
    <Form
      disabled={isLoading || disabled}
      controls={controls}
      errors={getErrors}
      onSubmit={(fields: any) => {
        dispatch(
          injectSetLoadingCreator({
            value: property,
            isLoading: true,
          } as LoadingValue<string>)()
        );
        dispatch(
          call({
            target: ServerCallTargets.UpdateStudyAreaFiles,
            args: [fields.study_area_file],
            onSuccessAction: injectSetLoadingCreator({
              value: property,
              isLoading: false,
            } as LoadingValue<string>),
            onErrorAction: injectSetErrorCreator(property),
          } as CallModel<string[], any, void, string, string>)
        );
      }}
    />
  );
}

export default withTranslation()(StudyArea);
