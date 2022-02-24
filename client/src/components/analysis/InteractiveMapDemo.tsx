import { capitalize } from 'lodash';
import React from 'react';
import { Control, Spacer, Button } from '../form/form-components';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  upsertLayer,
  Layer,
  selectMap,
  updateLocation,
} from '../../store/reducers/map';
import { withTranslation } from 'react-i18next';
import Form from '../../components/form/Form';

//Importation des données à effacer, juste pour démo
import ev from '../../data/espace_vert.json';
import lh from '../../data/limite_h.json';

function InterativeMapDemo({ t }: any) {
  const { location, clickedCoord, layers } = useAppSelector(selectMap);
  const dispatch = useAppDispatch();

  const newLayers: any = {
    1: { name: 'green spaces', data: ev } as Layer,
    2: { name: 'build height limit', data: lh } as Layer,
  };

  const controls = [
    <Control
      label="clicked latitude"
      readOnly
      defaultValue={`${clickedCoord.lat || location.lat}º`}
    />,
    <Control
      label="clicked longitude"
      readOnly
      defaultValue={`${clickedCoord.long || location.long}º`}
    />,
    <Spacer />,
    <Control
      label="latitude"
      name="lat"
      defaultValue={location.lat}
      required
    />,
    <Control
      label="longitude"
      name="long"
      defaultValue={location.long}
      required
    />,
    <Spacer />,
    <Button variant="outline-primary" type="submit">
      {capitalize(t('update center'))}
    </Button>,
    <Button variant="outline-danger" type="reset">
      {capitalize(t('reset'))}
    </Button>,
    <Spacer />,
    <Button
      variant="outline-primary"
      onClick={() => {
        if (Object.keys(newLayers).some(key => +key === layers.length + 1))
          dispatch(upsertLayer(newLayers[layers.length + 1]));
      }}
      disabled={layers.length >= 2}
    >
      {capitalize(t('add layer'))}
    </Button>,
  ];

  return (
    <Form
      controls={controls}
      onSubmit={(fields: any) =>
        dispatch(updateLocation({ long: fields.long, lat: fields.lat }))
      }
    />
  );
}

export default withTranslation()(InterativeMapDemo);
