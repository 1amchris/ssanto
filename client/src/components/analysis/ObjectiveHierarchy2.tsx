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
import objectivesData from '../../data/objectives.json';

//TODO : ajout d'un objectif => options selon l'objectif parent
//TODO : update d'un objectif => clear des objectifs enfants et updates de leurs options

function generateHierarchyOptions(level: number, parent?: string) {
  if (level == 1) {
    return objectivesData?.mains[0]?.primaries?.map(
      json =>
        ({
          value: `${json.primary}`,
          label: `${json.primary}`,
        } as FormSelectOptionModel)
    );
  } else if (level == 2) {
    let secondaries: { secondary: any }[] = [];
    objectivesData?.mains[0]?.primaries?.map(json => {
      if (json.primary == parent) {
        secondaries = json.secondaries;
      }
    });
    return secondaries.map(
      json =>
        ({
          value: `${json?.secondary}`,
          label: `${json?.secondary}`,
        } as FormSelectOptionModel)
    );
  } else if (level == 0) {
    return objectivesData?.mains.map(
      json =>
        ({
          value: `${json?.main}`,
          label: `${json?.main}`,
        } as FormSelectOptionModel)
    );
  }
}

function ObjectiveHierarchy2({ t }: any) {
  const dispatch = useAppDispatch();
  const {
    objectives: {
      main: mainValue,
      options: mainValueOptions,
      primaries: [primaries],
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
          label: `${text} ${value} `,
        } as FormSelectOptionModel)
    );

  const onChangeSelect = () => console.log('onchange yes');

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
    defaultAttribute,
    defaultDataset,
  }: FactoryProps): ReactElement | ReactElement[] => [
    <Select
      hideLabel
      key={key('attribute')}
      name={name('attribute')}
      defaultValue={defaultAttribute}
      label={`attribute ${orderIndex}`}
      options={generateOptions('attribute', 3)}
    />,
    <Select
      hideLabel
      key={key('dataset')}
      name={name('dataset')}
      defaultValue={defaultDataset}
      label={`dataset`}
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
    primary,
    childrenValues: attributes,
  }: FactoryProps): ReactElement | ReactElement[] => [
    <Select
      hideLabel
      label={`secondary objective ${orderIndex}`}
      key={key('secondary')}
      name={name('secondary')}
      defaultValue={defaultValue}
      options={generateHierarchyOptions(2, primary)}
    />,
    <ExpandableList
      hideLabel
      key={key('attributes')}
      name={name('attributes')}
      factory={attributesFactory}
      label="attributes"
      controls={attributes?.attribute?.map((defaultAttribute: string) => ({
        defaultAttribute,
        attributeOptions: attributes.attributeOptions,
      }))}
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
    childrenValues: secondaries,
  }: FactoryProps): ReactElement | ReactElement[] => [
    <Select
      hideLabel
      label={`primary objective ${orderIndex}`}
      key={key('primary')}
      name={name('primary')}
      defaultValue={defaultValue}
      onChange={onChangeSelect}
      options={generateHierarchyOptions(1)}
    />,
    <ExpandableList
      hideLabel
      key={key('secondaries')}
      name={name('secondaries')}
      factory={secondaryObjectivesFactory}
      label="secondary objectives"
      controls={secondaries?.secondary?.map(
        (defaultValueSecondary: string, index: number) => ({
          defaultValue: defaultValueSecondary,
          primary: defaultValue,
          childrenValues: secondaries?.attributes[index],
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
      options={generateHierarchyOptions(0)}
    />,
    <ExpandableList
      hideLabel
      key={`primaries.0`}
      name={`primaries.0`}
      factory={primaryObjectivesFactory}
      label={'primary objectives'}
      controls={primaries?.primary?.map(
        (defaultValue: string, index: number) => ({
          defaultValue,
          childrenValues: primaries?.secondaries[index],
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
