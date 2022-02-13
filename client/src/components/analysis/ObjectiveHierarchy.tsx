import React from 'react';
import { capitalize } from 'lodash';
import { withTranslation } from 'react-i18next';
import FormSelectOptionModel from '../../models/form-models/FormSelectOptionModel';
import { useAppDispatch } from '../../store/hooks';
import Form from '../form/Form';
import {
  Button,
  Spacer,
  Select,
  ExpandableList,
} from '../form/form-components';

function ObjectiveHierarchy({ t }: any) {
  const dispatch = useAppDispatch();

  const generateOptions = (prefix: string, n: number) =>
    Array.from(Array(n).keys()).map(
      (value: number) =>
        ({
          value: `${value}`,
          label: `${prefix} ${value}`,
        } as FormSelectOptionModel)
    );

  const controls = [
    <Select
      label="objectives"
      name="main"
      options={generateOptions('Main Objective', 3)}
    />,
    <ExpandableList
      label={'primary objectives'}
      name="primary"
      hideLabel
      template={[
        <Select
          name="primary"
          hideLabel
          options={generateOptions('Primary Objective', 3)}
        />,
        <ExpandableList
          label="secondary objectives"
          name="secondary"
          hideLabel
          template={[
            <Select
              name="secondary"
              hideLabel
              options={generateOptions('Secondary Objective', 3)}
            />,
            <ExpandableList
              label="ternary objectives"
              name="ternary"
              hideLabel
              template={
                <Select
                  name="ternary"
                  hideLabel
                  options={generateOptions('Ternary Objective', 3)}
                />
              }
            />,
          ]}
        />,
      ]}
    />,
    <Spacer />,
    <Button className="w-100 btn-primary">{capitalize(t('apply'))}</Button>,
  ];

  return (
    <Form
      controls={controls}
      onSubmit={(fields: any) => {
        console.log(fields);
      }}
    />
  );
}

function unflatten(object: { [str: string]: any }) {
  const result = {};
  Object.keys(object).forEach(path => {
    var subpaths = path.split('.'),
      previous = subpaths.pop();

    subpaths.reduce(
      (previousValue: any, currentValue: any, currentIndex: any, array: any) =>
        (previousValue[currentValue] =
          previousValue[currentValue] ||
          (isFinite(
            currentIndex + 1 in array ? array[currentIndex + 1] : previous
          )
            ? []
            : {})),
      result
    )[previous!] = object[path];
  });
  return result;
}

export default withTranslation()(ObjectiveHierarchy);
