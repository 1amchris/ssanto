import React from 'react';
import { capitalize } from 'lodash';
import { Control, Spacer, Button } from '../form/form-components';
import { useAppDispatch } from '../../store/hooks';
import { withTranslation } from 'react-i18next';
import Form from '../form/Form';
import { call, sendFiles } from '../../store/middlewares/ServerMiddleware';

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
      onClick={() => {
        dispatch(
          call({
            target: 'a_class.method',
          })
        );
        dispatch(
          call({
            target: 'function',
          })
        );
      }}
      type="button"
    >
      {capitalize(t('call method & function'))}
    </Button>,
  ];

  return (
    <Form
      controls={controls}
      onSubmit={(fields: any) =>
        dispatch(sendFiles({ files: fields.files, target: 'file' }))
      }
    />
  );
}

export default withTranslation()(SocketMenu);
