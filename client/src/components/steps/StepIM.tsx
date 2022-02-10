import { capitalize, template } from 'lodash';
import React, { useState } from 'react';
import { Control, Select, Spacer, Button } from '../form/form-components';
import FormSelectOptionModel from '../../models/form-models/FormSelectOptionModel';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addLayer, Layer, selectMap, updateLocation } from '../../store/reducers/map';
import { withTranslation } from 'react-i18next';
import Form from '../form/Form';
import { selectAnalysis, setParameters } from '../../store/reducers/analysis';

//Importation des données à effacer, juste pour démo
import ev from '../../data/espace_vert.json';
import lh from '../../data/limite_h.json';

function StepIM({ t }: any) {
    const {
        location: locationJSON,
        clickedCoord,
        zoom,
      } = useAppSelector(selectMap);
      const { parameters: source } = useAppSelector(selectAnalysis);

      const dispatch = useAppDispatch();
      const location = JSON.parse(locationJSON) as { long: string; lat: string };

      const [tempLongLat, setTempLongLat] = useState({lat: NaN, long: NaN});


      //Fonction à effacer, juste pour démo
  const changeLayer = (nb: number) => (_event: any) => {
    switch (nb) {
      case 1:
        let l1: Layer = { name: 'layer1', data: ev };
        dispatch(addLayer(l1));
        break;
      case 2:
        let l2: Layer = { name: 'layer2', data: lh };
        dispatch(addLayer(l2));
        break;
      case 3:
        let l3: Layer = { name: 'layer3', data: '' };
        dispatch(addLayer(l3));
        break;
      case 4:
        let l4: Layer = { name: 'layer4', data: '' };
        dispatch(addLayer(l4));
        break;
      default:
        break;
    }
  };

  const controls = [
    <Control
      label="Center: Lat"
      name="center_lat"
      defaultValue={location.lat}
      onChange={({ target: { value } }: any) =>
      setTempLongLat({ long:tempLongLat.long , lat: value})
    }
      required
    />,
    <Control
    label="Center: Long"
    name="center_long"
    defaultValue={location.long}
    onChange={({ target: { value } }: any) =>{
    setTempLongLat({ long: value, lat: tempLongLat.lat  })
}
    }
    required
  />,
  <Button className="btn-primary w-50" 
  onClick={() =>dispatch(updateLocation({ long: +tempLongLat.long, lat: +tempLongLat.lat }))}
  >{capitalize(t('Update center')) }
  </Button>,

  <Spacer/>,
  <Button className="btn-primary w-100" onClick={changeLayer(1)} >{capitalize(t('Add layer 1')) }</Button>,
  <Button className="btn-primary w-100" onClick={changeLayer(2)} >{capitalize(t('Add layer 2')) }</Button>,
  ];

  return (
      <div>
    <p>
    Lat: {(JSON.parse(clickedCoord)).lat}<br/> 
    Long: {(JSON.parse(clickedCoord)).long}</p>

    <Form
      controls={controls}
      store={source}
      onSubmit={(fields: any) => dispatch(setParameters(fields))}
    />
    </div>

  );
}

export default withTranslation()(StepIM);
