import { capitalize } from 'lodash';
import React, { ReactElement } from 'react';
import { withTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  addGeoFile,
  GeoFile,
  selectAnalysis,
  sendProperties,
  updateGeodatabase,
} from '../../store/reducers/analysis';
import Form from '../form/Form';
import { Control, Button, Spacer, List } from '../form/form-components';
import * as Utils from 'utils';
import { useEffectOnce } from 'hooks';
import { FactoryProps } from 'components/form/form-components/FormExpandableList';
import { Badge } from 'react-bootstrap';
import { Properties } from 'store/models/Properties';

const importedFilesFactory = ({
  file,
  key,
}: FactoryProps): ReactElement | ReactElement[] => [
  <ul
    className="list-group list-group-horizontal"
    style={{ listStyleType: 'none' }}
    key={key('file')}
  >
    <li
      className="me-auto small"
      style={{
        width: '100px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {file.name}
    </li>
    <li>
      <Badge className=" bg-primary rounded-pill">{file.extention}</Badge>
    </li>
  </ul>,
];

function DataImportation({ t }: any) {
  const {
    geodatabase: { files },
  } = useAppSelector(selectAnalysis);

  //TODO humm pas génial
  const property = 'newGeoFile';
  const properties = useAppSelector(selectAnalysis).properties[property];
  const deletedGeoFileProperties =
    useAppSelector(selectAnalysis).properties['deletedGeoFile'];
  const dispatch = useAppDispatch();

  const getErrors = () => Utils.getErrors(Object.values(properties));
  const isLoading = () => Utils.isLoading(Object.values(properties));

  useEffectOnce(() => {
    Utils.generateSubscriptions(dispatch, property, Object.keys(properties));
    Utils.generateSubscriptions(
      dispatch,
      'deletedGeoFile',
      Object.keys(deletedGeoFileProperties)
    );
  });

  const onDeleteControl = (index: string) =>
    dispatch(
      sendProperties({
        property: 'deletedGeoFile',
        properties: { index: { index, isLoading: false } } as Properties,
      })
    );

  const controls = [
    <Control
      label="Geodatabase"
      name="files"
      type="file"
      accept=".shp, .shx"
      multiple
      required
      tooltip={t('the selected files will ...')}
    />,

    <Spacer />,
    <Button variant="outline-primary" type="submit" loading={isLoading()}>
      {capitalize(t('Add'))}
    </Button>,
    <Button variant="outline-danger" type="reset">
      {capitalize(t('reset'))}
    </Button>,
    <Spacer />,
    <List
      hideLabel
      key={`geofiles`}
      name={`geofiles`}
      label={'geofile'}
      onDeleteControl={onDeleteControl}
      factory={importedFilesFactory}
      controls={files?.map((file: GeoFile) => ({
        file,
        index: file.index,
      }))}
    />,
  ];

  return (
    <Form
      disabled={isLoading()}
      controls={controls}
      errors={getErrors()}
      onSubmit={(fields: any) =>
        dispatch(sendProperties({ property, properties: fields }))
      }
    />
  );
}

export default withTranslation()(DataImportation);
