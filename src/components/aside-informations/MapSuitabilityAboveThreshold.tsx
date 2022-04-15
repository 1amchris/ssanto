import { selectMap } from 'store/reducers/map';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import React from 'react';
import { Button, Control, Spacer } from 'components/forms/components';
import Form from 'components/forms/Form';
import { capitalize, round } from 'lodash';
import { withTranslation } from 'react-i18next';
import { call } from 'store/reducers/server';
import ServerCallTargets from 'enums/ServerCallTargets';
import CallModel from 'models/server-coms/CallModel';

function MapSuitabilityAboveThreshold({ t }: any) {
  const { suitabilityAboveThreshold, suitabilityThreshold } =
    useAppSelector(selectMap);
  const dispatch = useAppDispatch();

  /* eslint-disable react/jsx-key */
  const controls = [
    suitabilityAboveThreshold && (
      <Control
        label={`suitability above: ${suitabilityThreshold}%`}
        value={`${round(suitabilityAboveThreshold * 100, 2)}%`}
        disabled
      />
    ),
    <Control
      label="suitability threshold"
      name="suitability_threshold"
      suffix={'%'}
      defaultValue={suitabilityThreshold}
      type="number"
      min="0"
      max="100"
      tooltip={t('the suitability threshold is ...')}
    />,
    <Spacer />,
    <Button
      variant="outline-primary"
      type="submit"
      // loading={isLoading}
    >
      {capitalize(t('apply'))}
    </Button>,
  ];

  const rows = [
    suitabilityAboveThreshold && (
      <Form
        controls={controls}
        onSubmit={(fields: any) => {
          dispatch(
            call({
              target: ServerCallTargets.UpdateSuitabilityThreshold,
              args: [fields.suitability_threshold],
            } as CallModel<[number]>)
          );
        }}
      />
    ),
  ];
  /* eslint-enable react/jsx-key */

  return (
    <React.Fragment>
      {rows.map((row: any, index: number) => (
        <div key={`${index}`} className="mb-2">
          {row}
        </div>
      ))}
    </React.Fragment>
  );
}

export default withTranslation()(MapSuitabilityAboveThreshold);
