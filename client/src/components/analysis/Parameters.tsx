import { capitalize } from 'lodash';
import React, { createRef, RefObject } from 'react';
import { Control, Spacer, Button } from 'components/form/form-components';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { selectAnalysis, sendProperties } from 'store/reducers/analysis';
import { withTranslation } from 'react-i18next';
import Form from 'components/form/Form';
import { useEffectOnce } from 'hooks';
import * as Utils from 'utils';

function Parameters({ t }: any) {
  const property = 'parameters';
  const properties = useAppSelector(selectAnalysis).properties[property];
  const dispatch = useAppDispatch();

  const getErrors = () => Utils.getErrors(Object.values(properties));
  const isLoading = () => Utils.isLoading(Object.values(properties));

  useEffectOnce(() => {
    Utils.generateSubscriptions(dispatch, property, Object.keys(properties));
  });

  const cellSizeRef: RefObject<HTMLSpanElement> = createRef();
  const controls = [
    <Control
      label="analysis name"
      name="analysisName"
      defaultValue={properties.analysisName.value}
      required
      tooltip={t('the analysis name will ...')}
    />,
    <Control
      label="name of the modeler"
      name="modelerName"
      defaultValue={properties.modelerName.value}
      required
      tooltip={t("the modeler's name will ...")}
    />,
    <Control
      label="cell size"
      name="cellSize"
      suffix={
        <React.Fragment>
          <small className="me-1">x</small>
          <span ref={cellSizeRef}>{properties.cellSize.value}</span>m
        </React.Fragment>
      }
      onChange={({ target: { value } }: { target: HTMLInputElement }) => {
        if (cellSizeRef.current?.textContent)
          cellSizeRef.current.textContent = value;
      }}
      defaultValue={properties.cellSize.value}
      type="number"
      tooltip={t('the cell size is ...')}
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
      controls={controls}
      disabled={isLoading()}
      errors={getErrors()}
      onSubmit={(fields: any) => {
        dispatch(sendProperties({ property, properties: fields }));
      }}
    />
  );
}

export default withTranslation()(Parameters);
