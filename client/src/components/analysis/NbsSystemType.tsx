import { capitalize } from 'lodash';
import React from 'react';
import { withTranslation } from 'react-i18next';
import FormSelectOptionModel from '../../models/form-models/FormSelectOptionModel';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  selectAnalysis,
  setNbsSystemType,
} from '../../store/reducers/analysis';
import Form from '../form/Form';
import { Select, Button, Spacer } from '../form/form-components';

function NbsSystemType({ t }: any) {
  const dispatch = useAppDispatch();
  const { nbsSystem: source } = useAppSelector(selectAnalysis);
  const { type } = source;

  const controls = [
    <Select
      label="NBS system type"
      name="type"
      defaultValue={type}
      options={
        [
          { value: '0', label: 'raingardens & bioretention systems' },
          { value: '1', label: 'rain tanks' },
          { value: '2', label: 'infiltration systems' },
          { value: '3', label: 'green roofs' },
          { value: '4', label: 'swales' },
          { value: '5', label: 'ponds & lakes' },
          { value: '6', label: 'constructed wetlands' },
        ] as FormSelectOptionModel[]
      }
    />,
    <Spacer />,
    <Button className="w-100 btn-primary" type="submit">
      {capitalize(t('apply'))}
    </Button>,
    <Button className="w-100 btn-outline-danger" type="reset">
      {capitalize(t('reset'))}
    </Button>,
  ];

  return (
    <Form
      controls={controls}
      store={source}
      onSubmit={(fields: any) => dispatch(setNbsSystemType(fields))}
    />
  );
}

export default withTranslation()(NbsSystemType);
