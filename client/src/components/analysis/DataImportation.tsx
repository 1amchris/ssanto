import { capitalize } from 'lodash';
import React, { ReactElement } from 'react';
import { withTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectAnalysis } from '../../store/reducers/analysis';
import Form from '../form/Form';
import { Control, Button, Spacer, List } from '../form/form-components';
import { useEffectOnce } from 'hooks';
import { FactoryProps } from 'components/form/form-components/FormExpandableList';
import { Badge } from 'react-bootstrap';

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

  const property = 'newGeoFile';
  const properties = ''; //useAppSelector(selectAnalysis).properties[property];

  const dispatch = useAppDispatch();

  const getErrors = ''; //() => Utils.getErrors(Object.values(properties));
  const isLoading = false; //() => Utils.isLoading(Object.values(properties));

  useEffectOnce(() => {
    /*Utils.generateSubscriptions(dispatch, property, Object.keys(properties));
    dispatch(
      subscribe({
        subject: 'file_manager.files',
        callback: (store: Store) => (data: any) => {
          dispatch(updateGeoDataBase(data));
        },
      })
    );*/
  });

  const onDeleteControl = (index: string) => {}; //dispatch(deleteFile({ index }));

  const controls = [
    <Control
      label="Geodatabase"
      name="files"
      type="file"
      accept=".shp, .shx"
      multiple
      required
      tooltip={capitalize(
        t('the selected files will be uploaded to the server for further use.')
      )}
    />,
    <Spacer />,
    <Button variant="outline-primary" type="submit" loading={isLoading}>
      {capitalize(t('add'))}
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
      controls={files?.map((file: any) => ({
        file,
        index: file.id,
      }))}
    />,
  ];

  return (
    <Form
      disabled={isLoading}
      controls={controls}
      errors={getErrors}
      onSubmit={
        (fields: any) => {} //dispatch(sendProperties({ property, properties: fields }))
      }
    />
  );
}

export default withTranslation()(DataImportation);