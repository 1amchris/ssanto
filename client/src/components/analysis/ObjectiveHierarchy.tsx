import { createRef, ReactElement, RefObject, useState } from 'react';
import { capitalize } from 'lodash';
import { withTranslation } from 'react-i18next';
import FormSelectOptionModel from 'models/form/FormSelectOptionModel';
import ShapefileModel, { DefaultShapefile } from 'models/ShapefileModel';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import Form from 'components/forms/Form';
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
import CallModel from 'models/server-coms/CallModel';
import LoadingValue from 'models/LoadingValue';
import ServerCallTargets from 'enums/ServerCallTargets';
import ObjectivesHierarchyModel from 'models/AnalysisObjectivesModel';
import React from 'react';
import DatasetModel, {
  DefaultDataset,
  DefaultValueScalingProperties,
} from 'models/DatasetModel';
import ValueScalingProperties from 'models/DatasetModel';

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
        datasets: DatasetModel[];
      }[];
    }[];
  };
}) {
  let primaryHasSecondary = true;
  let secondaryHasAttribute = true;
  let attributeHasName = true;
  let datasetsAreSelected = true;
  objectiveHierarchy.primaries.secondaries.map(json => {
    primaryHasSecondary = primaryHasSecondary && json.secondary.length > 0;
    json.attributes.map(json => {
      secondaryHasAttribute =
        secondaryHasAttribute && json.attribute.length > 0;
      json.attribute.map(
        attributeName =>
          (attributeHasName = attributeHasName && attributeName.length > 0)
      );
    });
  });
  return primaryHasSecondary && secondaryHasAttribute && attributeHasName;
}

function ObjectiveHierarchy({ t, disabled }: any) {
  const property = 'objectives';
  const selector = useAppSelector(selectAnalysis);
  const objectives = selector.properties.objectives;
  const dispatch = useAppDispatch();
  const files =
    selector.properties['shapefiles'].length > 0
      ? (selector.properties['shapefiles'] as ShapefileModel[])
      : ([] as ShapefileModel[]);
  const getErrors = selector.properties['objectivesError'];
  const isLoading = selector.properties['objectivesLoading'];

  const [localObjectives, setLocalObjectives] = useState({
    ...(objectives as ObjectivesHierarchyModel),
    update: true,
  });

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

    const secondaryName = (primaryIndex: number, secondaryIndex: number) => {
      return localObjectives.primaries.secondaries[primaryIndex].secondary[
        secondaryIndex
      ];
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
      let options: string[] = [];
      objectivesData?.mains.map((json: { main: string }) => {
        options.push(json.main);
      });
      return options;
    };

    const getAllPrimaryOptions = (main: string) => {
      let options: string[] = [];

      objectivesData.mains.map(json => {
        if (json.main == main) {
          json.primaries?.map(json => {
            options.push(json.primary);
          });
        }
      });
      return options;
    };

    const getAllSecondaryOptions = (primary: string) => {
      let options: string[] = [];
      objectivesData?.mains[0]?.primaries?.map(json => {
        if (json.primary == primary) {
          json.secondaries.map(json => {
            options.push(json.secondary);
          });
        }
      });
      return options;
    };

    const getAllAttributesOptions = (primary: string, secondary: string) => {
      let options: string[] = [];
      objectivesData?.mains[0]?.primaries?.map(json => {
        if (json.primary == primary) {
          json.secondaries.map(json => {
            if (json.secondary == secondary) {
              json.attributes.map(json => {
                options.push(json.attribute);
              });
            }
          });
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
      let options = [localObjectives.main];
      getAllMainOptions().map(main => {
        if (main != localObjectives.main) options.push(main);
      });
      return formatOptions(options);
    };

    const getUnusedPrimary = () => {
      let unused: string[] = [];
      getAllPrimaryOptions(localObjectives.main).map(primary => {
        if (!localObjectives.primaries.primary.includes(primary))
          unused.push(primary);
      });
      return unused;
    };
    const getUnusedSecondary = (primaryIndex: number) => {
      let unused: string[] = [];
      getAllSecondaryOptions(primaryName(primaryIndex)).map(secondary => {
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
    let defaultSecondaries = { secondary: [], weights: [], attributes: [] };
    let defaultAttributes = { attribute: [], weights: [], datasets: [] };

    const generateOptionsDataset = (
      primaryIndex: number,
      secondaryIndex: number,
      attributeIndex: number
    ) => {
      let currentDataset =
        localObjectives.primaries.secondaries[primaryIndex].attributes[
          secondaryIndex
        ].datasets[attributeIndex];
      let options: ShapefileModel[] = [];

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
      let options: string[] = [];
      let options_index: number[] = [];

      if (files.length > 0) {
        files.forEach((f: any) => {
          if (f.name == currentDataset.name) {
            f.column_names.forEach((column: string, index: number) => {
              if (column != currentDataset.column) {
                options.push(column);
                options_index.push(index);
              } else {
                options.unshift(currentDataset.column);
                options_index.unshift(index);
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
              index: options_index[index],
            })}`,
            label: `${column}`,
          } as FormSelectOptionModel)
      );
    };

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
          ].attribute.length == 0
        ) {
          let newObjectives = copyLocalObjective();
          newObjectives.primaries.secondaries[primaryIndex].attributes[
            secondaryIndex
          ].attribute.push('');
          let defaultShapefile = files.length > 0 ? files[0] : DefaultShapefile;
          let defaultDataset = {
            ...DefaultDataset,
            name: defaultShapefile.name,
            column:
              defaultShapefile.column_names.length > 0
                ? defaultShapefile.column_names[0]
                : '',
            type:
              defaultShapefile.type.length > 0 ? defaultShapefile.type[0] : '',
          } as DatasetModel;
          newObjectives.primaries.secondaries[primaryIndex].attributes[
            secondaryIndex
          ].datasets.push(defaultDataset as DatasetModel);

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
        let newAttribute = value;
        let newObjectives = copyLocalObjective();
        newObjectives.primaries.secondaries[primaryIndex].attributes[
          secondaryIndex
        ].attribute[attributeIndex] = newAttribute;
        newObjectives.update = !localObjectives.update;
        setLocalObjectives(newObjectives);
      };

    //DOING
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

        let defaultDataset = {
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
        } as DatasetModel;
        newObjectives.primaries.secondaries[primaryIndex].attributes[
          secondaryIndex
        ].datasets[attributeIndex] = defaultDataset;
        newObjectives.update = !localObjectives.update;
        setLocalObjectives(newObjectives);
      };

    const onChangeColumn =
      (primaryIndex: number, secondaryIndex: number, attributeIndex: number) =>
      (e: any) => {
        let newColumn = JSON.parse(e.target.value).column;
        let newIndex = JSON.parse(e.target.value).index;

        let newObjectives = copyLocalObjective();

        newObjectives.primaries.secondaries[primaryIndex].attributes[
          secondaryIndex
        ].datasets[attributeIndex].column = newColumn;

        const dataset =
          newObjectives.primaries.secondaries[primaryIndex].attributes[
            secondaryIndex
          ].datasets[attributeIndex];
        //get les shapefiles selon id, get categories selon colonne
        const shapefile = getShapefiles(dataset.name);

        let newType = shapefile[0].type[newIndex];
        let newMax = shapefile[0].max_value[newIndex];
        let newMin = shapefile[0].min_value[newIndex];

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
        let newIsCalculated = e.target.checked;
        let newObjectives = copyLocalObjective();
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
        let newDistance = e.target.value;
        let newObjectives = copyLocalObjective();
        newObjectives.primaries.secondaries[primaryIndex].attributes[
          secondaryIndex
        ].datasets[attributeIndex].calculationDistance = newDistance;
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
    }: FactoryProps): ReactElement | ReactElement[] => {
      let continuousOptions: any[] = [];
      if (
        localObjectives.primaries.secondaries[primaryIndex].attributes[
          secondaryIndex
        ].datasets[orderIndex].type == 'Boolean'
      ) {
        continuousOptions.push(
          <Control
            key={key('calculated_distance') + localObjectives.update}
            label={'calculated distance'}
            className="small position-relative d-flex"
            name={name('calculated_distance')}
            prefix={
              <React.Fragment>
                <input
                  type="checkbox"
                  checked={
                    localObjectives.primaries.secondaries[primaryIndex]
                      .attributes[secondaryIndex].datasets[orderIndex]
                      .isCalculated
                  }
                  onChange={onChangeIsCalculated(
                    primaryIndex,
                    secondaryIndex,
                    orderIndex
                  )}
                />
              </React.Fragment>
            }
            defaultValue={
              localObjectives.primaries.secondaries[primaryIndex].attributes[
                secondaryIndex
              ].datasets[orderIndex].calculationDistance
            }
            onChange={onChangeDistance(
              primaryIndex,
              secondaryIndex,
              orderIndex
            )}
            type="number"
            tooltip={t('meter')}
          />
        );
      }

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
          onChange={onChangeAttribute(primaryIndex, secondaryIndex, orderIndex)}
        />,
        <Select
          key={key('dataset') + localObjectives.update}
          name={name('dataset')}
          className="small position-relative d-flex"
          defaultValue={
            localObjectives.primaries.secondaries[primaryIndex].attributes[
              secondaryIndex
            ].datasets[orderIndex].name
          }
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
        <Select
          key={key('column') + localObjectives.update}
          name={name('column')}
          className="small position-relative d-flex"
          label={`column`}
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
          //tooltip={localObjectives.primaries.secondaries[primaryIndex].attributes[secondaryIndex].datasets[orderIndex].head[??????]}
        />,
        ...continuousOptions,
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
        //ajouter la validation de la OH
        if (isValidOH(localObjectives)) {
          dispatch(
            injectSetLoadingCreator({
              value: property,
              isLoading: true,
            } as LoadingValue<string>)()
          );
          dispatch(
            call({
              target: ServerCallTargets.Update,
              args: [property, localObjectives],
              onSuccessAction: injectSetLoadingCreator({
                value: property,
                isLoading: false,
              } as LoadingValue<string>),
              onErrorAction: injectSetErrorCreator(property),
            } as CallModel)
          );
        } else {
          console.warn('Invalid objective hierarchy');
        }
      }}
    />
  );
}

export default withTranslation()(ObjectiveHierarchy);
