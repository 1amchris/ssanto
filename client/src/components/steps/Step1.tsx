import { capitalize } from 'lodash';
import React from 'react';
import { Control, Select, Spacer, Button } from '../form/form-components';
import FormSelectOptionModel from '../../models/form-models/FormSelectOptionModel';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectAnalysis, setParameters } from '../../store/reducers/analysis';
import { withTranslation } from 'react-i18next';
import Form from '../form/Form';

function Step1({ t }: any) {
  const dispatch = useAppDispatch();
  const { parameters: source } = useAppSelector(selectAnalysis);
  const { analysisName, modelerName, cellSize, coordinateSystem } = source;

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
      // TODO: fix prefix/suffix issue (not syncing)
      suffix={
        <React.Fragment>
          <small className="me-1">x</small>
          {cellSize}m
        </React.Fragment>
      }
      // onChange={({ target: { value } }: { target: HTMLInputElement }) =>
      //   dispatch(setCellSize(+value))
      // }
      defaultValue={cellSize}
      type="number"
    />,
    <Select
      label="coordinate system"
      name="coordinateSystem"
      defaultValue={coordinateSystem}
      options={
        [
          { value: '0', label: 'cartesian' },
          { value: '1', label: 'polar' },
          { value: '2', label: 'cylindrical and spherical' },
          { value: '3', label: 'homogeneous' },
        ] as FormSelectOptionModel[]
      }
    />,
    <Spacer />,
    <Button className="btn-primary w-100">{capitalize(t('apply'))}</Button>,
    <Button className="btn-outline-danger w-100" type="reset">
      {capitalize(t('reset'))}
    </Button>,
  ];

  return (
    <Form
      controls={controls}
      store={source}
      onSubmit={(fields: any) => dispatch(setParameters(fields))}
    />
  );
}

export default withTranslation()(Step1);
