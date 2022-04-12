import { capitalize } from 'lodash';
import { withTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import {
  selectAnalysis,
  injectSetErrorCreator,
  injectSetLoadingCreator,
} from 'store/reducers/analysis';
import Form from 'components/forms/Form';
import { Control, Button, Spacer, Select } from 'components/forms/components';
import { call } from 'store/reducers/server';
import ServerCallTargets from 'enums/ServerCallTargets';
import CallModel from 'models/server-coms/CallModel';
import LoadingValue from 'models/LoadingValue';
import { selectMap } from 'store/reducers/map';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import FileContentModel from 'models/file/FileContentModel';
import { exportData } from 'store/reducers/export';

function StudyArea({ t, disabled }: any) {
  const property = 'study_area';
  const selector = useAppSelector(selectAnalysis);
  const dispatch = useAppDispatch();
  const properties = selector.properties[property];
  const files = selector.properties['files'];
  let files_choices = [{ value: '', label: '' }];
  for (let i = 0; i < files.length; i += 1) {
    files_choices.push({ value: files[i].name, label: files[i].name });
  }

  const getErrors = selector.properties.study_areaError;
  const isLoading = selector.properties.study_areaLoading;

  const { layers } = useAppSelector(selectMap);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [fields, setfields] = useState(undefined);

  const onFormSubmit = (fields: any) => {
    setShowConfirmDialog(true);
    setfields(fields);
  };
  const dispatchStudyArea = (fields: any) => {
    dispatch(
      injectSetLoadingCreator({
        value: property,
        isLoading: true,
      } as LoadingValue<string>)()
    );

    dispatch(
      call({
        target: ServerCallTargets.UpdateStudyAreaFiles,
        args: [fields.study_area_file],
        onSuccessAction: injectSetLoadingCreator({
          value: property,
          isLoading: false,
        } as LoadingValue<string>),
        onErrorAction: injectSetErrorCreator(property),
      } as CallModel<string[], any, void, string, string>)
    );
    console.log('4');
  };
  const confirmActionModal = (fields: any) => {
    if (layers['analysis'] !== undefined) {
      return (
        <Modal show={showConfirmDialog} centered animation={false}>
          <Modal.Header>
            <Modal.Title>{capitalize(t('confirm action'))}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {
              <p className="d-flex flex-wrap">
                Do you want to save your current work before changing the study
                area?
              </p>
            }
          </Modal.Body>
          <Modal.Footer>
            {
              <React.Fragment>
                <Button
                  variant="outline-primary"
                  onClick={() => {
                    dispatch(
                      call({
                        target: ServerCallTargets.SaveProject,
                        onSuccessAction: exportData,
                        // TODO: There should probably be an "onErrorAction"
                      } as CallModel<void, FileContentModel<string>, void, string, string>)
                    );
                    dispatchStudyArea(fields);
                    setShowConfirmDialog(false);
                  }}
                >
                  {capitalize(t('save'))}
                </Button>
                <Button
                  variant="outline-secondary"
                  loading={isLoading}
                  disabled={isLoading}
                  onClick={() => {
                    dispatchStudyArea(fields);
                    setShowConfirmDialog(false);
                  }}
                >
                  {capitalize(t('proceed without saving'))}
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    setShowConfirmDialog(false);
                  }}
                >
                  {capitalize(t('cancel'))}
                </Button>
              </React.Fragment>
            }
          </Modal.Footer>
        </Modal>
      );
    } else if (showConfirmDialog) {
      dispatchStudyArea(fields);
      setShowConfirmDialog(false);
    }
  };
  const controls = [
    <Control
      visuallyHidden={!properties}
      label="selected file"
      value={`${properties}`}
      disabled
    />,
    <Select
      label="select study area"
      name="study_area_file"
      required
      defaultValue={properties}
      options={files_choices}
    />,
    <Spacer />,
    <Button variant="outline-primary" type="submit" loading={isLoading}>
      {capitalize(t('apply'))}
    </Button>,
  ];

  return (
    <div>
      <Form
        disabled={isLoading || disabled}
        controls={controls}
        errors={getErrors}
        onSubmit={(fields: any) => {
          onFormSubmit(fields);
        }}
      />
      {confirmActionModal(fields)}
    </div>
  );
}

export default withTranslation()(StudyArea);
