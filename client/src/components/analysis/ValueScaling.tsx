import { createRef, ReactElement, RefObject, useState } from 'react';
import { capitalize } from 'lodash';
import { withTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

import {
  injectSetErrorCreator,
  injectSetLoadingCreator,
  selectAnalysis,
} from '../../store/reducers/analysis';
import React from 'react';
import {
  Button,
  Control,
  ScalingGraph,
  SimpleList,
  Spacer,
} from 'components/forms/components';
import { FactoryProps } from 'components/forms/components/FormList';
import Collapsible from 'components/Collapsible';
import Form from 'components/forms/Form';
import ValueScalingModel from 'models/ValueScalingModel';
import LoadingValue from 'models/LoadingValue';
import { call } from 'store/reducers/server';
import ServerTargets from 'enums/ServerTargets';
import CallModel from 'models/server-coms/CallModel';

function ValueScaling({ t }: any) {
  const property = 'value_scaling';
  const selector = useAppSelector(selectAnalysis);
  const valueScaling = selector.properties[property] as ValueScalingModel[];

  const dispatch = useAppDispatch();

  const getErrors = selector.properties.valueScalingError;
  const isLoading = selector.properties.valueScalingLoading;

  const [localValueScaling, setLocalValueScaling] = useState(valueScaling);

  console.log('VALUE SCALING', localValueScaling);
  let controls = [];
  if (!(localValueScaling === undefined) && localValueScaling.length > 0) {
    const onChangeValueScalingFunction =
      (attributeIndex: number) => (e: any) => {
        e.persist();
        let newFunction = e.target.value;
        console.log(newFunction);

        let newValueScaling = JSON.parse(
          JSON.stringify(localValueScaling)
        ) as typeof localValueScaling;
        newValueScaling[attributeIndex].properties.vs_function = newFunction;
        setLocalValueScaling(newValueScaling);
      };
    const continuousScalingBox = ({
      key,
      attributeIndex,
      min,
      max,
      distribution,
      distribution_value,
    }: FactoryProps) => [
      <Control
        key={key('continuous')}
        label="value scaling function"
        name="continuous"
        defaultValue={localValueScaling[attributeIndex].properties.vs_function}
        required
        prefix={
          <React.Fragment>
            <small className="me-1">y =</small>
          </React.Fragment>
        }
        onChange={onChangeValueScalingFunction(attributeIndex)}
        tooltip={t('')}
      />,
    ];

    const categoricalRowFactory = ({
      key,
      category,
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
      distribution,
      distribution_value,
    }: FactoryProps) => (
      <SimpleList
        key={key('categorical')}
        name={'weights'}
        hideLabel
        factory={categoricalRowFactory}
        controls={distribution.map((category: any, index: number) => ({
          category,
          value: distribution_value[index],
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
      <Collapsible key={key('scalingBox')} title={attribute}>
        {type == 'Continuous'
          ? continuousScalingBox({ key, attributeIndex, ...properties })
          : categoricalScalingBox({ key, attributeIndex, ...properties })}
        <ScalingGraph
          distribution={
            localValueScaling[attributeIndex].properties.distribution
          }
          distribution_value={
            localValueScaling[attributeIndex].properties.distribution_value
          }
          type={type}
        />
        ,
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
      <Button className="w-100 btn-primary">{capitalize(t('apply'))}</Button>,
    ];
  } else {
    controls = [<></>];
  }

  return (
    <Form
      controls={controls}
      errors={getErrors}
      disabled={isLoading}
      key={'weight_form'}
      onSubmit={(fields: any) => {
        console.log('ON SUBMIT', fields);
        dispatch(
          injectSetLoadingCreator({
            value: property,
            isLoading: true,
          } as LoadingValue<string>)()
        );
        dispatch(
          call({
            target: ServerTargets.Update,
            args: [property, localValueScaling],
            onSuccessAction: injectSetLoadingCreator({
              value: property,
              isLoading: false,
            } as LoadingValue<string>),
            onErrorAction: injectSetErrorCreator(property),
          } as CallModel)
        );
      }}
    />
  );
}

export default withTranslation()(ValueScaling);
