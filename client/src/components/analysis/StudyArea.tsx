import { capitalize } from 'lodash';
import { withTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import {
  selectAnalysis,
  injectSetErrorCreator,
  injectSetLoadingCreator,
  studyAreaReceived,
} from 'store/reducers/analysis';
import Form from 'components/forms/Form';
import { Control, Button, Spacer } from 'components/forms/components';
import { call } from 'store/reducers/server';
import ServerCallTargets from 'enums/ServerCallTargets';
import CallModel from 'models/server-coms/CallModel';
import FileContentModel from 'models/file-models/FileContentModel';
import LoadingValue from 'models/LoadingValue';
import FilesUtils from 'utils/files-utils';

function StudyArea({ t }: any) {
  const property = 'studyArea';
  const selector = useAppSelector(selectAnalysis);
  const properties = selector.properties[property];
  const dispatch = useAppDispatch();

  const getErrors = selector.properties.studyAreaError;
  const isLoading = selector.properties.studyAreaLoading;

  const controls = [
    <Control
      visuallyHidden={!properties?.fileName}
      label="selected file"
      value={`${properties?.fileName}`}
      disabled
    />,
    <Control
      label="select study area"
      name="files"
      type="file"
      accept=".shp, .shx, .cpg, .dbf, .prj, .dbs"
      multiple
      required
      tooltip={t('the selected files will ...')}
    />,
    <Spacer />,
    <Button variant="outline-primary" type="submit" loading={isLoading}>
      {capitalize(t('apply'))}
    </Button>,
  ];

  return (
    <Form
      disabled={isLoading}
      controls={controls}
      errors={getErrors}
      onSubmit={(fields: any) => {
        dispatch(
          injectSetLoadingCreator({
            value: property,
            isLoading: true,
          } as LoadingValue<string>)()
        );
        FilesUtils.extractContentFromFiles(Array.from(fields.files)).then(files => {
          dispatch(
            call({
              target: ServerCallTargets.UpdateStudyAreaFiles,
              args: files,
              onSuccessAction: studyAreaReceived,
              onFailureAction: injectSetErrorCreator(property),
            } as CallModel<FileContentModel<string>[], any, void, string, string>)
          );
        });
      }}
    />
  );
}

export default withTranslation()(StudyArea);
