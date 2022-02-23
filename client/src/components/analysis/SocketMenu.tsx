import React from 'react';
import { capitalize } from 'lodash';
import { Control, Spacer, Button } from '../form/form-components';
import { useAppDispatch } from '../../store/hooks';
import { withTranslation } from 'react-i18next';
import Form from '../form/Form';
import {
  call,
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
    <Button className="btn-outline-primary w-100" type="submit">
      {capitalize(t('send data'))}
    </Button>,
    <Spacer />,
    <Button
      className="btn-outline-secondary w-100"
      type="button"
      onClick={() => {
        dispatch(
          call({
            target: "AClass.method"
          })
        )

        dispatch(
            call({
                target: "function"
            })
          )
        
      }}
    >
      {capitalize(t('Calls'))}
    </Button>,
  ];

  return (
    <Form
      controls={controls}
      onSubmit={(fields: any) => dispatch(sendFiles({files: fields.files, target:'file'}))}
    />
  );
}

export default withTranslation()(SocketMenu);
