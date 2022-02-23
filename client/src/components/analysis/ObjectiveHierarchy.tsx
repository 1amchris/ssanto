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

function ObjectiveHierarchy({ t }: any) {
  const dispatch = useAppDispatch();
  const {
    objectives: {
      main: mainValue,
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
  }: FactoryProps): ReactElement | ReactElement[] => [
    <Select
      hideLabel
      key={key('secondary')}
      name={name('secondary')}
      defaultValue={defaultValue}
      label={`secondary objective ${orderIndex}`}
      options={generateOptions('Secondary Objective', 3)}
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
    childrenValues,
  }: FactoryProps): ReactElement | ReactElement[] => [
    <Select
      hideLabel
      label={`primary objective ${orderIndex}`}
      key={key('primary')}
      name={name('primary')}
      defaultValue={defaultValue}
      options={generateOptions('Primary Objective', 3)}
    />,
    <ExpandableList
      hideLabel
      key={key('secondaries')}
      name={name('secondaries')}
      factory={secondaryObjectivesFactory}
      label="secondary objectives"
      controls={childrenValues?.map((defaultValue: string) => ({
        defaultValue,
      }))}
    />,
  ];

  const mainControls = [
    <Select
      key="main"
      name="main"
      label="objectives"
      defaultValue={mainValue}
      options={generateOptions('Main Objective', 3)}
      tooltip={t('the objective hierarchy is ...')}
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
          childrenValues: secondaries.secondaries[index]?.secondary,
        })
      )}
    />,
  ];

  const controls = [
    ...mainControls,
    <Spacer />,
    <Button variant="outline-primary" type="submit">
      {capitalize(t('apply'))}
    </Button>,
  ];

  return (
    <Form
      controls={controls}
      onSubmit={(fields: any) => dispatch(updateObjectives(fields))}
    />
  );
}

export default withTranslation()(ObjectiveHierarchy);
