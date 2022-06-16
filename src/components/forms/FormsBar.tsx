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
import ServerCallTarget from 'enums/ServerCallTarget';
import LoadingValue from 'models/LoadingValue';
import { Modal } from 'react-bootstrap';

/**
 * Forms bar component.
 * @param {any} param0 Parameters for the forms bar.
 * @param {string} [key] Key name
 * @return {JSX.Element} Html.
 */
function FormsBar({ children, className, t }: any, key?: string) {
  const selector = useAppSelector(selectAnalysis);
  const dispatch = useAppDispatch();

  const isLoading = selector.properties.analysisLoading;

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const confirmActionModal = (
    <Modal show={showConfirmDialog} centered animation={false}>
      <Modal.Header>
        <Modal.Title>{capitalize(t('confirm action'))}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {
          <p className="d-flex flex-wrap">
            This action will require recomputation, which in turn will take
            time. Any unsaved results will be overwritten by this operation.{' '}
            <br /> Proceed anyway?
          </p>
        }
      </Modal.Body>
      <Modal.Footer>
        {
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
                    target: ServerCallTarget.AnalysisComputeSuitability,
                    onErrorAction: injectSetErrorCreator('analysis'),
                  } as CallModel<void, { file_name: string; analysis_data: string }, void, string, string>)
                );
                setShowConfirmDialog(false);
              }}
            >
              {capitalize(t('proceed'))}
            </Button>
            <Button
              variant="danger"
              onClick={() => setShowConfirmDialog(false)}
            >
              {capitalize(t('cancel'))}
            </Button>
          </React.Fragment>
        }
      </Modal.Footer>
    </Modal>
  );

  return (
    <div
      className="position-relative"
      style={{ height: 'calc(100vh - 24px - 22px)', width: '100%' }}
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
              setShowConfirmDialog(true);
            }}
            loading={isLoading}
            disabled={isLoading}
          >
            {capitalize(t('analyze'))}
          </Button>
        </div>
      </div>

      {confirmActionModal}
    </div>
  );
}

export default withTranslation()(FormsBar);
