import { capitalize } from 'lodash';
import React, { ReactElement } from 'react';
import { withTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import Form from 'components/forms/Form';
import { Control, Button, Spacer, List } from 'components/forms/components';
import { FactoryProps } from 'components/forms/components/FormExpandableList';
import { Badge } from 'react-bootstrap';
import { call } from 'store/reducers/server';
import Utils from 'utils';
import {
  injectSetLoadingCreator,
  injectSetErrorCreator,
  selectAnalysis,
} from 'store/reducers/analysis';
import FileMetadataModel from 'models/file-models/FileMetadataModel';
import CallModel from 'models/server-coms/CallModel';
import LoadingValue from 'models/LoadingValue';
import ServerTargets from 'enums/ServerTargets';
import FileContentModel from 'models/file-models/FileContentModel';

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
        {file.stem}
      </span>
      <span className="d-inline-block">
        <Badge bg="primary" pill>
          .{file.extension}
        </Badge>
      </span>
    </div>
  </div>
);

function FileExplorer({ t }: any) {
  const property = 'files';
  const selector = useAppSelector(selectAnalysis);
  const files = selector.properties[property];
  const dispatch = useAppDispatch();

  const getErrors = selector.properties.filesError;
  const isLoading = selector.properties.filesLoading;

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
        onDeleteControl={(index: number) => {
          dispatch(
            injectSetLoadingCreator({
              value: property,
              isLoading: true,
            } as LoadingValue<string>)()
          );
          dispatch(
            call({
              target: ServerTargets.FileManagerRemoveFile,
              args: [(files[index] as FileMetadataModel).id],
              onSuccessAction: injectSetLoadingCreator({
                value: property,
                isLoading: false,
              } as LoadingValue<string>),
              onErrorAction: injectSetErrorCreator(property),
            } as CallModel<[string], void, LoadingValue<string>, string, string>)
          );
        }}
        controls={files?.map((file: any) => ({
          file,
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
        dispatch(
          injectSetLoadingCreator({
            value: property,
            isLoading: true,
          } as LoadingValue<string>)()
        );
        Utils.extractContentFromFiles(Array.from(fields.files)).then(files =>
          dispatch(
            call({
              target: ServerTargets.FileManagerAddFiles,
              args: files,
              onSuccessAction: injectSetLoadingCreator({
                value: property,
                isLoading: false,
              } as LoadingValue<string>),
              onErrorAction: injectSetErrorCreator(property),
            } as CallModel<FileContentModel<string>[], void, LoadingValue<string>, string, string>)
          )
        );
      }}
    />
  );
}

export default withTranslation()(FileExplorer);
