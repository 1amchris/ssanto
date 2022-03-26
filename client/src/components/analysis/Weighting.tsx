import { createRef, ReactElement, RefObject, useState } from 'react';
import { capitalize } from 'lodash';
import { withTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import Form from 'components/forms/Form';
import { call } from 'store/reducers/server';

import {
  Button,
  Spacer,
  Control,
  SimpleList,
} from 'components/forms/components';
import {
  selectAnalysis,
  injectSetLoadingCreator,
  injectSetErrorCreator,
} from 'store/reducers/analysis';
import { FactoryProps } from 'components/forms/components/FormExpandableList';
import React from 'react';
import LoadingValue from 'models/LoadingValue';
import CallModel from 'models/server-coms/CallModel';
import ServerTargets from 'enums/ServerTargets';

function Weighting({ t }: any) {
  const property = 'objectives';
  const selector = useAppSelector(selectAnalysis);
  const objectives = selector.properties.objectives;
  const dispatch = useAppDispatch();

  const getErrors = selector.properties.objectivesError;
  const isLoading = selector.properties.objectivesLoading;

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
      let newObjectives = copyLocalObjective();
      newObjectives.primaries.weights[primaryIndex] = value;
      newObjectives.update = !localObjectives.update;
      setLocalObjectives(newObjectives);
    };

    const onChangeSecondary =
      (primaryIndex: number, secondaryIndex: number) => (value: any) => {
        let newObjectives = copyLocalObjective();
        newObjectives.primaries.secondaries[primaryIndex].weights[
          secondaryIndex
        ] = value;
        newObjectives.update = !localObjectives.update;
        setLocalObjectives(newObjectives);
      };

    const onChangeAttribute =
      (primaryIndex: number, secondaryIndex: number, attributeIndex: number) =>
      (value: any) => {
        let newObjectives = copyLocalObjective();
        newObjectives.primaries.secondaries[primaryIndex].attributes[
          secondaryIndex
        ].weights[attributeIndex] = value;
        newObjectives.update = !localObjectives.update;
        setLocalObjectives(newObjectives);
      };

    const weightAttributeFactory = ({
      name,
      key,
      orderIndex,
      primaryIndex,
      secondaryIndex,
      defaultAttribute,
    }: FactoryProps): ReactElement | ReactElement[] => {
      const weightRef: RefObject<HTMLSpanElement> = createRef();
      return [
        <Control
          key={key('attribute') + localObjectives.update}
          label={defaultAttribute}
          className="small position-relative d-flex"
          name={name('attribute')}
          suffix={
            <React.Fragment>
              <span ref={weightRef}>
                {
                  localObjectives.primaries.secondaries[primaryIndex]
                    .attributes[secondaryIndex].weights[orderIndex]
                }
              </span>
            </React.Fragment>
          }
          defaultValue={
            localObjectives.primaries.secondaries[primaryIndex].attributes[
              secondaryIndex
            ].weights[orderIndex]
          }
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

      const controls = [
        <Control
          key={key('secondary') + localObjectives.update}
          label={secondaryName(primaryIndex, orderIndex)}
          className="small position-relative d-flex"
          name={name('secondary')}
          suffix={
            <React.Fragment>
              <span ref={weightRef}>
                {
                  localObjectives.primaries.secondaries[primaryIndex].weights[
                    orderIndex
                  ]
                }
              </span>
            </React.Fragment>
          }
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
      ];
      if (
        localObjectives.primaries.secondaries[primaryIndex].attributes[
          secondaryIndex
        ].attribute.length > 1
      ) {
        controls.push(
          <SimpleList
            hideLabel
            key={key('secondaries') + localObjectives.update}
            name={name('secondaries')}
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
          />
        );
      }

      return controls;
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

      const controls = [
        <Control
          label={primaryName(orderIndex)}
          key={key('primary') + localObjectives.update}
          name={name('primary')}
          className="small position-relative d-flex"
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
      ];

      // There is more than one secondary objective
      // OR
      // There is one secondary objective with many attributes
      if (
        localObjectives.primaries.secondaries[primaryIndex].secondary.length >
          1 ||
        (localObjectives.primaries.secondaries[primaryIndex].secondary.length ==
          1 &&
          localObjectives.primaries.secondaries[primaryIndex].attributes[0]
            .attribute.length > 1)
      ) {
        controls.push(
          <SimpleList
            hideLabel
            name={name('primaries')}
            key={key('primaries') + localObjectives.update}
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
          />
        );
      }

      return controls;
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
          injectSetLoadingCreator({
            value: property,
            isLoading: true,
          } as LoadingValue<string>)()
        );
        dispatch(
          call({
            target: ServerTargets.Update,
            args: [property, localObjectives],
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

export default withTranslation()(Weighting);
