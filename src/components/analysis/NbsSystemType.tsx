import React, { useState } from 'react';
import { capitalize } from 'lodash';
import { withTranslation } from 'react-i18next';
import FormSelectOptionModel from 'models/form/FormSelectOptionModel';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import {
  selectAnalysis,
  injectSetErrorCreator,
  injectSetLoadingCreator,
} from 'store/reducers/analysis';
import Form from 'components/forms/Form';
import { Select, Button, Spacer } from 'components/forms/components';
import { call } from 'store/reducers/server';
import ServerCallTarget from 'enums/ServerCallTarget';
import LoadingValue from 'models/LoadingValue';
import CallModel from 'models/server-coms/CallModel';
import { Modal } from 'react-bootstrap';
import { selectMap } from 'store/reducers/map';
import { exportData } from 'store/reducers/export';
import FileContentModel from 'models/file/FileContentModel';

/**
 * @deprecated
 * Nbs system component.
 * @param {any} param0 Parameters for the nbs system.
 * @return {JSX.Element} Html.
 */
function NbsSystem({ t, disabled }: any) {
  const property = 'nbs_system';
  const selector = useAppSelector(selectAnalysis);
  const properties = selector.properties[property];
  const dispatch = useAppDispatch();

  const getErrors = selector.properties.nbs_systemError;
  const isLoading = selector.properties.nbs_systemLoading;

  const { layers } = useAppSelector(selectMap);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [fields, setFields] = useState(undefined);

  const dispatchSystemType = (fields: any) => {
    dispatch(
      injectSetLoadingCreator({
        value: property,
        isLoading: true,
      } as LoadingValue<string>)()
    );
    dispatch(
      call({
        target: ServerCallTarget.AnalysisUpdateParams,
        args: [property, fields],
        onSuccessAction: injectSetLoadingCreator({
          value: property,
          isLoading: false,
        } as LoadingValue<string>),
        onErrorAction: injectSetErrorCreator(property),
      } as CallModel<[string, Object], void, LoadingValue<string>, string, string>)
    );
  };

  const confirmActionModal = (
    <Modal show={showConfirmDialog} centered animation={false}>
      <Modal.Header>
        <Modal.Title>{capitalize(t('confirm action'))}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="d-flex flex-wrap">
          Do you want to save your current work before changing the nbs system?
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
            dispatchSystemType(fields);
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
            dispatchSystemType(fields);
            setShowConfirmDialog(false);
          }}
        >
          {capitalize(t('proceed without saving'))}
        </Button>
        <Button
          variant="danger"
          loading={isLoading}
          disabled={isLoading}
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
    <Select
      key="nbs-select"
      label="NBS system type"
      name="system_type"
      defaultValue={properties.system_type}
      options={
        [
          { value: '0', label: 'raingardens & bioretention systems' },
          { value: '1', label: 'rain tanks' },
          { value: '2', label: 'infiltration systems' },
          { value: '3', label: 'green roofs' },
          { value: '4', label: 'swales' },
          { value: '5', label: 'ponds & lakes' },
          { value: '6', label: 'constructed wetlands' },
        ] as FormSelectOptionModel[]
      }
      tooltip={t('the selected NBS system type ...')}
    />,
    <Spacer key="nbs-spacer" />,
    <Button
      key="nbs-submit-button"
      variant="outline-primary"
      type="submit"
      loading={isLoading}
    >
      {capitalize(t('apply'))}
    </Button>,
    <Button key="nbs-reset-button" variant="outline-danger" type="reset">
      {capitalize(t('reset'))}
    </Button>,
  ];

  return (
    <React.Fragment>
      <Form
        controls={controls}
        errors={getErrors}
        disabled={isLoading || disabled}
        onSubmit={(fields: any) => {
          if (
            layers?.analysis &&
            layers?.analysis['current analysis'] !== undefined
          ) {
            setFields(fields);
            setShowConfirmDialog(true);
          } else {
            dispatchSystemType(fields);
          }
        }}
      />
      {confirmActionModal}
    </React.Fragment>
  );
}

export default withTranslation()(NbsSystem);
