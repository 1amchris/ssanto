import { capitalize } from 'lodash';
import React, { createRef, RefObject } from 'react';
import { Control, Spacer, Button } from '../form/form-components';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  selectAnalysis,
  updateParameters,
} from '../../store/reducers/analysis';
import { selectMap, updateCellSize } from '../../store/reducers/map';
import { withTranslation } from 'react-i18next';
import Form from '../form/Form';

function Parameters({ t }: any) {
  const dispatch = useAppDispatch();
  const {
    parameters: { analysisName, modelerName },
  } = useAppSelector(selectAnalysis);
  const { cellSize } = useAppSelector(selectMap);

  const cellSizeRef: RefObject<HTMLSpanElement> = createRef();

  const controls = [
    <Control
      label="analysis name"
      name="analysisName"
      defaultValue={analysisName}
      required
    />,
    <Control
      label="name of the modeler"
      name="modelerName"
      defaultValue={modelerName}
      required
    />,
    <Control
      label="cell size"
      name="cellSize"
      suffix={
        <React.Fragment>
          <small className="me-1">x</small>
          <span ref={cellSizeRef}>{cellSize}</span>m
        </React.Fragment>
      }
      onChange={({ target: { value } }: { target: HTMLInputElement }) => {
        if (cellSizeRef.current?.textContent)
          cellSizeRef.current.textContent = value;
      }}
      defaultValue={cellSize}
      type="number"
    />,
    <Spacer />,
    <Button variant="primary" className="w-100" type="submit">
      {capitalize(t('apply'))}
    </Button>,
    <Button variant="outline-danger" className="w-100" type="reset">
      {capitalize(t('reset'))}
    </Button>,
  ];

  return (
    <Form
      controls={controls}
      onSubmit={({
        analysisName,
        modelerName,
        cellSize,
      }: {
        [p: string]: string;
      }) => {
        dispatch(updateParameters({ analysisName, modelerName }));
        dispatch(updateCellSize(+cellSize));
      }}
    />
  );
}

export default withTranslation()(Parameters);
