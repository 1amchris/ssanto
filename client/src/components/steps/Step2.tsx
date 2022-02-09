import React from 'react';
import Form from '../form/Form';
import { Control, Button, Spacer } from '../form/form-components';

function Step2() {
  const controls = [
    <Control
      type="file"
      name="Select study area"
      onChange={(event: any) => console.log(event)}
    />,
    <Spacer />,
    <Button className="w-100 btn-primary" onClick={(e: any) => console.log(e)}>
      Apply
    </Button>,
    <Button
      className="w-100 btn-outline-danger"
      onClick={(e: any) => console.warn(e)}
    >
      Reset
    </Button>,
  ];

  return <Form controls={controls} />;
}

export default Step2;
