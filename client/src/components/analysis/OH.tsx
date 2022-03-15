import React, { ReactElement, useState } from 'react';
import { capitalize, filter } from 'lodash';
import { withTranslation } from 'react-i18next';
import FormSelectOptionModel from '../../models/form-models/FormSelectOptionModel';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import Form from '../form/Form';
import ObjectiveHierarchyModel from '../../models/ObjectiveHierarchyModel';
import objectivesData from '../../data/objectives.json';

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
//import objectivesData from '../../data/objectives.json';
import { stringify, StringifyOptions } from 'querystring';
import { MdNextWeek } from 'react-icons/md';

//TODO : ajout d'un objectif => options selon l'objectif parent
//TODO : update d'un objectif => clear des objectifs enfants et updates de leurs options

function ObjectiveHierarchy({ t }: any) {
  const dispatch = useAppDispatch();
  //const { files } = useAppSelector(selectAnalysis);

  const { objectives: objectives } = useAppSelector(selectAnalysis);

  const [localObjectives, setLocalObjectives] = useState({
    ...objectives,
    update: true,
  });

  const generateOptions = (text: string, n: number) =>
    Array.from(Array(n).keys()).map(
      (value: number) =>
        ({
          value: `${value}`,
          label: `${text} ${value} `,
        } as FormSelectOptionModel)
    );

  /* Début refactor ***************/

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
    var options: string[] = [];
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
        !localObjectives.primaries.secondaries[primaryIndex].secondary.includes(
          secondary
        )
      )
        unused.push(secondary);
    });
    return unused;
  };

  const getUnusedAttribute = (primaryIndex: number, secondaryIndex: number) => {
    let unused: string[] = [];
    getAllAttributesOptions(
      primaryName(primaryIndex),
      secondaryName(primaryIndex, secondaryIndex)
    ).map(attribute => {
      if (
        !localObjectives.primaries.secondaries[primaryIndex].attributes[
          secondaryIndex
        ].attribute.includes(attribute)
      )
        unused.push(attribute);
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

  const generateOptionsAttribute = (
    primaryIndex: number,
    secondaryIndex: number,
    attributeIndex: number
  ) => {
    let options = [
      localObjectives.primaries.secondaries[primaryIndex].attributes[
        secondaryIndex
      ].attribute[attributeIndex],
      ...getUnusedAttribute(primaryIndex, secondaryIndex),
    ];
    return formatOptions(options);
  };
  let defaultSecondaries = { secondary: [], attributes: [] };
  let defaultAttributes = { attribute: [], dataset: [] };

  const onAddPrimary = () => () => {
    let unused = getUnusedPrimary();
    let newDefault = unused.length > 0 ? unused[0] : undefined;
    if (newDefault !== undefined) {
      let newObjectives = copyLocalObjective();
      newObjectives.primaries.primary.push(newDefault);
      newObjectives.primaries.secondaries.push(defaultSecondaries);
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
      newObjectives.update = !localObjectives.update;
      setLocalObjectives(newObjectives);
    }
  };

  const onAddAttribute =
    (primaryIndex: number, secondaryIndex: number) => () => {
      let unused = getUnusedAttribute(primaryIndex, secondaryIndex);
      let newDefault = unused.length > 0 ? unused[0] : undefined;
      if (newDefault !== undefined) {
        let newObjectives = copyLocalObjective();
        newObjectives.primaries.secondaries[primaryIndex].attributes[
          secondaryIndex
        ].attribute.push(newDefault);
        newObjectives.primaries.secondaries[primaryIndex].attributes[
          secondaryIndex
        ].dataset.push('');
        newObjectives.update = !localObjectives.update;
        setLocalObjectives(newObjectives);
      }
    };

  const onRemovePrimary = () => (primaryIndex: number) => {
    let newObjectives = copyLocalObjective();
    newObjectives.primaries.primary.splice(primaryIndex, 1);
    newObjectives.primaries.secondaries.splice(primaryIndex, 1);
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
      ].dataset.splice(attributeIndex, 1);
      newObjectives.update = !localObjectives.update;
      setLocalObjectives(newObjectives);
    };

  const onChangePrimary = (primaryIndex: any) => (e: any) => {
    const newPrimaryValue = e.target.value;
    let newObjectives = copyLocalObjective();
    newObjectives.primaries.primary[primaryIndex] = newPrimaryValue;
    newObjectives.primaries.secondaries[primaryIndex] = defaultSecondaries;
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
  }: FactoryProps): ReactElement | ReactElement[] => [
    <Select
      hideLabel
      key={key('attribute') + localObjectives.update}
      name={name('attribute')}
      defaultValue={defaultAttribute}
      label={`attribute ${orderIndex}`}
      options={generateOptionsAttribute(
        primaryIndex,
        secondaryIndex,
        orderIndex
      )}
    />,
    <Select
      hideLabel
      key={key('dataset') + localObjectives.update}
      name={name('dataset')}
      defaultValue={defaultDataset}
      label={`dataset`}
      options={generateOptions('dataset', 3)}
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
        //onChangeSecondarySelect(secondaryObjIndex, primaryObjIndex)(e);
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
      key={`primaries.0` + localObjectives.update}
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

  const controls = [
    ...mainControls,
    <Spacer />,
    <Button className="w-100 btn-primary">{capitalize(t('apply'))}</Button>,
  ];

  return (
    <Form
      controls={controls}
      //onSubmit={(fields: any) => dispatch()}
    />
  );
}

export default withTranslation()(ObjectiveHierarchy);
