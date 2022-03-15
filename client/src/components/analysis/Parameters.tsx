import { capitalize } from 'lodash';
import React, { createRef, RefObject } from 'react';
import { Control, Spacer, Button } from 'components/forms/components';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { selectAnalysis, setError, setLoading } from 'store/reducers/analysis';
import { withTranslation } from 'react-i18next';
import Form from 'components/forms/Form';
import { useEffectOnce } from 'hooks';
import { call, subscribe } from 'store/middlewares/ServerMiddleware';

function Parameters({ t }: any) {
  const property = 'parameters';
  const selector = useAppSelector(selectAnalysis);
  const properties = selector.properties[property];
  const dispatch = useAppDispatch();

  const getErrors = selector.properties['parametersError'];
  const isLoading = selector.properties['parametersLoading'];

  useEffectOnce(() => {
    dispatch(subscribe({ subject: property }));
  });

  const cellSizeRef: RefObject<HTMLSpanElement> = createRef();
  const controls = [
    // <Control
    //   label="analysis name"
    //   name="analysis_name"
    //   defaultValue={properties.analysis_name}
    //   required
    //   tooltip={t('the analysis name will ...')}
    // />,
    // <Control
    //   label="name of the modeler"
    //   name="modeler_name"
    //   defaultValue={properties.modeler_name}
    //   required
    //   tooltip={t("the modeler's name will ...")}
    // />,
    <Control
      label="cell size"
      name="cell_size"
      suffix={
        <React.Fragment>
          <small className="me-1">x</small>
          <span ref={cellSizeRef}>{properties.cell_size}</span>m
        </React.Fragment>
      }
      onChange={({ target: { value } }: { target: HTMLInputElement }) => {
        if (cellSizeRef.current?.textContent)
          cellSizeRef.current.textContent = value;
      }}
      defaultValue={properties.cell_size}
      type="number"
      tooltip={t('the cell size is ...')}
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
      controls={controls}
      disabled={isLoading}
      errors={getErrors}
      onSubmit={(fields: any) => {
        dispatch(
          call({
            target: 'update',
            args: [property, { ...properties, ...fields }],
            successAction: setLoading,
            successData: property,
            failureAction: setError,
            failureData: property,
          })
        );
        dispatch(setLoading({ params: property, data: true }));
      }}
    />
  );
}

export default withTranslation()(Parameters);
