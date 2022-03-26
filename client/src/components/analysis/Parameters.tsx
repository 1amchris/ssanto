import { capitalize } from 'lodash';
import React, { createRef, RefObject } from 'react';
import { Control, Spacer, Button } from 'components/forms/components';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import {
  selectAnalysis,
  injectSetErrorCreator,
  injectSetLoadingCreator,
} from 'store/reducers/analysis';
import { withTranslation } from 'react-i18next';
import Form from 'components/forms/Form';
import { call } from 'store/reducers/server';
import ServerCallTargets from 'enums/ServerCallTargets';
import LoadingValue from 'models/LoadingValue';
import CallModel from 'models/server-coms/CallModel';

function Parameters({ t }: any) {
  const property = 'parameters';
  const selector = useAppSelector(selectAnalysis);
  const properties = selector.properties[property];
  const dispatch = useAppDispatch();

  const getErrors = selector.properties.parametersError;
  const isLoading = selector.properties.parametersLoading;

  const cellSizeRef: RefObject<HTMLSpanElement> = createRef();
  const controls = [
    <Control
      label="analysis name"
      name="analysis_name"
      defaultValue={properties.analysis_name}
      required
      tooltip={t('the analysis name will ...')}
    />,
    <Control
      label="name of the modeler"
      name="modeler_name"
      defaultValue={properties.modeler_name}
      required
      tooltip={t("the modeler's name will ...")}
    />,
    <Control
      label="cell size"
      name="cell_size"
      suffix={
        <React.Fragment>
          <small className="me-1">x</small>
          <span ref={cellSizeRef}>{properties.cell_size}</span>m
        </React.Fragment>
      }
      onChange={({ target: { value } }: { target: HTMLInputElement }) => {
        if (cellSizeRef.current?.textContent)
          cellSizeRef.current.textContent = value;
      }}
      defaultValue={properties.cell_size}
      type="number"
      tooltip={t('the cell size is ...')}
    />,
    <Spacer />,
    <Button variant="outline-primary" type="submit" loading={isLoading}>
      {capitalize(t('apply'))}
    </Button>,
    <Button variant="outline-danger" type="reset">
      {capitalize(t('reset'))}
    </Button>,
  ];

  return (
    <Form
      controls={controls}
      disabled={isLoading}
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
            target: ServerCallTargets.Update,
            args: [property, { ...properties, ...fields }],
            onSuccessAction: injectSetLoadingCreator({
              value: property,
              isLoading: false,
            } as LoadingValue<string>),
            onFailureAction: injectSetErrorCreator(property),
          } as CallModel<[string, Object], void, LoadingValue<string>, string, string>)
        );
      }}
    />
  );
}

export default withTranslation()(Parameters);
