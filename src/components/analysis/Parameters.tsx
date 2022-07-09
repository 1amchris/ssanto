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
import ServerCallTarget from 'enums/ServerCallTarget';
import LoadingValue from 'models/LoadingValue';
import CallModel from 'models/server-coms/CallModel';

/**
 * @deprecated
 * Parameters component.
 * @param {any} param0 Parameters for the parameters.
 * @return {JSX.Element} Html.
 */
function Parameters({ t, disabled }: any) {
  const property = 'parameters';
  const selector = useAppSelector(selectAnalysis);
  const properties = selector.properties[property];
  const dispatch = useAppDispatch();

  const getErrors = selector.properties.parametersError;
  const isLoading = selector.properties.parametersLoading;

  const cellSizeRef: RefObject<HTMLSpanElement> = createRef();

  const controls = [
    <Control
      key="name-control"
      label="analysis name"
      guideHash="analysis-name"
      name="analysis_name"
      defaultValue={properties.analysis_name}
      required
      tooltip={t('the given name will be used to identify the saved project.')}
    />,
    <Control
      key="modeler-control"
      label="name of the modeler"
      guideHash="modeler-name"
      name="modeler_name"
      defaultValue={properties.modeler_name}
      required
      tooltip={t('the given name will be used to identify the modeler.')}
    />,
    <Control
      key="cell-control"
      label="cell size"
      guideHash="cell-size"
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
    <Spacer key="spacer" />,
    <Button
      key="apply-button"
      variant="outline-primary"
      type="submit"
      loading={isLoading}
    >
      {capitalize(t('apply'))}
    </Button>,
    <Button key="reset-button" variant="outline-danger" type="reset">
      {capitalize(t('reset'))}
    </Button>,
  ];

  return (
    <Form
      controls={controls}
      disabled={isLoading || disabled}
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
            target: ServerCallTarget.AnalysisUpdateParams,
            args: [property, { ...properties, ...fields }],
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

export default withTranslation()(Parameters);
