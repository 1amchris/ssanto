import React from 'react';
import { capitalize } from 'lodash';
import { Control, Spacer, Button } from '../form/form-components';
import { useAppDispatch } from '../../store/hooks';
import { withTranslation } from 'react-i18next';
import Form from '../form/Form';
import {
  callFunction,
  callMethod,
  sendFiles,
} from '../../store/middlewares/ServerMiddleware';

function SocketMenu({ t }: any) {
  const dispatch = useAppDispatch();

  const controls = [
    <Control
      name="files"
      label="Upload a file"
      type="file"
      multiple
      required
    />,
    <Button variant="outline-primary" type="submit">
      {capitalize(t('send data'))}
    </Button>,
    <Spacer />,
    <Button
      variant="outline-secondary"
      onClick={() =>
        dispatch(
          callFunction({
            functionName: 'function',
          })
        )
      }
    >
      {capitalize(t('Call function'))}
    </Button>,
    <Button
      variant="outline-secondary"
      onClick={() =>
        dispatch(
          callMethod({
            instanceName: 'a_class',
            methodName: 'method',
          })
        )
      }
    >
      {capitalize(t('call method'))}
    </Button>,
  ];

  return (
    <Form
      controls={controls}
      onSubmit={(fields: any) => dispatch(sendFiles(fields))}
    />
  );
}

export default withTranslation()(SocketMenu);
