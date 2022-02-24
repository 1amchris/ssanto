import { capitalize } from 'lodash';
import React, { createRef, RefObject } from 'react';
import { Control, Spacer, Button } from '../../components/form/form-components';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  selectAnalysis,
  updateProperties,
} from '../../store/reducers/analysis';
import { withTranslation } from 'react-i18next';
import Form from '../form/Form';
import { useEffectOnce } from '../../hooks';
import * as Utils from '../../utils';

function Parameters({ t }: any) {
  const property = 'parameters';
  const parameters = useAppSelector(selectAnalysis).properties[property];
  const dispatch = useAppDispatch();
  const isLoading = () => Utils.isLoading(Object.values(parameters));

  useEffectOnce(() => {
    Utils.generateSubscriptions(dispatch, property, Object.keys(parameters));
  });

  const cellSizeRef: RefObject<HTMLSpanElement> = createRef();

  const controls = [
    <Control
      label="analysis name"
      name="analysisName"
      defaultValue={parameters.analysisName.value}
      required
      tooltip={t('the analysis name will ...')}
    />,
    <Control
      label="name of the modeler"
      name="modelerName"
      defaultValue={parameters.modelerName.value}
      required
      tooltip={t("the modeler's name will ...")}
    />,
    <Control
      label="cell size"
      name="cellSize"
      suffix={
        <React.Fragment>
          <small className="me-1">x</small>
          <span ref={cellSizeRef}>{parameters.cellSize.value}</span>m
        </React.Fragment>
      }
      onChange={({ target: { value } }: { target: HTMLInputElement }) => {
        if (cellSizeRef.current?.textContent)
          cellSizeRef.current.textContent = value;
      }}
      defaultValue={parameters.cellSize.value}
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
      disabled={isLoading()}
      controls={controls}
      onSubmit={(fields: any) => {
        dispatch(updateProperties({ property, properties: fields }));
      }}
    />
  );
}

export default withTranslation()(Parameters);
