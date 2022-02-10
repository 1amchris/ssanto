import { capitalize } from 'lodash';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectAnalysis, setStudyArea } from '../../store/reducers/analysis';
import Form from '../form/Form';
import { Control, Button, Spacer } from '../form/form-components';

function Step2({ t }: any) {
  const dispatch = useAppDispatch();
  const { studyArea: source } = useAppSelector(selectAnalysis);

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
      store={source}
      onSubmit={(fields: any) => dispatch(setStudyArea(fields))}
    />
  );
}

export default withTranslation()(Step2);
