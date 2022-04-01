import React from 'react';
import { capitalize } from 'lodash';
import { withTranslation } from 'react-i18next';
import { call } from 'store/reducers/server';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import {
  analysisSuccess,
  injectSetErrorCreator,
  injectSetLoadingCreator,
  selectAnalysis,
} from 'store/reducers/analysis';
import { Button } from 'components/forms/components';
import CallModel from 'models/server-coms/CallModel';
import ServerCallTargets from 'enums/ServerCallTargets';
import LoadingValue from 'models/LoadingValue';

function FormsBar({ children, className, t }: any, key?: string) {
  const closeOverlay = () => document.body.click();
  const selector = useAppSelector(selectAnalysis);
  const dispatch = useAppDispatch();

  const isLoading = selector.properties.analysisLoading;
  const error = selector.properties.analysisError;

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
            tooltipHeader={capitalize(t('Confirm action'))}
            tooltip={
              <div onClick={closeOverlay}>
                <p className="d-flex flex-wrap border-bottom pb-4">
                  This action will require recomputation, which in turn will
                  take time. Any unsaved results will be overwritten by this
                  operation. <br /> Proceed anyway?
                </p>
                <Button
                  variant="outline-primary"
                  className="mb-2"
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
                        onSuccessAction: analysisSuccess,
                        onErrorAction: injectSetErrorCreator('analysis'),
                      } as CallModel<void, { file_name: string; analysis_data: string }, void, string, string>)
                    );
                  }}
                  loading={isLoading}
                  disabled={isLoading}
                >
                  {capitalize(t('proceed'))}
                </Button>
                <Button
                  variant="danger"
                  onClick={() => console.log('canceled!')}
                  disabled={isLoading}
                >
                  {capitalize(t('cancel'))}
                </Button>
              </div>
            }
            tooltipTrigger={'click'}
            tooltipPlacement="top"
            variant="primary"
            disabled={isLoading}
            loading={isLoading}
          >
            {capitalize(t('compute suitability'))}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default withTranslation()(FormsBar);
