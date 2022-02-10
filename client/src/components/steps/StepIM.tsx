import { capitalize } from 'lodash';
import React from 'react';
import { Control, Spacer, Button } from '../form/form-components';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  addLayer,
  Layer,
  selectMap,
  updateLocation,
} from '../../store/reducers/map';
import { withTranslation } from 'react-i18next';
import Form from '../form/Form';

//Importation des données à effacer, juste pour démo
import ev from '../../data/espace_vert.json';
import lh from '../../data/limite_h.json';

function StepIM({ t }: any) {
  const source = useAppSelector(selectMap);
  const { location, clickedCoord, layers } = source;
  const dispatch = useAppDispatch();

  const newLayers: any = {
    1: { name: 'layer1', data: ev } as Layer,
    2: { name: 'layer2', data: lh } as Layer,
  };

  const controls = [
    <Control
      label="clicked latitude"
      plaintext
      defaultValue={`${clickedCoord.lat}º`}
    />,
    <Control
      label="clicked longitude"
      plaintext
      defaultValue={`${clickedCoord.long}º`}
    />,
    <Spacer />,
    <Control
      label="latitude"
      name="lat"
      type="number"
      defaultValue={location.lat}
      required
    />,
    <Control
      label="longitude"
      name="long"
      type="number"
      defaultValue={location.long}
      required
    />,
    <Spacer />,
    <Button className="btn-primary w-100">
      {capitalize(t('update center'))}
    </Button>,
    <Button className="btn-outline-danger w-100" type="reset">
      {capitalize(t('reset'))}
    </Button>,
    <Spacer />,
    <Button
      className="btn-outline-primary w-100"
      type="button"
      onClick={() => {
        if (Object.keys(newLayers).some(key => +key === layers.length + 1))
          dispatch(addLayer(newLayers[layers.length + 1]));
      }}
      disabled={layers.length >= 2}
    >
      {capitalize(t('add layer'))}
    </Button>,
  ];

  return (
    <Form
      controls={controls}
      store={location}
      onSubmit={(fields: any) =>
        dispatch(updateLocation({ long: fields.long, lat: fields.lat }))
      }
    />
  );
}

export default withTranslation()(StepIM);
