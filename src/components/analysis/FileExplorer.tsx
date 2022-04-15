import React from 'react';
import { capitalize } from 'lodash';
import { ReactElement } from 'react';
import { withTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import Form from 'components/forms/Form';
import { Control, Button, Spacer, List } from 'components/forms/components';
import { FactoryProps } from 'components/forms/components/FormExpandableList';
import { Badge } from 'react-bootstrap';
import { call } from 'store/reducers/server';
import FilesUtils from 'utils/files-utils';
import {
  injectSetLoadingCreator,
  injectSetErrorCreator,
  selectAnalysis,
} from 'store/reducers/analysis';
import FileMetadataModel from 'models/file/FileMetadataModel';
import CallModel from 'models/server-coms/CallModel';
import LoadingValue from 'models/LoadingValue';
import ServerCallTargets from 'enums/ServerCallTargets';
import FileContentModel from 'models/file/FileContentModel';

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

/**
 * File explorer component.
 * Used to upload and visualise the files in the system.
 * @param {any} param0 Parameters for the file explorer.
 * @return {JSX.Element} Html.
 */
function FileExplorer({ t, disabled }: any) {
  const property = 'files';
  const selector = useAppSelector(selectAnalysis);
  const files = selector.properties[property];
  const dispatch = useAppDispatch();

  const getErrors = selector.properties.filesError;
  const isLoading = selector.properties.filesLoading;

  const controls = [
    <Control
      key="input-control"
      label="Select files"
      name="files"
      type="file"
      multiple
      required
      tooltip={capitalize(
        t('the selected files will be uploaded to the server for further use.')
      )}
    />,
    <Button key="add-button" variant="outline-primary" type="submit" loading={isLoading}>
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
              target: ServerCallTargets.FileManagerRemoveFile,
              args: [(files[index] as FileMetadataModel).name],
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
      disabled={isLoading || disabled}
      onSubmit={(fields: any) => {
        dispatch(
          injectSetLoadingCreator({
            value: property,
            isLoading: true,
          } as LoadingValue<string>)()
        );
        FilesUtils.extractContentFromFiles(Array.from(fields.files)).then(
          files =>
            dispatch(
              call({
                target: ServerCallTargets.FileManagerAddFiles,
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
