import React, { ReactElement } from 'react';
import { capitalize } from 'lodash';
import { withTranslation } from 'react-i18next';
import FormSelectOptionModel from '../../models/form-models/FormSelectOptionModel';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import Form from '../form/Form';
import {
  Button,
  Spacer,
  Select,
  ExpandableList,
} from '../form/form-components';
import {
  selectAnalysis,
  updateObjectives,
} from '../../store/reducers/analysis';
import { FactoryProps } from '../form/form-components/FormExpandableList';

function ObjectiveHierarchy2({ t }: any) {
  const dispatch = useAppDispatch();
  const {
    objectives: {
      main: mainValue,
      options: mainValueOptions,
      primaries: [secondaries],
    },
  } = useAppSelector(selectAnalysis);

  /**
   * generateOptions:
   * Generates placeholder options
   * Remove once computed options are added
   */
  const generateOptions = (text: string, n: number) =>
    Array.from(Array(n).keys()).map(
      (value: number) =>
        ({
          value: `${value}`,
          label: `${value} ${text}`,
        } as FormSelectOptionModel)
    );

  const generateOptions2 = (options: string[], isAt: boolean) =>
    options?.map(
      (value: string) =>
        ({
          value: `${value}`,
          label: `${value}`,
        } as FormSelectOptionModel)
    );

  /**
   * A factory that generates the attributes inputs on demand
   * @param props: name and key are generators, which require a string to generate the name and keys of the elements,
   *               orderIndex is the index at which it will be placed in the list
   *               any other parameters are parameters given in the "controls" field
   * @returns A second order objective ReactElement
   */
  const attributesFactory = ({
    name,
    key,
    orderIndex,
    defaultValue,
    options,
  }: FactoryProps): ReactElement | ReactElement[] => [
    <Select
      hideLabel
      key={key('attribute')}
      name={name('attribute')}
      defaultValue={defaultValue}
      label={`attribute ${orderIndex}`}
      options={generateOptions2(options, true)}
    />,
    <Select
      hideLabel
      key={key('dataset')}
      name={name('dataset')}
      defaultValue={defaultValue}
      label={`dataset ${orderIndex}`}
      options={generateOptions('Dataset', 3)}
    />,
  ];

  /**
   * A factory that generates the secondary objective inputs on demand
   * @param props: name and key are generators, which require a string to generate the name and keys of the elements,
   *               orderIndex is the index at which it will be placed in the list
   *               any other parameters are parameters given in the "controls" field
   * @returns A second order objective ReactElement
   */

  const secondaryObjectivesFactory = ({
    name,
    key,
    orderIndex,
    defaultValue,
    options,
    childrenValues,
  }: FactoryProps): ReactElement | ReactElement[] => [
    <Select
      hideLabel
      label={`secondary objective ${orderIndex}`}
      key={key('secondary')}
      name={name('secondary')}
      defaultValue={defaultValue}
      options={generateOptions2(options, false)}
    />,
    <ExpandableList
      hideLabel
      key={key('attributes')}
      name={name('attributes')}
      factory={attributesFactory}
      label="attributes"
      controls={childrenValues.attribute?.map(
        (defaultValue: string, index: number) => ({
          defaultValue,
          options: childrenValues.attributeOptions,
        })
      )}
    />,
  ];
  /**
   * A factory that generates the primary objective inputs on demand
   * @param props: name and key are generators, which require a string to generate the name and keys of the elements,
   *               orderIndex is the index at which it will be placed in the list
   *               any other parameters are parameters given in the "controls" field
   * @returns A first order objective ReactElement
   */
  const primaryObjectivesFactory = ({
    name,
    key,
    orderIndex,
    defaultValue,
    options,
    childrenValues,
  }: FactoryProps): ReactElement | ReactElement[] => [
    <Select
      hideLabel
      label={`primary objective ${orderIndex}`}
      key={key('primary')}
      name={name('primary')}
      defaultValue={defaultValue}
      options={generateOptions2(options, false)}
    />,
    <ExpandableList
      hideLabel
      key={key('secondaries')}
      name={name('secondaries')}
      factory={secondaryObjectivesFactory}
      label="secondary objectives"
      controls={childrenValues.secondary?.map(
        (defaultValue: string, index: number) => ({
          defaultValue,
          options: childrenValues.options,
          childrenValues: childrenValues.attributes[index],
        })
      )}
    />,
  ];

  const mainControls = [
    <Select
      key="main"
      name="main"
      label="objectives"
      defaultValue={mainValue}
      options={generateOptions2(mainValueOptions, false)}
    />,
    <ExpandableList
      hideLabel
      key={`primaries.0`}
      name={`primaries.0`}
      factory={primaryObjectivesFactory}
      label={'primary objectives'}
      controls={secondaries.primary.map(
        (defaultValue: string, index: number) => ({
          defaultValue,
          options: secondaries.options,
          childrenValues: secondaries.secondaries[index],
        })
      )}
    />,
  ];

  const controls = [
    ...mainControls,
    <Spacer />,
    <Button className="w-100 btn-primary">{capitalize(t('apply'))}</Button>,
  ];

  return (
    <Form
      controls={controls}
      onSubmit={(fields: any) => dispatch(updateObjectives(fields))}
    />
  );
}

export default withTranslation()(ObjectiveHierarchy2);
