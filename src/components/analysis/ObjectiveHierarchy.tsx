import React, { ReactElement, useRef, useState } from 'react';
import _, { capitalize, cloneDeep } from 'lodash';
import { withTranslation } from 'react-i18next';
import FormSelectOptionModel from 'models/form/FormSelectOptionModel';
import ShapefileModel, { DefaultShapefile } from 'models/ShapefileModel';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import Form from 'components/forms/Form';
import { call } from 'store/reducers/server';
import {
  Button,
  Spacer,
  Select,
  ExpandableList,
  Control,
  Checkbox,
} from 'components/forms/components';
import {
  selectAnalysis,
  injectSetLoadingCreator,
  injectSetErrorCreator,
} from 'store/reducers/analysis';
import { FactoryProps } from 'components/forms/components/FormExpandableList';
import CallModel from 'models/server-coms/CallModel';
import LoadingValue from 'models/LoadingValue';
import ServerCallTargets from 'enums/ServerCallTargets';
import ObjectivesHierarchyModel from 'models/AnalysisObjectivesModel';
import DatasetModel, {
  DefaultDataset,
  DefaultValueScalingProperties,
} from 'models/DatasetModel';
import ValueScalingProperties from 'models/DatasetModel';
import { flatten } from 'flattenizer';

function isValidOH(objectiveHierarchy: ObjectivesHierarchyModel) {
  const atLeastOnePrimary = objectiveHierarchy.primaries.primary.length > 0;
  let primaryHasSecondary = true;
  let secondaryHasAttribute = true;
  let attributeHasName = true;
  objectiveHierarchy.primaries.secondaries.forEach(secondaries => {
    primaryHasSecondary =
      primaryHasSecondary && secondaries.secondary.length > 0;
    secondaries.attributes.forEach(attributes => {
      secondaryHasAttribute =
        secondaryHasAttribute && attributes.attribute.length > 0;
      attributes.attribute.forEach(
        attributeName =>
          (attributeHasName = attributeHasName && attributeName.length > 0)
      );
    });
  });
  return (
    atLeastOnePrimary &&
    primaryHasSecondary &&
    secondaryHasAttribute &&
    attributeHasName
  );
}

function findMissingAttributes(objectiveHierarchy: ObjectivesHierarchyModel) {
  return objectiveHierarchy.primaries.secondaries
    .map((secondaries, sindex) =>
      secondaries.attributes.map((attributes, aindex) =>
        attributes.attribute.length === 0
          ? `"${objectiveHierarchy.primaries.primary[sindex]}/${secondaries.secondary[aindex]}"`
          : undefined
      )
    )
    .flat()
    .filter(attribute => attribute !== undefined);
}

function findDuplicateAttributes(objectiveHierarchy: ObjectivesHierarchyModel) {
  const attributes: string[] = Object.entries(flatten(objectiveHierarchy)!)
    .filter(([key]) =>
      /primaries\.(?:primary|secondaries\.\d+\.(?:secondary|attributes\.\d+\.attribute))/.test(
        key
      )
    )
    .map(([_, value]) => `${value}`);
  return _(attributes)
    .groupBy()
    .pickBy(attribute => attribute.length > 1)
    .keys()
    .value();
}

function ObjectiveHierarchy({ t, disabled }: any) {
  const property = 'objectives';
  const selector = useAppSelector(selectAnalysis);
  const objectives = selector.properties.objectives;
  const objectivesData = selector.properties.objectives_data;
  const dispatch = useAppDispatch();
  const files =
    selector.properties['shapefiles'].length > 0
      ? (selector.properties['shapefiles'] as ShapefileModel[])
      : ([] as ShapefileModel[]);
  const getErrors = selector.properties.objectivesError;
  const isLoading = selector.properties.objectivesLoading;

  const [localObjectives, setLocalObjectives] = useState({
    ...(objectives as ObjectivesHierarchyModel),
    update: true,
  });

  const logError = (message: string) => {
    console.error(message);
    dispatch(injectSetErrorCreator(property)(message));
  };

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

    const getShapefiles = (name: string) => {
      return files.filter((file: any) => {
        return file.name == name;
      }) as ShapefileModel[];
    };

    const getAllMainOptions = () => {
      const options: string[] = [];
      objectivesData.mains.map((json: { main: string }) => {
        options.push(json.main);
      });
      return options;
    };

    const getAllPrimaryOptions = (main: string) => {
      const options: string[] = [];

      objectivesData.mains.map((json: { main: string; primaries: any[] }) => {
        if (json.main == main) {
          json.primaries?.map(json => {
            options.push(json.primary);
          });
        }
      });
      return options;
    };

    const getAllSecondaryOptions = (main: string, primary: string) => {
      const options: string[] = [];
      objectivesData?.mains.map((json: { main: string; primaries: any[] }) => {
        if (json.main == main) {
          json.primaries.map(
            (json: { primary: string; secondaries: any[] }) => {
              if (json.primary == primary) {
                json.secondaries.map(json => {
                  options.push(json.secondary);
                });
              }
            }
          );
        }
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
      const options = [localObjectives.main];
      getAllMainOptions().map(main => {
        if (main != localObjectives.main) options.push(main);
      });
      return formatOptions(options);
    };

    const getUnusedPrimary = () => {
      const unused: string[] = [];
      getAllPrimaryOptions(localObjectives.main).map(primary => {
        if (!localObjectives.primaries.primary.includes(primary))
          unused.push(primary);
      });
      return unused;
    };
    const getUnusedSecondary = (main: string, primaryIndex: number) => {
      const unused: string[] = [];
      getAllSecondaryOptions(
        localObjectives.main,
        primaryName(primaryIndex)
      ).map(secondary => {
        if (
          !localObjectives.primaries.secondaries[
            primaryIndex
          ].secondary.includes(secondary)
        )
          unused.push(secondary);
      });
      return unused;
    };

    const generateOptionsPrimary = (primaryIndex: number) => {
      const options = [
        localObjectives.primaries.primary[primaryIndex],
        ...getUnusedPrimary(),
      ];
      return formatOptions(options);
    };

    const generateOptionsSecondary = (
      primaryIndex: number,
      secondaryIndex: number
    ) => {
      const options = [
        localObjectives.primaries.secondaries[primaryIndex].secondary[
          secondaryIndex
        ],
        ...getUnusedSecondary(localObjectives.main, primaryIndex),
      ];

      return formatOptions(options);
    };
    const defaultSecondaries = {
      secondary: [] as string[],
      weights: [] as number[],
      attributes: [] as {
        attribute: string[];
        weights: number[];
        datasets: DatasetModel[];
      }[],
    };

    const defaultPrimaries = {
      primary: [] as string[],
      weights: [] as number[],
      secondaries: [],
    };
    const defaultAttributes = { attribute: [], weights: [], datasets: [] };

    const generateOptionsDataset = (
      primaryIndex: number,
      secondaryIndex: number,
      attributeIndex: number
    ) => {
      const currentDataset =
        localObjectives.primaries.secondaries[primaryIndex].attributes[
          secondaryIndex
        ].datasets[attributeIndex];
      const options: ShapefileModel[] = [];

      if (files.length > 0) {
        files.map((f: ShapefileModel) => {
          if (f.name != currentDataset.name) options.push(f);
          else options.unshift(f);
        });
      }

      return options.map(
        f =>
          ({
            value: `${JSON.stringify({ name: f.name })}`,
            label: `${f.name}`,
          } as FormSelectOptionModel)
      );
    };

    const generateOptionsColumns = (
      primaryIndex: number,
      secondaryIndex: number,
      attributeIndex: number
    ) => {
      const currentDataset =
        localObjectives.primaries.secondaries[primaryIndex].attributes[
          secondaryIndex
        ].datasets[attributeIndex];
      const options: string[] = [];
      const optionsIndex: number[] = [];

      if (files.length > 0) {
        files.forEach((f: any) => {
          if (f.name == currentDataset.name) {
            f.column_names.forEach((column: string, index: number) => {
              if (column != currentDataset.column) {
                options.push(column);
                optionsIndex.push(index);
              } else {
                options.unshift(currentDataset.column);
                optionsIndex.unshift(index);
              }
            });
          }
        });
      }

      return options.map(
        (column, index) =>
          ({
            value: `${JSON.stringify({
              column: column,
              index: optionsIndex[index],
            })}`,
            label: `${column}`,
          } as FormSelectOptionModel)
      );
    };

    const onAddPrimary = () => () => {
      const unused = getUnusedPrimary();
      const newDefault = unused.length > 0 ? unused[0] : undefined;
      if (newDefault !== undefined) {
        const newObjectives = copyLocalObjective();
        newObjectives.primaries.primary.push(newDefault);
        newObjectives.primaries.secondaries.push(defaultSecondaries);
        newObjectives.primaries.weights.push(1);
        newObjectives.update = !localObjectives.update;
        setLocalObjectives(newObjectives);
      }
    };

    const onAddSecondary = (primaryIndex: number) => () => {
      const unused = getUnusedSecondary(localObjectives.main, primaryIndex);
      const newDefault = unused.length > 0 ? unused[0] : undefined;
      if (newDefault !== undefined) {
        const newObjectives = copyLocalObjective();
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
        const newObjectives = copyLocalObjective();
        newObjectives.primaries.secondaries[primaryIndex].attributes[
          secondaryIndex
        ].attribute.push('');
        const defaultShapefile = files.length > 0 ? files[0] : DefaultShapefile;
        const defaultColumn =
          defaultShapefile.column_names.length > 0
            ? defaultShapefile.column_names[0]
            : DefaultDataset.column;

        console.log('OH');
        const defaultProperties = {
          ...DefaultValueScalingProperties,
          distribution:
            defaultColumn in defaultShapefile.categories
              ? defaultShapefile.categories[defaultColumn]
              : [],
          distribution_value:
            defaultColumn in defaultShapefile.categories
              ? new Array<number>(
                  defaultShapefile.categories[defaultColumn].length
                ).fill(0)
              : [],
        } as ValueScalingProperties;
        const defaultDataset = {
          ...DefaultDataset,
          name: defaultShapefile.name,
          column: defaultColumn,
          type:
            defaultShapefile.type.length > 0
              ? defaultShapefile.type[0]
              : DefaultDataset.type,
          properties: defaultProperties,
          max_value:
            defaultShapefile.max_value.length > 0
              ? defaultShapefile.max_value[0]
              : DefaultDataset.max_value,
          min_value:
            defaultShapefile.min_value.length > 0
              ? defaultShapefile.min_value[0]
              : DefaultDataset.min_value,
        } as unknown;
        newObjectives.primaries.secondaries[primaryIndex].attributes[
          secondaryIndex
        ].datasets.push(defaultDataset as DatasetModel);

        newObjectives.primaries.secondaries[primaryIndex].attributes[
          secondaryIndex
        ].weights.push(1);
        newObjectives.update = !localObjectives.update;
        setLocalObjectives(newObjectives);
      };

    const onRemovePrimary = () => (primaryIndex: number) => {
      const newObjectives = copyLocalObjective();
      newObjectives.primaries.primary.splice(primaryIndex, 1);
      newObjectives.primaries.secondaries.splice(primaryIndex, 1);
      newObjectives.primaries.weights.splice(primaryIndex, 1);
      newObjectives.update = !localObjectives.update;
      setLocalObjectives(newObjectives);
    };
    const onRemoveSecondary =
      (primaryIndex: number) => (secondaryIndex: number) => {
        const newObjectives = copyLocalObjective();
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
        const newObjectives = copyLocalObjective();
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

    const onChangeMain = () => (e: any) => {
      const newPrimary = e.target.value;
      const newObjectives = copyLocalObjective();
      newObjectives.main = newPrimary;
      newObjectives.primaries = defaultPrimaries;
      newObjectives.update = !localObjectives.update;
      setLocalObjectives(newObjectives);
    };

    const onChangePrimary = (primaryIndex: number) => (e: any) => {
      const newPrimary = e.target.value;
      const newObjectives = copyLocalObjective();
      newObjectives.primaries.primary[primaryIndex] = newPrimary;
      newObjectives.primaries.secondaries[primaryIndex] = defaultSecondaries;
      newObjectives.update = !localObjectives.update;
      setLocalObjectives(newObjectives);
    };

    const onChangeSecondary =
      (primaryIndex: number, secondaryIndex: number) => (e: any) => {
        const newSecondary = e.target.value;
        const newObjectives = copyLocalObjective();
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
        const value = event.target.value;
        const newAttribute = value;
        const newObjectives = copyLocalObjective();
        newObjectives.primaries.secondaries[primaryIndex].attributes[
          secondaryIndex
        ].attribute[attributeIndex] = newAttribute;
        newObjectives.update = !localObjectives.update;
        setLocalObjectives(newObjectives);
      };

    const onChangeDataset =
      (primaryIndex: number, secondaryIndex: number, attributeIndex: number) =>
      (e: any) => {
        const newDatasetName = JSON.parse(e.target.value).name;
        const newDatasetShapefile = getShapefiles(newDatasetName)[0];
        const newObjectives = copyLocalObjective();

        const defaultColumn =
          newDatasetShapefile.column_names.length > 0
            ? newDatasetShapefile.column_names[0]
            : '';
        console.log(
          'TESTS',
          defaultColumn,
          defaultColumn in newDatasetShapefile.categories,
          newDatasetShapefile.categories
        );

        const defaultDataset = {
          ...DefaultDataset,
          name: newDatasetName,
          column: defaultColumn,
          type:
            newDatasetShapefile.type.length > 0
              ? newDatasetShapefile.type[0]
              : '',
          properties: {
            ...DefaultValueScalingProperties,
            distribution:
              defaultColumn in newDatasetShapefile.categories
                ? newDatasetShapefile.categories[defaultColumn]
                : [],
          },
        } as unknown as DatasetModel;
        newObjectives.primaries.secondaries[primaryIndex].attributes[
          secondaryIndex
        ].datasets[attributeIndex] = defaultDataset;
        newObjectives.update = !localObjectives.update;
        setLocalObjectives(newObjectives);
      };

    const onChangeColumn =
      (primaryIndex: number, secondaryIndex: number, attributeIndex: number) =>
      (e: any) => {
        const newColumn = JSON.parse(e.target.value).column;
        const newIndex = JSON.parse(e.target.value).index;

        const newObjectives = copyLocalObjective();

        newObjectives.primaries.secondaries[primaryIndex].attributes[
          secondaryIndex
        ].datasets[attributeIndex].column = newColumn;

        const dataset =
          newObjectives.primaries.secondaries[primaryIndex].attributes[
            secondaryIndex
          ].datasets[attributeIndex];

        const shapefile = getShapefiles(dataset.name);

        const newType = shapefile[0].type[newIndex];
        const newMax = shapefile[0].max_value[newIndex];
        const newMin = shapefile[0].min_value[newIndex];

        newObjectives.primaries.secondaries[primaryIndex].attributes[
          secondaryIndex
        ].datasets[attributeIndex].type = newType;
        newObjectives.primaries.secondaries[primaryIndex].attributes[
          secondaryIndex
        ].datasets[attributeIndex].max_value = newMax;
        newObjectives.primaries.secondaries[primaryIndex].attributes[
          secondaryIndex
        ].datasets[attributeIndex].min_value = newMin;

        if (newType == 'Categorical' || newType == 'Boolean') {
          const categories = shapefile[0].categories;
          console.log(categories);
          newObjectives.primaries.secondaries[primaryIndex].attributes[
            secondaryIndex
          ].datasets[attributeIndex].properties.distribution =
            categories[newColumn];
          newObjectives.primaries.secondaries[primaryIndex].attributes[
            secondaryIndex
          ].datasets[attributeIndex].properties.distribution_value =
            new Array<number>(categories[newColumn].length).fill(0);
        }

        newObjectives.update = !localObjectives.update;
        setLocalObjectives(newObjectives);
      };

    const onChangeIsCalculated =
      (primaryIndex: number, secondaryIndex: number, attributeIndex: number) =>
      (e: any) => {
        const newIsCalculated = e.target.checked;
        const newObjectives = copyLocalObjective();
        newObjectives.primaries.secondaries[primaryIndex].attributes[
          secondaryIndex
        ].datasets[attributeIndex].isCalculated = newIsCalculated;

        newObjectives.primaries.secondaries[primaryIndex].attributes[
          secondaryIndex
        ].datasets[attributeIndex].properties.distribution = [0, 1];
        newObjectives.primaries.secondaries[primaryIndex].attributes[
          secondaryIndex
        ].datasets[attributeIndex].properties.distribution_value = [0, 0];

        newObjectives.update = !localObjectives.update;
        setLocalObjectives(newObjectives);
      };
    const onChangeDistance =
      (primaryIndex: number, secondaryIndex: number, attributeIndex: number) =>
      (e: any) => {
        const newDistance = e.target.value;
        const newObjectives = copyLocalObjective();
        newObjectives.primaries.secondaries[primaryIndex].attributes[
          secondaryIndex
        ].datasets[attributeIndex].calculationDistance = newDistance;
        newObjectives.update = !localObjectives.update;
        setLocalObjectives(newObjectives);
      };
    const onChangeGranularity =
      (primaryIndex: number, secondaryIndex: number, attributeIndex: number) =>
      (e: any) => {
        const newGranularity = e.target.value as number;
        const newObjectives = copyLocalObjective();
        newObjectives.primaries.secondaries[primaryIndex].attributes[
          secondaryIndex
        ].datasets[attributeIndex].granularity = newGranularity;
        newObjectives.update = !localObjectives.update;
        setLocalObjectives(newObjectives);
      };

    const onChangeCentroid =
      (primaryIndex: number, secondaryIndex: number, attributeIndex: number) =>
      (e: any) => {
        const newIsCentroid = e.target.checked;
        const newObjectives = copyLocalObjective();
        newObjectives.primaries.secondaries[primaryIndex].attributes[
          secondaryIndex
        ].datasets[attributeIndex].centroid = newIsCentroid;
        newObjectives.update = !localObjectives.update;
        setLocalObjectives(newObjectives);
      };

    /* Fin **************/

    const attributesFactory = ({
      name,
      key,
      orderIndex,
      primaryIndex,
      secondaryIndex,
      defaultAttribute,
    }: FactoryProps): ReactElement | ReactElement[] => {
      const continuousOptions: any[] = [];
      if (
        localObjectives.primaries.secondaries[primaryIndex].attributes[
          secondaryIndex
        ].datasets[orderIndex].type == 'Boolean'
      ) {
        continuousOptions.push(
          <Checkbox
            label={'use calculated distance'}
            key={key('isCalculated')}
            name={name('isCalculated')}
            checked={
              localObjectives.primaries.secondaries[primaryIndex].attributes[
                secondaryIndex
              ].datasets[orderIndex].isCalculated
            }
            onChange={(e: any) =>
              onChangeIsCalculated(primaryIndex, secondaryIndex, orderIndex)(e)
            }
          />
        );
        if (
          localObjectives.primaries.secondaries[primaryIndex].attributes[
            secondaryIndex
          ].datasets[orderIndex].isCalculated
        ) {
          continuousOptions.push(
            <Checkbox
              key={key('centroid') + localObjectives.update}
              label={'use centroid'}
              name={name('centroid')}
              checked={
                localObjectives.primaries.secondaries[primaryIndex].attributes[
                  secondaryIndex
                ].datasets[orderIndex].centroid
              }
              onChange={(e: any) =>
                onChangeCentroid(primaryIndex, secondaryIndex, orderIndex)(e)
              }
            />,
            <Control
              key={key('calculated_distance') + localObjectives.update}
              label={'distance'}
              name={name('calculated_distance')}
              defaultValue={
                localObjectives.primaries.secondaries[primaryIndex].attributes[
                  secondaryIndex
                ].datasets[orderIndex].calculationDistance
              }
              onBlur={onChangeDistance(
                primaryIndex,
                secondaryIndex,
                orderIndex
              )}
              type="number"
              tooltip={t('meter')}
            />,
            <Control
              label={'granularity'}
              key={key('granularity')}
              name={name('granularity')}
              defaultValue={
                localObjectives.primaries.secondaries[primaryIndex].attributes[
                  secondaryIndex
                ].datasets[orderIndex].granularity
              }
              onBlur={onChangeGranularity(
                primaryIndex,
                secondaryIndex,
                orderIndex
              )}
              type="number"
            />
          );
        }
      }

      return [
        <Control
          hideLabel
          label="attribute"
          placeholder="Attribute name"
          key={key('attribute')}
          name={name('attribute')}
          defaultValue={
            localObjectives.primaries.secondaries[primaryIndex].attributes[
              secondaryIndex
            ].attribute[orderIndex]
          }
          required
          onBlur={onChangeAttribute(primaryIndex, secondaryIndex, orderIndex)}
        />,
        <Select
          label="dataset"
          key={key('dataset') + localObjectives.update}
          name={name('dataset')}
          defaultValue={
            localObjectives.primaries.secondaries[primaryIndex].attributes[
              secondaryIndex
            ].datasets[orderIndex].name
          }
          onChange={(e: any) => {
            onChangeDataset(primaryIndex, secondaryIndex, orderIndex)(e);
          }}
          options={generateOptionsDataset(
            primaryIndex,
            secondaryIndex,
            orderIndex
          )}
        />,
        <Select
          label="column"
          key={key('column') + localObjectives.update}
          name={name('column')}
          defaultValue={
            localObjectives.primaries.secondaries[primaryIndex].attributes[
              secondaryIndex
            ].datasets[orderIndex].column
          }
          onChange={(e: any) => {
            onChangeColumn(primaryIndex, secondaryIndex, orderIndex)(e);
          }}
          options={generateOptionsColumns(
            primaryIndex,
            secondaryIndex,
            orderIndex
          )}
        />,
        ...continuousOptions,
      ];
    };

    /**
     * A factory that generates the secondary objective inputs on demand
     * @param props: name and key are generators, which require a string to generate the name and keys of the elements,
     *               orderIndex is the index at which it will be placed in the list
     *               any other parameters are parameters given in the "controls" field
     * @return A second order objective ReactElement
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
        key={'main' + localObjectives.update}
        name="main"
        label={'Objectives'}
        defaultValue={localObjectives.main}
        onChange={(e: any) => {
          onChangeMain()(e);
        }}
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
      <Button variant="outline-primary" loading={isLoading}>
        {capitalize(t('apply'))}
      </Button>,
    ];
  } else {
    controls = [<></>];
  }
  return (
    <Form
      controls={controls}
      errors={getErrors}
      disabled={isLoading || disabled}
      onSubmit={() => {
        const { update, ...oh } = cloneDeep(localObjectives);
        const missings = findMissingAttributes(oh);
        const duplicates = findDuplicateAttributes(oh);

        if (missings.length > 0) {
          logError(
            `Missing attributes for objectives: ${missings}. You can remove the objectives from the tree, or set the missing attributes.`
          );
        } else if (!isValidOH(oh)) {
          logError('Invalid objective hierarchy');
        } else if (duplicates.length > 0) {
          logError(`Duplicate objectives: ${duplicates}`);
        } else {
          dispatch(
            injectSetLoadingCreator({
              value: property,
              isLoading: true,
            } as LoadingValue<string>)()
          );
          dispatch(
            call({
              target: ServerCallTargets.Update,
              args: [property, oh],
              onSuccessAction: injectSetLoadingCreator({
                value: property,
                isLoading: false,
              } as LoadingValue<string>),
              onErrorAction: injectSetErrorCreator(property),
            } as CallModel)
          );
        }
      }}
    />
  );
}

export default withTranslation()(ObjectiveHierarchy);
