import React from 'react';
import { capitalize } from 'lodash';
import { Control, Spacer, Button } from '../form/form-components';
import { useAppDispatch } from '../../store/hooks';
import { withTranslation } from 'react-i18next';
import Form from '../form/Form';
import {
  callFunction,
  callMethod,
  sendFile,
} from '../../store/middlewares/ServerMiddleware';

function SocketMenu({ t }: any) {
  const dispatch = useAppDispatch();

  const controls = [
    <Control name="file" label="Upload a file" type="file" />,
    <Button className="btn-outline-primary w-100" type="submit">
      {capitalize(t('send data'))}
    </Button>,
    <Spacer />,
    <Button
      className="btn-outline-secondary w-100"
      type="button"
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
      className="btn-outline-secondary w-100"
      type="button"
      onClick={() =>
        dispatch(
          callMethod({
            instanceName: 'a_class',
            methodName: 'method',
          })
        )
      }
    >
      {capitalize(t('Call method'))}
    </Button>,
  ];

  return (
    <Form
      controls={controls}
      onSubmit={(fields: any) => dispatch(sendFile(fields.file))}
    />
  );
}

export default withTranslation()(SocketMenu);
