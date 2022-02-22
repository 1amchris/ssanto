import React from 'react';
import { capitalize } from 'lodash';
import { withTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  selectAnalysis,
  updateStudyAreaFiles,
} from '../../store/reducers/analysis';
import Form from '../form/Form';
import { Control, Button, Spacer, Alert } from '../form/form-components';

function StudyArea({ t }: any) {
  const dispatch = useAppDispatch();
  const {
    studyArea: { fileName, loading, error },
  } = useAppSelector(selectAnalysis);

  const controls = [
    <Alert visuallyHidden={!error} className="alert-danger">
      {error}
    </Alert>,
    <Control
      visuallyHidden={!fileName}
      label="selected file"
      value={`${fileName}.shp`}
      disabled
    />,
    <Control
      label="select study area"
      name="files"
      type="file"
      accept=".shp, .shx"
      multiple
      required
      disabled={loading}
    />,
    <Spacer />,
    <Button
      disabled={loading}
      loading={loading}
      variant="primary"
      className="w-100"
      type="submit"
    >
      {capitalize(t('apply'))}
    </Button>,
    <Button
      disabled={loading}
      variant="outline-danger"
      className="w-100"
      type="reset"
    >
      {capitalize(t('reset'))}
    </Button>,
  ];

  return (
    <Form
      disabled={loading}
      controls={controls}
      onSubmit={(fields: any) => dispatch(updateStudyAreaFiles(fields.files))}
    />
  );
}

export default withTranslation()(StudyArea);
