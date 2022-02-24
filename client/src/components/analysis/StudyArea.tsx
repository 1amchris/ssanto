import React from 'react';
import { capitalize } from 'lodash';
import { withTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import {
  selectAnalysis,
  updateStudyArea,
  updateStudyAreaFiles,
} from 'store/reducers/analysis';
import Form from 'components/form/Form';
import {
  Control,
  Button,
  Spacer,
  Alert,
} from 'components/form/form-components';
import { useEffectOnce } from 'hooks';
import * as server from 'store/middlewares/ServerMiddleware';
import { Store } from 'redux';

function StudyArea({ t }: any) {
  const dispatch = useAppDispatch();
  const {
    studyArea: { value, isLoading, error },
  } = useAppSelector(selectAnalysis);

  useEffectOnce(() =>
    dispatch(
      server.subscribe({
        subject: 'study_area',
        callback: (store: Store) => data =>
          store.dispatch(updateStudyArea(data)),
      })
    )
  );

  const controls = [
    <Alert visuallyHidden={!error} className="alert-danger">
      {error}
    </Alert>,
    <Control
      visuallyHidden={!value!.fileName}
      label="selected file"
      value={`${value!.fileName}.shp`}
      disabled
    />,
    <Control
      label="select study area"
      name="files"
      type="file"
      accept=".shp, .shx"
      multiple
      required
      tooltip={t('the selected files will ...')}
    />,
    <Spacer />,
    <Button loading={isLoading} variant="outline-primary" type="submit">
      {capitalize(t('apply'))}
    </Button>,
    <Button variant="outline-danger" type="reset">
      {capitalize(t('reset'))}
    </Button>,
  ];

  return (
    <Form
      disabled={isLoading}
      controls={controls}
      onSubmit={(fields: any) => dispatch(updateStudyAreaFiles(fields.files))}
    />
  );
}

export default withTranslation()(StudyArea);
