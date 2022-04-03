import { createRef, ReactElement, RefObject, useState } from 'react';
import { capitalize, values } from 'lodash';
import { withTranslation } from 'react-i18next';
import FormSelectOptionModel from '../../models/form/FormSelectOptionModel';
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
import LoadingValue from 'models/LoadingValue';
import { call } from 'store/reducers/server';
import CallModel from 'models/server-coms/CallModel';
import ServerCallTargets from 'enums/ServerCallTargets';
import ObjectivesHierarchyModel from 'models/AnalysisObjectivesModel';
import ValueScalingModel from 'models/ValueScalingModel';

function ValueScaling({ t }: any) {
  const property = 'objectives';
  const selector = useAppSelector(selectAnalysis);
  const objectives = selector.properties[property] as ObjectivesHierarchyModel;
  const getErrors = selector.properties['objectivesError'];
  const isLoading = selector.properties['objectivesLoading'];

  const dispatch = useAppDispatch();

  //const getErrors = selector.properties.valueScalingError;
  //const isLoading = selector.properties.valueScalingLoading;

  const extractAttributeFromOH = () => {
    let localAttributes: any = [];

    if (objectives.primaries.primary.length == 0) {
      return localAttributes;
    } else {
      for (
        let primaryIndex = 0;
        primaryIndex < objectives.primaries.primary.length;
        primaryIndex++
      ) {
        let secondaries = objectives.primaries.secondaries[primaryIndex];
        for (
          let secondaryIndex = 0;
          secondaryIndex < secondaries.secondary.length;
          secondaryIndex++
        ) {
          let attributes = secondaries.attributes[secondaryIndex];
          for (
            let attributeIndex = 0;
            attributeIndex < attributes.attribute.length;
            attributeIndex++
          ) {
            let dataset = attributes.datasets[attributeIndex];
            localAttributes.push({
              primaryIndex: primaryIndex,
              secondaryIndex: secondaryIndex,
              attributeIndex: attributeIndex,
              attribute: attributes.attribute[attributeIndex],
              dataset: dataset,
            });
          }
        }
      }
      return localAttributes as ValueScalingModel;
    }
  };

  const injectAttributeInOH = () => {
    let newObjectivesHierarchy = JSON.parse(
      JSON.stringify(objectives)
    ) as typeof objectives;
    localValueScaling.forEach((attribute: ValueScalingModel) => {
      newObjectivesHierarchy.primaries.secondaries[
        attribute.primaryIndex
      ].attributes[attribute.secondaryIndex].datasets[
        attribute.attributeIndex
      ] = attribute.dataset;
    });
    console.log('newObjectivesHierarchy', newObjectivesHierarchy);
    return newObjectivesHierarchy;
  };

  const [localValueScaling, setLocalValueScaling] = useState(
    extractAttributeFromOH() as ValueScalingModel[]
  );
  let controls = [];

  if (localValueScaling !== undefined && localValueScaling.length > 0) {
    console.log('localValueScaling', localValueScaling);
    const onChangeValueScalingFunction =
      (attributeIndex: number) => (e: any) => {
        e.persist();
        let newFunction = e.target.value;
        console.log(newFunction);

        let newValueScaling = JSON.parse(
          JSON.stringify(localValueScaling)
        ) as typeof localValueScaling;
        newValueScaling[
          attributeIndex
        ].dataset.properties.valueScalingFunction = newFunction;
        setLocalValueScaling(newValueScaling);
      };
    const onChangeCategoryValue =
      (attributeIndex: number, categoryIndex: number) => (e: any) => {
        e.persist();
        let newCategoryValue = e.target.value;
        let newValueScaling = JSON.parse(
          JSON.stringify(localValueScaling)
        ) as typeof localValueScaling;
        newValueScaling[attributeIndex].dataset.properties.distribution_value[
          categoryIndex
        ] = newCategoryValue;
        setLocalValueScaling(newValueScaling);
      };

    const categoricalRowFactory = ({
      key,
      category,
      categoryIndex,
      attributeIndex,
    }: FactoryProps): ReactElement | ReactElement[] => {
      return [
        <Control
          key={key('categorical_row')}
          label={category}
          className="small position-relative d-flex"
          defaultValue={
            localValueScaling[attributeIndex].dataset.properties
              .distribution_value[categoryIndex]
          }
          onChange={onChangeCategoryValue(attributeIndex, categoryIndex)}
          type="number"
        />,
      ];
    };

    const ScalingBoxFactory = ({
      value,
      attributeIndex,
      key,
    }: FactoryProps): ReactElement | ReactElement[] => {
      if (
        value.dataset.type == 'Continuous' ||
        (value.dataset.type == 'Boolean' && value.dataset.isCalculated)
      ) {
        return (
          <Collapsible key={key('scalingBox')} title={value.attribute}>
            <Control
              key={key('continuous')}
              label="value scaling function"
              name="continuous"
              defaultValue={
                localValueScaling[attributeIndex].dataset.properties
                  .valueScalingFunction
              }
              required
              prefix={
                <React.Fragment>
                  <small className="me-1">y =</small>
                </React.Fragment>
              }
              onChange={onChangeValueScalingFunction(attributeIndex)}
              tooltip={t('')}
            />
            <ScalingGraph
              key={key('scaling_graph')}
              distribution={
                localValueScaling[attributeIndex].dataset.properties
                  .distribution
              }
              distribution_value={
                localValueScaling[attributeIndex].dataset.properties
                  .distribution_value
              }
              type={value.dataset.type}
              isCalculated={value.dataset.isCalculated}
            />
          </Collapsible>
        );
      } else {
        return (
          <Collapsible key={key('scalingBox')} title={value.attribute}>
            <SimpleList
              key={key('categorical')}
              name={'weights'}
              hideLabel
              factory={categoricalRowFactory}
              controls={value.dataset.properties.distribution.map(
                (category: any, index: number) => ({
                  category,
                  categoryIndex: index,
                  attributeIndex,
                })
              )}
            />
            <ScalingGraph
              key={key('scaling_graph')}
              distribution={
                localValueScaling[attributeIndex].dataset.properties
                  .distribution
              }
              distribution_value={
                localValueScaling[attributeIndex].dataset.properties
                  .distribution_value
              }
              type={value.dataset.type}
              isCalculated={value.dataset.isCalculated}
            />
          </Collapsible>
        );
      }
    };

    const mainControls =
      localValueScaling.length > 0
        ? [
            <SimpleList
              key={'attributes_vs' + isLoading}
              name={'attributes_vs'}
              hideLabel
              factory={ScalingBoxFactory}
              controls={localValueScaling.map(
                (value: ValueScalingModel, index: number) => ({
                  value,
                  attributeIndex: index,
                })
              )}
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
    controls = [<Spacer></Spacer>];
  }

  return (
    //reconvertir localAttribute en Objective Hierarchy
    <Form
      controls={controls}
      errors={getErrors}
      disabled={isLoading}
      key={'value_scaling_form'}
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
            target: ServerCallTargets.Update,
            args: [property, injectAttributeInOH()],
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
