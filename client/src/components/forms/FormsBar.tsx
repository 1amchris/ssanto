import React, { useState } from 'react';
import { capitalize } from 'lodash';
import { withTranslation } from 'react-i18next';
import { call } from 'store/reducers/server';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import {
  injectSetErrorCreator,
  injectSetLoadingCreator,
  selectAnalysis,
} from 'store/reducers/analysis';
import { Button } from 'components/forms/components';
import CallModel from 'models/server-coms/CallModel';
import ServerCallTargets from 'enums/ServerCallTargets';
import LoadingValue from 'models/LoadingValue';
import { Modal } from 'react-bootstrap';

interface ModalModel {
  header: React.ReactElement | string | number;
  body: React.ReactElement | string | number;
  footer: React.ReactElement | string | number;
}

function VerticallyCenteredModal({ header, body, footer, ...props }: any) {
  return (
    <Modal {...props} aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header>
        <Modal.Title>{header}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>{footer}</Modal.Footer>
    </Modal>
  );
}

function FormsBar({ children, className, t }: any, key?: string) {
  const selector = useAppSelector(selectAnalysis);
  const dispatch = useAppDispatch();

  const isLoading = selector.properties.analysisLoading;
  const error = selector.properties.analysisError;

  const [showDialog, setShowDialog] = useState(false);

  const modalOptions = {
    header: capitalize(t('confirm action')),
    body: (
      <p className="d-flex flex-wrap">
        This action will require recomputation, which in turn will take time.
        Any unsaved results will be overwritten by this operation. <br />{' '}
        Proceed anyway?
      </p>
    ),
    footer: (
      <React.Fragment>
        <Button
          variant="outline-primary"
          loading={isLoading}
          disabled={isLoading}
          onClick={() => {
            dispatch(
              injectSetLoadingCreator({
                value: 'analysis',
                isLoading: true,
              } as LoadingValue<string>)()
            );
            dispatch(
              call({
                target: ServerCallTargets.ComputeSuitability,
                onErrorAction: injectSetErrorCreator('analysis'),
              } as CallModel<void, { file_name: string; analysis_data: string }, void, string, string>)
            );
            setShowDialog(false);
          }}
        >
          {capitalize(t('proceed'))}
        </Button>
        <Button variant="danger" onClick={() => setShowDialog(false)}>
          {capitalize(t('cancel'))}
        </Button>
      </React.Fragment>
    ),
    show: showDialog,
  };

  return (
    <div
      className="position-relative"
      style={{ height: 'calc(100vh - 24px)', width: '270px' }}
    >
      <nav
        key={key}
        style={{ paddingBottom: '4em' }}
        className={`h-100 border-end bg-light overflow-scroll ${className}`}
      >
        <ul className="list-unstyled m-3">
          {[].concat(children).map((child, index: number) => (
            <li
              key={`navigation/item-${index}`}
              className="pb-2 border-bottom mb-2"
            >
              {child}
            </li>
          ))}
        </ul>
      </nav>
      <div
        className="position-absolute bottom-0 border-top shadow-lg px-3 w-100"
        style={{ background: 'white' }}
      >
        <div className="py-3 w-100">
          <Button
            variant="primary"
            className="mb-2"
            onClick={() => {
              setShowDialog(true);
            }}
            loading={isLoading}
            disabled={isLoading}
          >
            {capitalize(t('analyze'))}
          </Button>
        </div>
      </div>

      <VerticallyCenteredModal {...modalOptions} />
    </div>
  );
}

export default withTranslation()(FormsBar);
