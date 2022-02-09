import { max } from 'lodash';
import React, { useState } from 'react';
import Form from '../form/Form';
import * as FormComponents from '../form/form-components';
import FormSelectOptionModel from '../../models/form-models/FormSelectOptionModel';

function Step1() {
  const [cellSize, setCellSize] = useState(20);
  const controls = [
    <FormComponents.Control name="Analysis name" />,
    <FormComponents.Control name="Name of the modeler" />,
    <FormComponents.Control
      name="Cell size"
      suffix={
        <React.Fragment>
          <small className="me-1">x</small>
          {cellSize}m
        </React.Fragment>
      }
      onChange={({ target: { value } }: { target: HTMLInputElement }) => {
        setCellSize(max([1, +value])!);
      }}
      value={cellSize}
      type="number"
    />,
    <FormComponents.Select
      name="Coordinate system"
      defaultValue="1"
      options={
        [
          { value: '0', label: 'Cartesian' },
          { value: '1', label: 'Polar' },
          { value: '2', label: 'Cylindrical and spherical' },
          { value: '3', label: 'Homogeneous' },
        ] as FormSelectOptionModel[]
      }
    />,
    <FormComponents.Spacer />,
    <FormComponents.Button
      className="btn-primary w-100"
      onClick={() => console.log('Clicked primary button')}
      onDoubleClick={(event: Event) =>
        console.log('Double clicked primary button', event)
      }
    >
      Apply
    </FormComponents.Button>,
    <FormComponents.Button
      className="btn-outline-danger w-100"
      onClick={() => console.log('Clicked reset button')}
    >
      Reset
    </FormComponents.Button>,
  ];

  return <Form controls={controls} />;
}

export default Step1;
