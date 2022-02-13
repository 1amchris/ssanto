import { capitalize } from 'lodash';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { useAppDispatch } from '../../store/hooks';
import { updateStudyArea } from '../../store/reducers/analysis';
import Form from '../form/Form';
import { Control, Button, Spacer } from '../form/form-components';

function StudyArea({ t }: any) {
  const dispatch = useAppDispatch();

  const controls = [
    <Control label="study area" name="file" type="file" />,
    <Spacer />,
    <Button className="w-100 btn-primary">{capitalize(t('apply'))}</Button>,
    <Button className="w-100 btn-outline-danger" type="reset">
      {capitalize(t('reset'))}
    </Button>,
  ];

  return (
    <Form
      controls={controls}
      onSubmit={(fields: any) => dispatch(updateStudyArea(fields))}
    />
  );
}

export default withTranslation()(StudyArea);
