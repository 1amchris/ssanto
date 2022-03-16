import { capitalize } from 'lodash';
import { withTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import {
  selectAnalysis,
  setError,
  setLoading,
  studyAreaReceived,
} from 'store/reducers/analysis';
import Form from 'components/forms/Form';
import { Control, Button, Spacer } from 'components/forms/components';
import * as Utils from 'utils';
import { call } from 'store/middlewares/ServerMiddleware';

function StudyArea({ t }: any) {
  const property = 'studyArea';
  const selector = useAppSelector(selectAnalysis);
  const properties = selector.properties[property];
  const dispatch = useAppDispatch();

  const getErrors = selector.properties['studyAreaError'];
  const isLoading = selector.properties['studyAreaLoading'];

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
      accept=".shp, .shx"
      multiple
      required
      tooltip={t('the selected files will ...')}
    />,
    <Spacer />,
    <Button variant="outline-primary" type="submit" loading={isLoading}>
      {capitalize(t('apply'))}
    </Button>,
    <Button variant="outline-danger" type="reset">
      {capitalize(t('reset'))}
    </Button>,
  ];

  return (
    <Form
      disabled={isLoading}
      controls={controls}
      errors={getErrors}
      onSubmit={(fields: any) => {
        Utils.extractContentFromFiles(Array.from(fields.files)).then(files => {
          dispatch(
            call({
              target: 'study_area.files',
              args: [
                ...files.map(file => ({
                  name: file.name,
                  content: file.base64content,
                })),
              ],
              successAction: studyAreaReceived,
              failureAction: setError,
              failureData: property,
            })
          );
        });
        dispatch(setLoading({ params: property, data: true }));
      }}
    />
  );
}

export default withTranslation()(StudyArea);
