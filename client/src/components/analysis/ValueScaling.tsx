import { createRef, Factory, ReactElement, RefObject, useState } from 'react';
import { capitalize, keyBy } from 'lodash';
import { withTranslation } from 'react-i18next';
import FormSelectOptionModel from '../../models/form/FormSelectOptionModel';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import objectivesData from '../../data/objectives.json';

import { selectAnalysis } from '../../store/reducers/analysis';
import React from 'react';
import { findByDisplayValue } from '@testing-library/react';
import {
  Button,
  Control,
  List,
  ScalingGraph,
  SimpleList,
  Spacer,
} from 'components/forms/components';
import { FactoryProps } from 'components/forms/components/FormList';
import Collapsible from 'components/Collapsible';
import Form from 'components/forms/Form';

function ValueScaling({ t, disabled }: any) {
  const property = 'value_scaling';
  const selector = useAppSelector(selectAnalysis);
  const valueScaling = selector.properties.value_scaling;
  const dispatch = useAppDispatch();
  const files = selector.properties['files'];

  const getErrors = selector.properties.valueScalingError;
  const isLoading = selector.properties.valueScalingLoading;

  const [localValueScaling, setLocalValueScaling] = useState(valueScaling);
  let controls = [];
  if (!(valueScaling === undefined) && valueScaling.length > 0) {
    const continuousScalingBox = ({
      key,
      attributeIndex,
      min,
      max,
    }: FactoryProps) => [
      <Control
        key={key('continuous')}
        label="value scaling function"
        name="continuous"
        defaultValue={valueScaling[attributeIndex].properties}
        required
        prefix={
          <React.Fragment>
            <small className="me-1">y =</small>
          </React.Fragment>
        }
        tooltip={t('')}
      />,
      <ScalingGraph
        key={key('scaling_graph')}
        index={attributeIndex}
        min={min}
        max={max}
        value_scaling_function={
          //valueScaling[attributeIndex].properties.function
          'x'
        }
      />,
    ];

    const categoricalRowFactory = ({
      key,
      attributeIndex,
      category,
      categoryIndex,
      value,
    }: FactoryProps): ReactElement | ReactElement[] => {
      const valueRef: RefObject<HTMLSpanElement> = createRef();
      return [
        <Control
          key={key('categorical_row')}
          label={category}
          className="small position-relative d-flex"
          defaultValue={value}
          onChange={({ target: { value } }: { target: HTMLInputElement }) => {
            if (valueRef.current?.textContent) {
              valueRef.current.textContent = value;
            }
          }}
          type="number"
        />,
      ];
    };

    const categoricalScalingBox = ({
      key,
      attributeIndex,
      categories,
      values,
    }: FactoryProps) => (
      <SimpleList
        key={key('categorical')}
        name={'weights'}
        hideLabel
        factory={categoricalRowFactory}
        controls={categories.map((category: any, index: number) => ({
          category,
          value: values[index],
          categoryIndex: index,
          attributeIndex,
        }))}
      />
    );

    const ScalingBoxFactory = ({
      attribute,
      type,
      properties,
      attributeIndex,
      key,
    }: FactoryProps): ReactElement | ReactElement[] => (
      <Collapsible key={key('scalingBox')} title={attribute} collapsed>
        {type == 'Continuous'
          ? continuousScalingBox({ key, attributeIndex, ...properties })
          : categoricalScalingBox({ key, attributeIndex, ...properties })}
      </Collapsible>
    );

    const mainControls =
      localValueScaling.length > 0
        ? [
            <SimpleList
              key={'attributes_vs' + isLoading}
              name={'attributes_vs'}
              hideLabel
              factory={ScalingBoxFactory}
              controls={localValueScaling.map((value: any, index: number) => ({
                attribute: value.attribute,
                type: value.type,
                properties: value.properties,
                attributeIndex: index,
              }))}
            />,
          ]
        : [];
    controls = [
      ...mainControls,
      <Spacer />,
      <Button variant="outline-primary" loading={isLoading}>
        {capitalize(t('apply'))}
      </Button>,
    ];
  } else {
    controls = [<></>];
  }

  return (
    <Form
      controls={controls}
      errors={getErrors}
      disabled={isLoading || disabled}
      key={'weight_form'}
      onSubmit={() => {}}
    />
  );
}

export default withTranslation()(ValueScaling);
