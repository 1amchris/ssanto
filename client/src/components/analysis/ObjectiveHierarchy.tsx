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

  /** generateOptions:
   *  Generates placeholder options
   *  Remove once computed options are added
   **/
  const generateOptions = (text: string, n: number) =>
    Array.from(Array(n).keys()).map(
      (value: number) =>
        ({
          value: `${value}`,
          label: `${value} ${text}`,
        } as FormSelectOptionModel)
    );

  const secondaryControlFactory = (props: any) => {
    const { name, key, orderIndex, defaultValue } = props;
    return [
      <Select
        hideLabel
        key={key('secondary')}
        name={name('secondary')}
        defaultValue={defaultValue}
        label={`secondary objective ${orderIndex}`}
        options={generateOptions('Secondary Objective', 3)}
      />,
    ];
  };

  const primaryControlFactory = (props: any) => {
    const { name, key, orderIndex, defaultValue, childrenValues } = props;
    return [
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
        factory={secondaryControlFactory}
        label="secondary objectives"
        controls={childrenValues?.map((defaultValue: string) => ({
          defaultValue,
        }))}
      />,
    ];
  };

  const mainControls = () => {
    return [
      <Select
        key="main"
        name="main"
        label="objectives"
        defaultValue={mainValue}
        options={generateOptions('Main Objective', 3)}
      />,
      <ExpandableList
        hideLabel
        key={`primaries.0`}
        name={`primaries.0`}
        factory={primaryControlFactory}
        label={'primary objectives'}
        controls={secondaries.primary.map(
          (defaultValue: string, index: number) => ({
            defaultValue,
            childrenValues: secondaries.secondaries[index]?.secondary,
          })
        )}
      />,
    ];
  };

  const controls = [
    ...mainControls(),
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
