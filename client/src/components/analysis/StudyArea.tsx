import React from 'react';
import { capitalize } from 'lodash';
import { withTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  selectAnalysis,
  updateStudyAreaFiles,
} from '../../store/reducers/analysis';
import Form from '../form/Form';
import { Control, Button, Spacer } from '../form/form-components';

function StudyArea({ t }: any) {
  const dispatch = useAppDispatch();
  const {
    studyArea: { fileName, loading },
  } = useAppSelector(selectAnalysis);

  const controls = [
    fileName ? (
      <Control label="selected file" defaultValue={`${fileName}.sh`} disabled />
    ) : null,
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
    <Button disabled={loading} loading={loading} className="w-100 btn-primary">
      {capitalize(t('apply'))}
    </Button>,
    <Button
      disabled={loading}
      className="w-100 btn-outline-danger"
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
