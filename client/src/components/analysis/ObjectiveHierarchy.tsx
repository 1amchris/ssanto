import React from 'react';
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

function ObjectiveHierarchy({ t }: any) {
  const dispatch = useAppDispatch();
  const {
    objectives: {
      main: mainValue,
      primaries: [secondaries],
    },
  } = useAppSelector(selectAnalysis);

  const generateOptions = (prefix: string, n: number) =>
    Array.from(Array(n).keys()).map(
      (value: number) =>
        ({
          value: `${value}`,
          label: `${prefix} ${value}`,
        } as FormSelectOptionModel)
    );

  const secondaryControl = (
    defaultValue: string = '0',
    parentName: string = '',
    index?: number
  ) => {
    const prefix = parentName !== '' ? `${parentName}.` : '';
    const suffix = index !== undefined ? `.${index}` : '';

    return [
      <Select
        key={`${prefix}secondary${suffix}`}
        name={`${prefix}secondary${suffix}`}
        hideLabel
        defaultValue={defaultValue}
        options={generateOptions('Secondary Objective', 3)}
      />,
    ];
  };

  const primaryControl =
    (primaryValue: string = '0', parentName: string = '', index?: number) =>
    (secondaryValues: string[] = []) => {
      const prefix = parentName !== '' ? `${parentName}.` : '';
      const suffix = index !== undefined ? `.${index}` : '';
      const expandablesName = `${prefix}secondaries${suffix}`;

      return [
        <Select
          key={`${prefix}primary${suffix}`}
          name={`${prefix}primary${suffix}`}
          hideLabel
          defaultValue={primaryValue}
          options={generateOptions('Primary Objective', 3)}
        />,
        <ExpandableList
          label="secondary objectives"
          key={expandablesName}
          name={expandablesName}
          hideLabel
          template={secondaryControl()}
          controls={secondaryValues.map((value: string, index: number) =>
            secondaryControl(value, expandablesName, index)
          )}
        />,
      ];
    };

  const mainControls = (index?: number) => {
    const suffix = index !== undefined ? `.${index}` : '';
    const expandablesName = `primaries${suffix}`;

    return [
      <Select
        label="objectives"
        key="main"
        name="main"
        defaultValue={mainValue}
        options={generateOptions('Main Objective', 3)}
      />,
      <ExpandableList
        label={'primary objectives'}
        key={expandablesName}
        name={expandablesName}
        hideLabel
        template={primaryControl()()}
        controls={secondaries.primary.map((value: string, index: number) =>
          primaryControl(
            value,
            expandablesName,
            index
          )(secondaries.secondaries[index].secondary)
        )}
      />,
    ];
  };

  const controls = [
    ...mainControls(0),
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

export default withTranslation()(ObjectiveHierarchy);
