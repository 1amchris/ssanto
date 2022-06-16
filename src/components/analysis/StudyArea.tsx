import React, { useState } from 'react';
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
import ServerCallTarget from 'enums/ServerCallTarget';
import CallModel from 'models/server-coms/CallModel';
import LoadingValue from 'models/LoadingValue';
import { selectMap } from 'store/reducers/map';
import { Modal } from 'react-bootstrap';
import FileContentModel from 'models/file/FileContentModel';
import { exportData } from 'store/reducers/export';

/**
 * Study area component.
 * @param {any} param0 Parameters for the study area.
 * @return {JSX.Element} Html.
 */
function StudyArea({ t, disabled }: any) {
  const property = 'study_area';
  const selector = useAppSelector(selectAnalysis);
  const dispatch = useAppDispatch();
  const properties = selector.properties[property];
  const files = selector.properties['files'];
  const filesChoices = [{ value: '', label: '' }];
  for (let i = 0; i < files.length; i += 1) {
    filesChoices.push({ value: files[i].name, label: files[i].name });
  }

  const getErrors = selector.properties.study_areaError;
  const isLoading = selector.properties.study_areaLoading;

  const { layers } = useAppSelector(selectMap);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [fields, setFields] = useState(undefined);

  const dispatchStudyArea = (fields: any) => {
    dispatch(
      injectSetLoadingCreator({
        value: property,
        isLoading: true,
      } as LoadingValue<string>)()
    );
    dispatch(
      call({
        target: ServerCallTarget.AnalysisUpdateStudyAreaFiles,
        args: [fields.study_area_file],
        onSuccessAction: injectSetLoadingCreator({
          value: property,
          isLoading: false,
        } as LoadingValue<string>),
        onErrorAction: injectSetErrorCreator(property),
      } as CallModel<string[], any, void, string, string>)
    );
  };

  const confirmActionModal = (
    <Modal show={showConfirmDialog} centered animation={false}>
      <Modal.Header>
        <Modal.Title>{capitalize(t('confirm action'))}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="d-flex flex-wrap">
          Do you want to save your current work before changing the study area?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-primary"
          onClick={() => {
            dispatch(
              call({
                target: ServerCallTarget.AnalysisSaveProject,
                onSuccessAction: exportData,
                // TODO: There should probably be an "onErrorAction"
              } as CallModel<void, FileContentModel<string>>)
            );
            dispatchStudyArea(fields);
            setShowConfirmDialog(false);
          }}
        >
          {capitalize(t('save'))}
        </Button>
        <Button
          variant="outline-danger"
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
      </Modal.Footer>
    </Modal>
  );

  const controls = [
    <Control
      key="study-area-control"
      visuallyHidden={!properties}
      label="selected file"
      value={`${properties}`}
      disabled
    />,
    <Select
      key="study-area-select"
      label="select study area"
      name="study_area_file"
      tooltip="Some tooltip"
      required
      defaultValue={properties}
      options={filesChoices}
    />,
    <Spacer key="spacer" />,
    <Button
      key="apply"
      variant="outline-primary"
      type="submit"
      loading={isLoading}
    >
      {capitalize(t('apply'))}
    </Button>,
  ];

  return (
    <React.Fragment>
      <Form
        disabled={isLoading || disabled}
        controls={controls}
        errors={getErrors}
        onSubmit={(fields: any) => {
          if (
            layers?.analysis &&
            layers?.analysis['current analysis'] !== undefined
          ) {
            setFields(fields);
            setShowConfirmDialog(true);
          } else {
            dispatchStudyArea(fields);
          }
        }}
      />
      {confirmActionModal}
    </React.Fragment>
  );
}

export default withTranslation()(StudyArea);
