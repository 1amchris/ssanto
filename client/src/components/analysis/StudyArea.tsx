import React from 'react';
import { capitalize } from 'lodash';
import { withTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { selectAnalysis, sendProperties } from 'store/reducers/analysis';
import Form from 'components/form/Form';
import { Control, Button, Spacer } from 'components/form/form-components';
import { useEffectOnce } from 'hooks';
import * as Utils from 'utils';

function StudyArea({ t }: any) {
  const property = 'studyArea';
  const properties = useAppSelector(selectAnalysis).properties[property];
  const dispatch = useAppDispatch();

  const getErrors = () => Utils.getErrors(Object.values(properties));
  const isLoading = () => Utils.isLoading(Object.values(properties));

  useEffectOnce(() => {
    Utils.generateSubscriptions(dispatch, property, Object.keys(properties));
  });

  const controls = [
    <Control
      visuallyHidden={!properties?.fileName?.value}
      label="selected file"
      value={`${properties?.fileName?.value}.shp`}
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
    <Button variant="outline-primary" type="submit" loading={isLoading()}>
      {capitalize(t('apply'))}
    </Button>,
    <Button variant="outline-danger" type="reset">
      {capitalize(t('reset'))}
    </Button>,
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

export default withTranslation()(StudyArea);
