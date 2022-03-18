import { createRef, ReactElement, RefObject, useState } from 'react';
import { capitalize } from 'lodash';
import { withTranslation } from 'react-i18next';
import FormSelectOptionModel from '../../models/form-models/FormSelectOptionModel';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import Form from '../form/Form';
import objectivesData from '../../data/objectives.json';
import { call, subscribe } from 'store/middlewares/ServerMiddleware';

import {
  Button,
  Spacer,
  Select,
  ExpandableList,
  List,
  Control,
  SimpleList,
} from '../form/form-components';
import {
  selectAnalysis,
  setLoading,
  setError,
} from '../../store/reducers/analysis';
import { FactoryProps } from '../form/form-components/FormExpandableList';
import { useEffectOnce } from 'hooks';
import React from 'react';

function Weighting({ t }: any) {
  const property = 'objectives';
  const selector = useAppSelector(selectAnalysis);
  const objectives = selector.properties.objectives;
  const dispatch = useAppDispatch();
  const files = selector.properties['files'];

  const getErrors = selector.properties['objectivesError'];
  const isLoading = selector.properties['objectivesLoading'];

  const [localObjectives, setLocalObjectives] = useState({
    ...objectives,
    update: true,
  } as { main: string; update: boolean; primaries: { primary: string[]; weights: number[]; secondaries: { secondary: string[]; weights: number[]; attributes: { attribute: string[]; weights: number[]; datasets: { name: string; id: string }[] }[] }[] } });

  let controls = [];
  if (
    localObjectives !== undefined &&
    localObjectives.primaries !== undefined
  ) {
    const getPrimary = () => {
      return localObjectives.primaries.primary;
    };

    const getSecondary = (primaryIndex: number) => {
      return localObjectives.primaries.secondaries[primaryIndex].secondary;
    };

    const getAttribute = (primaryIndex: number, secondaryIndex: number) => {
      return localObjectives.primaries.secondaries[primaryIndex].attributes[
        secondaryIndex
      ].attribute;
    };

    const primaryName = (index: number) => {
      return localObjectives.primaries.primary[index];
    };

    const secondaryName = (primaryIndex: number, secondaryIndex: number) => {
      return localObjectives.primaries.secondaries[primaryIndex].secondary[
        secondaryIndex
      ];
    };
    const copyLocalObjective = () => {
      return JSON.parse(
        JSON.stringify(localObjectives)
      ) as typeof localObjectives;
    };

    const onChangePrimary = (primaryIndex: number) => (value: any) => {
      let newWeight = value;
      let newObjectives = copyLocalObjective();
      newObjectives.primaries.weights[primaryIndex] = newWeight;
      //newObjectives.update = !localObjectives.update;
      setLocalObjectives(newObjectives);
    };

    const onChangeSecondary =
      (primaryIndex: number, secondaryIndex: number) => (e: any) => {
        let newWeight = e.target.value;
        let newObjectives = copyLocalObjective();
        newObjectives.primaries.secondaries[primaryIndex].weights[
          secondaryIndex
        ] = newWeight;
        newObjectives.update = !localObjectives.update;
        setLocalObjectives(newObjectives);
      };

    const onChangeAttribute =
      (primaryIndex: number, secondaryIndex: number, attributeIndex: number) =>
      (e: any) => {
        let newWeight = e.target.value;
        let newObjectives = copyLocalObjective();
        newObjectives.primaries.secondaries[primaryIndex].attributes[
          secondaryIndex
        ].weights[attributeIndex] = newWeight;
        //newObjectives.update = !localObjectives.update;
        setLocalObjectives(newObjectives);
      };

    const weightAttributeFactory = ({
      name,
      key,
      orderIndex,
      primaryIndex,
      secondaryIndex,
      defaultAttribute,
      defaultDataset,
    }: FactoryProps): ReactElement | ReactElement[] => {
      const weightRef: RefObject<HTMLSpanElement> = createRef();
      return [
        <Control
          key={key('weight_attribute') + localObjectives.update}
          label={defaultAttribute}
          className="small position-relative d-flex"
          name={name('attribute')}
          defaultValue={defaultAttribute}
          onChange={({ target: { value } }: { target: HTMLInputElement }) => {
            if (weightRef.current?.textContent) {
              weightRef.current.textContent = value;
              onChangeAttribute(
                primaryIndex,
                secondaryIndex,
                orderIndex
              )(value);
            }
          }}
          type="number"
          //tooltip={t('the cell size is ...')}
        />,
      ];
    };

    const weightSecondaryFactory = ({
      name,
      key,
      orderIndex,
      defaultValue,
      secondaryIndex,

      primaryIndex,
      childrenValues: attributes,
    }: FactoryProps): ReactElement | ReactElement[] => {
      const weightRef: RefObject<HTMLSpanElement> = createRef();

      return [
        <Control
          key={key('weight_secondary') + localObjectives.update}
          label={secondaryName(primaryIndex, orderIndex)}
          className="small position-relative d-flex"
          name="weight"
          defaultValue={
            localObjectives.primaries.secondaries[primaryIndex].weights[
              orderIndex
            ]
          }
          onChange={({ target: { value } }: { target: HTMLInputElement }) => {
            if (weightRef.current?.textContent) {
              weightRef.current.textContent = value;
              onChangeSecondary(primaryIndex, orderIndex)(value);
            }
          }}
          type="number"
          //tooltip={t('the cell size is ...')}
        />,
        <SimpleList
          key={key('weights-secondary') + localObjectives.update}
          name={'weights'}
          hideLabel
          factory={weightAttributeFactory}
          controls={getAttribute(primaryIndex, secondaryIndex).map(
            (defaultAttribute: string, index: number) => ({
              defaultAttribute,
              primaryIndex,
              secondaryIndex,
              attributeIndex: index,
              attributeOptions: attributes.attributeOptions,
            })
          )}
        />,
      ];
    };

    const weightPrimaryFactory = ({
      name,
      key,
      primaryIndex,
      orderIndex,
      primary,
      childrenValues: secondaries,
    }: FactoryProps): ReactElement | ReactElement[] => {
      const weightRef: RefObject<HTMLSpanElement> = createRef();
      return [
        <Control
          key={key('weight_primary') + localObjectives.update}
          label={primaryName(orderIndex)}
          className="small position-relative d-flex"
          name={name('weight_primary')}
          suffix={
            <React.Fragment>
              <span ref={weightRef}>
                {localObjectives.primaries.weights[orderIndex]}
              </span>
            </React.Fragment>
          }
          defaultValue={localObjectives.primaries.weights[orderIndex]}
          onChange={({ target: { value } }: { target: HTMLInputElement }) => {
            if (weightRef.current?.textContent) {
              weightRef.current.textContent = value;
              onChangePrimary(orderIndex)(+value);
            }
          }}
          type="number"
          //tooltip={t('the cell size is ...')}
        />,
        <SimpleList
          key={key('weights-secondary') + localObjectives.update}
          name={'weights'}
          hideLabel
          factory={weightSecondaryFactory}
          controls={getSecondary(orderIndex).map(
            (defaultValueSecondary: string, index: number) => ({
              defaultValue: defaultValueSecondary,
              primaryIndex,
              secondaryIndex: index,
              primary,
              childrenValues: getAttribute(orderIndex, index),
            })
          )}
        />,
      ];
    };

    const mainControls = [
      <div>
        <SimpleList
          key={'weights-primary' + isLoading}
          name={'weights'}
          hideLabel
          factory={weightPrimaryFactory}
          controls={getPrimary().map((primary: string, index: number) => ({
            primary,
            primaryIndex: index,
            childrenValues: getSecondary(index),
          }))}
        />
      </div>,
    ];
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
      onSubmit={() => {
        dispatch(
          call({
            target: 'update',
            args: [property, localObjectives],
            successAction: setLoading,
            successData: property,
            failureAction: setError,
            failureData: property,
          })
        );
        dispatch(setLoading({ params: property, data: true }));
      }}
    />
  );
}

export default withTranslation()(Weighting);
