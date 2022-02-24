import React from 'react';
import { Store } from 'redux';
import { capitalize } from 'lodash';
import { withTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import {
  selectAnalysis,
  updateStudyArea,
  updateStudyAreaFiles,
} from 'store/reducers/analysis';
import Form from 'components/form/Form';
import { Control, Button, Spacer } from 'components/form/form-components';
import * as server from 'store/middlewares/ServerMiddleware';
import { useEffectOnce } from 'hooks';
import * as Utils from 'utils';

function StudyArea({ t }: any) {
  const dispatch = useAppDispatch();
  const studyArea = useAppSelector(selectAnalysis).studyArea;

  const getErrors = () => Utils.getErrors(Object.values(studyArea));
  const isLoading = () => Utils.isLoading(Object.values(studyArea));

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
    <Control
      visuallyHidden={!studyArea?.value?.fileName}
      label="selected file"
      value={`${studyArea?.value?.fileName}.shp`}
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
    <Button variant="outline-primary" type="submit" loading={isLoading()}>
      {capitalize(t('apply'))}
    </Button>,
    <Button variant="outline-danger" type="reset">
      {capitalize(t('reset'))}
    </Button>,
  ];

  return (
    <Form
      disabled={isLoading()}
      controls={controls}
      errors={getErrors()}
      onSubmit={(fields: any) => dispatch(updateStudyAreaFiles(fields.files))}
    />
  );
}

export default withTranslation()(StudyArea);
