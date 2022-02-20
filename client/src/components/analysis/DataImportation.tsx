import { capitalize } from 'lodash';
import React, { ReactElement } from 'react';
import { withTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  addGeoFile,
  selectAnalysis,
  updateGeodatabase,
  updateStudyArea,
} from '../../store/reducers/analysis';
import Form from '../form/Form';
import {
  Control,
  Button,
  Spacer,
  ExpandableList,
  FileList,
  Select,
} from '../form/form-components';

function DataImportation({ t }: any) {
  const dispatch = useAppDispatch();
  const {
    geodatabase: { files },
  } = useAppSelector(selectAnalysis);

  const controls = [
    <Control
      label="Geodatabase"
      name="file"
      type="file"
      accept=".shp,.json, .geojson"
      multiple
      onChange={console.log('hello')}
    />,
    <Button className="w-100 btn-primary">{capitalize(t('Add'))}</Button>,
    <Spacer />,
    <FileList
      hideLabel
      key={`geofiles`}
      name={`geofiles`}
      label={'geofile'}
      geoFiles={files}
    >
      {' '}
    </FileList>,
  ];

  return (
    <Form
      controls={controls}
      onSubmit={(fields: any) => dispatch(addGeoFile('newFile'))}
    />
  );
}

export default withTranslation()(DataImportation);
