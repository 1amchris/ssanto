import React from 'react';
import { capitalize } from 'lodash';
import { withTranslation } from 'react-i18next';
import FormSelectOptionModel from 'models/form/FormSelectOptionModel';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import {
  selectAnalysis,
  injectSetErrorCreator,
  injectSetLoadingCreator,
} from 'store/reducers/analysis';
import Form from 'components/forms/Form';
import { Select, Button, Spacer } from 'components/forms/components';
import { call } from 'store/reducers/server';
import ServerCallTargets from 'enums/ServerCallTargets';
import LoadingValue from 'models/LoadingValue';
import CallModel from 'models/server-coms/CallModel';

function NbsSystem({ t, disabled }: any) {
  const property = 'nbs_system';
  const selector = useAppSelector(selectAnalysis);
  const properties = selector.properties[property];
  const dispatch = useAppDispatch();

  const getErrors = selector.properties.nbs_systemError;
  const isLoading = selector.properties.nbs_systemLoading;

  /* eslint-disable react/jsx-key */
  const controls = [
    <Select
      label="NBS system type"
      name="system_type"
      defaultValue={properties.system_type}
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
    <Button variant="outline-primary" type="submit" loading={isLoading}>
      {capitalize(t('apply'))}
    </Button>,
    <Button variant="outline-danger" type="reset">
      {capitalize(t('reset'))}
    </Button>,
  ];
  /* eslint-enable react/jsx-key */

  return (
    <Form
      controls={controls}
      errors={getErrors}
      disabled={isLoading || disabled}
      onSubmit={(fields: any) => {
        dispatch(
          injectSetLoadingCreator({
            value: property,
            isLoading: true,
          } as LoadingValue<string>)()
        );
        dispatch(
          call({
            target: ServerCallTargets.Update,
            args: [property, fields],
            onSuccessAction: injectSetLoadingCreator({
              value: property,
              isLoading: false,
            } as LoadingValue<string>),
            onErrorAction: injectSetErrorCreator(property),
          } as CallModel<[string, Object], void, LoadingValue<string>, string, string>)
        );
      }}
    />
  );
}

export default withTranslation()(NbsSystem);
