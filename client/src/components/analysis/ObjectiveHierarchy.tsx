import { ReactElement, useState } from 'react';
import { capitalize } from 'lodash';
import { withTranslation } from 'react-i18next';
import FormSelectOptionModel from 'models/form-models/FormSelectOptionModel';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import objectivesData from 'data/objectives.json';
import { call } from 'store/reducers/server';

import {
  Button,
  Spacer,
  Select,
  ExpandableList,
  Control,
} from 'components/forms/components';
import {
  selectAnalysis,
  injectSetLoadingCreator,
  injectSetErrorCreator,
} from 'store/reducers/analysis';
import { FactoryProps } from 'components/forms/components/FormExpandableList';
import React from 'react';
import CallModel from 'models/server-coms/CallModel';
import LoadingValue from 'models/LoadingValue';
import ServerTargets from 'enums/ServerTargets';
import Form from 'components/forms/Form';

function isShp(file: { extension: string }, index: any, array: any) {
  return file.extension === 'shp';
}

function isValidOH(objectiveHierarchy: {
  main: string;
  update: boolean;
  primaries: {
    primary: string[];
    weights: number[];
    secondaries: {
      secondary: string[];
      weights: number[];
      attributes: {
        attribute: string[];
        weights: number[];
        datasets: { name: string; id: string }[];
      }[];
    }[];
  };
}) {
  let primaryHasSecondary = true;
  let secondaryHasAttribute = true;
  let attributeHasName = true;
  let datasetsAreSelected = true;
  objectiveHierarchy.primaries.secondaries.forEach(json => {
    primaryHasSecondary = primaryHasSecondary && json.secondary.length > 0;
    json.attributes.forEach(json => {
      secondaryHasAttribute =
        secondaryHasAttribute && json.attribute.length > 0;
      json.attribute.forEach(
        attributeName =>
          (attributeHasName = attributeHasName && attributeName.length > 0)
      );
      json.datasets.forEach(
        dataset =>
          (datasetsAreSelected = datasetsAreSelected && dataset.id !== '0')
      );
    });
  });
  return primaryHasSecondary && secondaryHasAttribute && attributeHasName;
}

function ObjectiveHierarchy({ t }: any) {
  const property = 'objectives';
  const selector = useAppSelector(selectAnalysis);
  const objectives = selector.properties.objectives;
  const dispatch = useAppDispatch();
  const files =
    selector.properties['files'].length > 0
      ? selector.properties['files'].filter(isShp)
      : [];
  const getErrors = selector.properties['objectivesError'];
  const isLoading = selector.properties['objectivesLoading'];

  const [localObjectives, setLocalObjectives] = useState({
    ...objectives,
    update: true,
  } as { main: string; update: boolean; primaries: { primary: string[]; weights: number[]; secondaries: { secondary: string[]; weights: number[]; attributes: { attribute: string[]; weights: number[]; datasets: { name: string; id: string }[] }[] }[] } });

  /* Début refactor ***************/
  let controls = [];
  if (
    !(localObjectives === undefined || localObjectives.primaries === undefined)
  ) {
    const copyLocalObjective = () => {
      return JSON.parse(
        JSON.stringify(localObjectives)
      ) as typeof localObjectives;
    };
    const primaryName = (index: number) => {
      return localObjectives.primaries.primary[index];
    };

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

    const getAllMainOptions = () => {
      let options: string[] = objectivesData?.mains.map(
        (json: { main: string }) => json.main
      );
      return options;
    };

    const getAllPrimaryOptions = (main: string) => {
      let options: string[] = [];

      objectivesData.mains
        .filter(json => json.main === main)
        .forEach(json => {
          json.primaries?.forEach(json => {
            options.push(json.primary);
          });
        });

      return options;
    };

    const getAllSecondaryOptions = (primary: string) => {
      let options: string[] = [];

      objectivesData?.mains[0]?.primaries
        ?.filter(json => json.primary === primary)
        .forEach(json => {
          json.secondaries.forEach(json => {
            options.push(json.secondary);
          });
        });

      return options;
    };

    const formatOptions = (options: string[]) => {
      return options.map(
        main =>
          ({
            value: `${main}`,
            label: `${main}`,
          } as FormSelectOptionModel)
      );
    };

    const generateOptionsMain = () => {
      let options = [
        localObjectives.main,
        ...getAllMainOptions().filter(main => main !== localObjectives.main),
      ];

      return formatOptions(options);
    };

    const getUnusedPrimary = () => {
      let unused: string[] = getAllPrimaryOptions(localObjectives.main).filter(
        primary => !localObjectives.primaries.primary.includes(primary)
      );

      return unused;
    };

    const getUnusedSecondary = (primaryIndex: number) => {
      let unused: string[] = getAllSecondaryOptions(
        primaryName(primaryIndex)
      ).filter(
        secondary =>
          !localObjectives.primaries.secondaries[
            primaryIndex
          ].secondary.includes(secondary)
      );

      return unused;
    };

    const generateOptionsPrimary = (primaryIndex: number) => {
      let options = [
        localObjectives.primaries.primary[primaryIndex],
        ...getUnusedPrimary(),
      ];
      return formatOptions(options);
    };

    const generateOptionsSecondary = (
      primaryIndex: number,
      secondaryIndex: number
    ) => {
      let options = [
        localObjectives.primaries.secondaries[primaryIndex].secondary[
          secondaryIndex
        ],
        ...getUnusedSecondary(primaryIndex),
      ];

      return formatOptions(options);
    };

    const generateOptionsDataset = (
      primaryIndex: number,
      secondaryIndex: number,
      attributeIndex: number
    ) => {
      let currentDatasetId =
        localObjectives.primaries.secondaries[primaryIndex].attributes[
          secondaryIndex
        ].datasets[attributeIndex].id;
      let options = [
        localObjectives.primaries.secondaries[primaryIndex].attributes[
          secondaryIndex
        ].datasets[attributeIndex],
      ];

      if (files.length > 0) {
        options = options.concat(
          files
            .filter(({ id }) => id !== currentDatasetId)
            .map(({ name, id }) => ({ name, id }))
        );
      }
      return options.map(
        file =>
          ({
            value: `${JSON.stringify({ id: file.id, name: file.name })}`,
            label: `${file.name}`,
          } as FormSelectOptionModel)
      );
    };
    let defaultSecondaries = { secondary: [], weights: [], attributes: [] };
    let defaultAttributes = { attribute: [], weights: [], datasets: [] };
    let defaultDataset = { name: '', id: '0' };

    const onAddPrimary = () => () => {
      let unused = getUnusedPrimary();
      let newDefault = unused.length > 0 ? unused[0] : undefined;
      if (newDefault !== undefined) {
        let newObjectives = copyLocalObjective();
        newObjectives.primaries.primary.push(newDefault);
        newObjectives.primaries.secondaries.push(defaultSecondaries);
        newObjectives.primaries.weights.push(1);
        newObjectives.update = !localObjectives.update;
        setLocalObjectives(newObjectives);
      }
    };

    const onAddSecondary = (primaryIndex: number) => () => {
      let unused = getUnusedSecondary(primaryIndex);
      let newDefault = unused.length > 0 ? unused[0] : undefined;
      if (newDefault !== undefined) {
        let newObjectives = copyLocalObjective();
        newObjectives.primaries.secondaries[primaryIndex].secondary.push(
          newDefault
        );
        newObjectives.primaries.secondaries[primaryIndex].attributes.push(
          defaultAttributes
        );
        newObjectives.primaries.secondaries[primaryIndex].weights.push(1);
        newObjectives.update = !localObjectives.update;
        setLocalObjectives(newObjectives);
      }
    };

    const onAddAttribute =
      (primaryIndex: number, secondaryIndex: number) => () => {
        //let unused = getUnusedAttribute(primaryIndex, secondaryIndex);
        //let newDefault = unused.length > 0 ? unused[0] : undefined;

        if (
          localObjectives.primaries.secondaries[primaryIndex].attributes[
            secondaryIndex
          ].attribute.length === 0
        ) {
          let newObjectives = copyLocalObjective();
          newObjectives.primaries.secondaries[primaryIndex].attributes[
            secondaryIndex
          ].attribute.push('');

          newObjectives.primaries.secondaries[primaryIndex].attributes[
            secondaryIndex
          ].datasets.push(defaultDataset);

          newObjectives.primaries.secondaries[primaryIndex].attributes[
            secondaryIndex
          ].weights.push(1);
          newObjectives.update = !localObjectives.update;
          setLocalObjectives(newObjectives);
        }
      };

    const onRemovePrimary = () => (primaryIndex: number) => {
      let newObjectives = copyLocalObjective();
      newObjectives.primaries.primary.splice(primaryIndex, 1);
      newObjectives.primaries.secondaries.splice(primaryIndex, 1);
      newObjectives.primaries.weights.splice(primaryIndex, 1);
      newObjectives.update = !localObjectives.update;
      setLocalObjectives(newObjectives);
    };
    const onRemoveSecondary =
      (primaryIndex: number) => (secondaryIndex: number) => {
        let newObjectives = copyLocalObjective();
        newObjectives.primaries.secondaries[primaryIndex].secondary.splice(
          secondaryIndex,
          1
        );
        newObjectives.primaries.secondaries[primaryIndex].attributes.splice(
          secondaryIndex,
          1
        );
        newObjectives.primaries.secondaries[primaryIndex].weights.splice(
          secondaryIndex,
          1
        );
        newObjectives.update = !localObjectives.update;
        setLocalObjectives(newObjectives);
      };

    const onRemoveAttribute =
      (primaryIndex: number, secondaryIndex: number) =>
      (attributeIndex: number) => {
        let newObjectives = copyLocalObjective();
        newObjectives.primaries.secondaries[primaryIndex].attributes[
          secondaryIndex
        ].attribute.splice(attributeIndex, 1);
        newObjectives.primaries.secondaries[primaryIndex].attributes[
          secondaryIndex
        ].datasets.splice(attributeIndex, 1);
        newObjectives.primaries.secondaries[primaryIndex].attributes[
          secondaryIndex
        ].weights.splice(attributeIndex, 1);
        newObjectives.update = !localObjectives.update;
        setLocalObjectives(newObjectives);
      };

    const onChangePrimary = (primaryIndex: number) => (e: any) => {
      let newPrimary = e.target.value;
      let newObjectives = copyLocalObjective();
      newObjectives.primaries.primary[primaryIndex] = newPrimary;
      newObjectives.primaries.secondaries[primaryIndex] = defaultSecondaries;
      newObjectives.update = !localObjectives.update;
      setLocalObjectives(newObjectives);
    };

    const onChangeSecondary =
      (primaryIndex: number, secondaryIndex: number) => (e: any) => {
        let newSecondary = e.target.value;
        let newObjectives = copyLocalObjective();
        newObjectives.primaries.secondaries[primaryIndex].secondary[
          secondaryIndex
        ] = newSecondary;
        newObjectives.primaries.secondaries[primaryIndex].attributes[
          secondaryIndex
        ] = defaultAttributes;
        newObjectives.update = !localObjectives.update;
        setLocalObjectives(newObjectives);
      };

    const onChangeAttribute =
      (primaryIndex: number, secondaryIndex: number, attributeIndex: number) =>
      (event: any) => {
        event.persist();
        let value = event.target.value;
        console.log(value);

        let newAttribute = value;
        let newObjectives = copyLocalObjective();
        newObjectives.primaries.secondaries[primaryIndex].attributes[
          secondaryIndex
        ].attribute[attributeIndex] = newAttribute;
        newObjectives.update = !localObjectives.update;
        setLocalObjectives(newObjectives);
      };

    const onChangeDataset =
      (primaryIndex: number, secondaryIndex: number, attributeIndex: number) =>
      (e: any) => {
        let newDatasetName = JSON.parse(e.target.value).name;
        let newDatasetId = JSON.parse(e.target.value).id;
        let newObjectives = copyLocalObjective();
        newObjectives.primaries.secondaries[primaryIndex].attributes[
          secondaryIndex
        ].datasets[attributeIndex] = { name: newDatasetName, id: newDatasetId };
        newObjectives.update = !localObjectives.update;
        setLocalObjectives(newObjectives);
      };
    /* Fin **************/

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
      primaryIndex,
      secondaryIndex,
      defaultAttribute,
      defaultDataset,
    }: FactoryProps): ReactElement | ReactElement[] => {
      // TODO: Link with Control to prevent lose-focus bug when typing in field
      // const attributeNameRef: RefObject<HTMLSpanElement> = createRef();

      return [
        <Control
          label="attribute"
          key={key('attribute_') + localObjectives.update}
          name="attribute"
          defaultValue={
            localObjectives.primaries.secondaries[primaryIndex].attributes[
              secondaryIndex
            ].attribute[orderIndex]
          }
          required
          suffix={<React.Fragment></React.Fragment>}
          onChange={onChangeAttribute(primaryIndex, secondaryIndex, orderIndex)}
          //tooltip={t("the modeler's name will ...")}
        />,
        <Select
          hideLabel
          key={key('dataset') + localObjectives.update}
          name={name('dataset')}
          defaultValue={defaultDataset}
          label={`dataset`}
          onChange={(e: any) => {
            onChangeDataset(primaryIndex, secondaryIndex, orderIndex)(e);
          }}
          options={generateOptionsDataset(
            primaryIndex,
            secondaryIndex,
            orderIndex
          )}
        />,
      ];
    };

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
      primaryIndex,
      secondaryIndex,
      childrenValues: attributes,
    }: FactoryProps): ReactElement | ReactElement[] => [
      <Select
        hideLabel
        label={`secondary objective ${orderIndex}`}
        key={key('secondary') + localObjectives.update}
        name={name('secondary')}
        defaultValue={defaultValue}
        onChange={(e: any) => {
          onChangeSecondary(primaryIndex, secondaryIndex)(e);
        }}
        options={generateOptionsSecondary(primaryIndex, orderIndex)}
      />,
      <ExpandableList
        hideLabel
        key={key('attributes') + localObjectives.update}
        name={name('attributes')}
        factory={attributesFactory}
        label="attributes"
        controls={getAttribute(primaryIndex, secondaryIndex).map(
          (defaultAttribute: string, index: number) => ({
            defaultAttribute,
            primaryIndex,
            secondaryIndex,
            attributeIndex: index,
            attributeOptions: attributes.attributeOptions,
          })
        )}
        onAddControl={onAddAttribute(primaryIndex, secondaryIndex)}
        onRemoveControl={onRemoveAttribute(primaryIndex, secondaryIndex)}
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
      primaryIndex,
      orderIndex,
      primary,
      childrenValues: secondaries,
    }: FactoryProps): ReactElement | ReactElement[] => [
      <Select
        hideLabel
        label={`primary objective ${orderIndex}`}
        key={key('primary') + localObjectives.update}
        name={name('primary')}
        defaultValue={primary}
        onChange={(e: any) => {
          onChangePrimary(orderIndex)(e);
        }}
        options={generateOptionsPrimary(orderIndex)}
      />,
      <ExpandableList
        hideLabel
        key={key('secondaries') + localObjectives.update}
        name={name('secondaries')}
        factory={secondaryObjectivesFactory}
        label="secondary objectives"
        controls={getSecondary(orderIndex).map(
          (defaultValueSecondary: string, index: number) => ({
            defaultValue: defaultValueSecondary,
            primaryIndex,
            secondaryIndex: index,
            primary,
            childrenValues: getAttribute(orderIndex, index),
          })
        )}
        onAddControl={onAddSecondary(primaryIndex)}
        onRemoveControl={onRemoveSecondary(primaryIndex)}
      />,
    ];

    const mainControls = [
      <Select
        key="main"
        name="main"
        label={'Objectives'}
        //defaultValue={'h'}
        options={generateOptionsMain()}
      />,
      <ExpandableList
        hideLabel
        key={`primaries.0` + localObjectives.update + isLoading}
        name={`primaries.0`}
        factory={primaryObjectivesFactory}
        label={'primary objectives'}
        controls={getPrimary().map((primary: string, index: number) => ({
          primary,
          primaryIndex: index,
          childrenValues: getSecondary(index),
        }))}
        onAddControl={onAddPrimary()}
        onRemoveControl={onRemovePrimary()}
      />,
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
      onSubmit={() => {
        if (isValidOH(localObjectives)) {
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
            } as CallModel<[string, any], void, LoadingValue<string>, string, string>)
          );
        } else {
          console.warn('Invalid objective hierarchy');
        }
      }}
    />
  );
}

export default withTranslation()(ObjectiveHierarchy);
