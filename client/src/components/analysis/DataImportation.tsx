import { capitalize } from 'lodash';
import React, { ReactElement } from 'react';
import { withTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import Form from '../form/Form';
import { Control, Button, Spacer, List } from '../form/form-components';
import { FactoryProps } from 'components/form/form-components/FormExpandableList';
import { Badge } from 'react-bootstrap';
import { call, subscribe } from 'store/middlewares/ServerMiddleware';
import * as Utils from 'utils';
import { setLoading, setError, selectAnalysis } from 'store/reducers/analysis';
import { useEffectOnce } from 'hooks';
import FileMetadataModel from 'models/FileMetadataModel';

const FileRowFactory = ({
  file,
  key,
}: FactoryProps): ReactElement | ReactElement[] => (
  <div
    key={key('file')}
    className=" small position-absolute top-50 w-100"
    style={{ transform: 'translateY(-50%)' }}
  >
    <div className="position-relative d-flex justify-content-between">
      <span className="d-block-inline text-truncate text-nowrap">
        {file.name}
      </span>
      <span className="d-inline-block">
        <Badge bg="primary" pill>
          .{file.extension}
        </Badge>
      </span>
    </div>
  </div>
);

function DataImportation({ t }: any) {
  const property = 'files';
  const selector = useAppSelector(selectAnalysis);
  const files = selector.properties[property];
  const dispatch = useAppDispatch();

  const getErrors = selector.properties['filesError'];
  const isLoading = selector.properties['filesLoading'];

  useEffectOnce(() => {
    dispatch(subscribe({ subject: property }));
  });

  const controls = [
    <Control
      label="Select files"
      name="files"
      type="file"
      multiple
      required
      tooltip={capitalize(
        t('the selected files will be uploaded to the server for further use.')
      )}
    />,
    <Button variant="outline-primary" type="submit">
      {capitalize(t('add'))}
    </Button>,
    files?.length > 0 && <Spacer />,
    files?.length > 0 && (
      <List
        key={'files'}
        name={'files'}
        label={'existing files'}
        factory={FileRowFactory}
        onDeleteControl={(index: number) =>
          dispatch(
            call({
              target: 'file_manager.remove_file',
              args: [(files[index] as FileMetadataModel).id],
              successAction: setLoading,
              successData: property,
              failureAction: setError,
              failureData: property,
            })
          )
        }
        controls={files?.map((file: any) => ({
          file,
          index: file.id,
        }))}
      />
    ),
  ];

  return (
    <Form
      controls={controls}
      errors={getErrors}
      disabled={isLoading}
      onSubmit={(fields: any) => {
        Utils.extractContentFromFiles(Array.from(fields.files)).then(files =>
          dispatch(
            call({
              target: 'file_manager.add_files',
              args: [
                ...files.map(file => ({
                  name: file.name,
                  content: file.base64content,
                })),
              ],
              successAction: setLoading,
              successData: property,
              failureAction: setError,
              failureData: property,
            })
          )
        );
        dispatch(setLoading({ params: property, data: true }));
      }}
    />
  );
}

export default withTranslation()(DataImportation);
