import React from 'react';
import { capitalize } from 'lodash';
import { withTranslation } from 'react-i18next';
import { useEffectOnce } from 'hooks';
import FormSelectOptionModel from 'models/form-models/FormSelectOptionModel';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { selectAnalysis, updateProperties } from 'store/reducers/analysis';
import Form from 'components/form/Form';
import { Select, Button, Spacer } from 'components/form/form-components';
import * as Utils from 'utils';

function NbsSystem({ t }: any) {
  const property = 'nbsSystem';
  const nbsSystem = useAppSelector(selectAnalysis).properties[property];
  const dispatch = useAppDispatch();

  useEffectOnce(() => {
    Utils.generateSubscriptions(dispatch, property, Object.keys(nbsSystem));
  });

  const controls = [
    <Select
      label="NBS system type"
      name="systemType"
      defaultValue={nbsSystem.systemType.value}
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
      tooltip={t('the selected NBS system type ...')}
    />,
    <Spacer />,
    <Button variant="outline-primary" type="submit">
      {capitalize(t('apply'))}
    </Button>,
    <Button variant="outline-danger" type="reset">
      {capitalize(t('reset'))}
    </Button>,
  ];

  return (
    <Form
      controls={controls}
      onSubmit={(fields: any) =>
        dispatch(updateProperties({ property, properties: fields }))
      }
    />
  );
}

export default withTranslation()(NbsSystem);
