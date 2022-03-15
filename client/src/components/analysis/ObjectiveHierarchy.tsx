import React, { ReactElement, useState } from 'react';
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
import objectivesData from '../../data/objectives.json';
import { stringify, StringifyOptions } from 'querystring';

//TODO : ajout d'un objectif => options selon l'objectif parent
//TODO : update d'un objectif => clear des objectifs enfants et updates de leurs options

function ObjectiveHierarchy({ t }: any) {
  // remove me to log stuff
  console.log = () => {};

  const dispatch = useAppDispatch();
  const {
    objectives: {
      main: mainValue,
      options: mainValueOptions,
      primaries: [primaries],
    },
  } = useAppSelector(selectAnalysis);

  const [localPrimaries, setLocalPrimaries] = useState(
    JSON.parse(JSON.stringify(primaries)) as typeof primaries
  );

  const getAllPrimaryOptions = () => {
    var options: string[] = [];
    var objectiveHierachyData =
      (objectivesData?.mains[0]?.primaries as any) ?? [];
    objectiveHierachyData.map((json: { primary: string }) => {
      options.push(json.primary);
    });
    return options;
  };

  const getAllSecondaryOptions = (primary: string) => {
    var options: string[] = [];
    objectivesData?.mains[0]?.primaries?.map(json => {
      if (json.primary == primary) {
        json.secondaries.map(json => {
          options.push(json.secondary);
        });
      }
    });
    return options;
  };

  const computeOptions = () => {
    var primaryOptions: string[] = getAllPrimaryOptions();

    let secondariesOptions: { primary: string; secondary: string[] }[] = [];
    localPrimaries.primary.map(primary => {
      primaryOptions.splice(primaryOptions.indexOf(primary), 1);
      var secondaryOptions: string[] = getAllSecondaryOptions(primary);
      console.log('secondaryOptions', secondaryOptions);
      localPrimaries.secondaries[
        localPrimaries.primary.indexOf(primary)
      ].secondary.map(secondary => {
        secondaryOptions.splice(secondaryOptions.indexOf(secondary));
      });
      secondariesOptions.push({
        primary: primary,
        secondary: secondaryOptions,
      });
    });
    console.log('computeOptions', secondariesOptions);
    return { primary: primaryOptions, secondaries: secondariesOptions };
  };
  const [localOptions, setLocalOptions] = useState(computeOptions());

  const adjustOptions = () => {
    setLocalOptions(computeOptions());
  };

  //adjust options

  //ajouter des options à localPrimaries

  var localMainValue = JSON.parse(
    JSON.stringify(mainValue)
  ) as typeof mainValue;

  var localMainValueOptions = JSON.parse(
    JSON.stringify(mainValueOptions)
  ) as typeof mainValueOptions;

  //Add

  const onAddPrimary = () => () => {
    if (localPrimaries.options.length > 0) {
      let newPrimary = [...localPrimaries.primary];
      let newOptions = [...localPrimaries.options];
      newPrimary.push(localPrimaries.options[0]);
      newOptions.splice(0, 1);
      //console.log(newOptions);
      //console.log('newPrimary', newPrimary, 'newOptions', newOptions);
      let newSecondaries = [...localPrimaries.secondaries];
      let secondariesOptions: string[] = ['z', 'x', 'y'];
      newSecondaries.push({
        secondary: [],
        options: secondariesOptions,
        attributes: [],
      });
      setLocalPrimaries({
        primary: newPrimary,
        secondaries: newSecondaries,
        //todo
        options: newOptions,
      });
      //console.log('onAddPrimary', localPrimaries);
      adjustOptions();
    }
  };

  const onAddSecondary = (primaryIndex: number) => () => {
    var newSecondaries = [...localPrimaries.secondaries];
    var objectiveHierachyData =
      (objectivesData?.mains[0]?.primaries as any) ?? [];
    var newSecondaryDefault = objectiveHierachyData[
      primaryIndex
    ].secondaries.some(function (json: { secondary: string }) {
      if (
        !localPrimaries.secondaries[primaryIndex].secondary.includes(
          json.secondary
        )
      )
        return json.secondary;
      else return undefined;
    });
    if (newSecondaryDefault) {
      newSecondaries[primaryIndex].secondary.push(newSecondaryDefault);
      newSecondaries[primaryIndex].attributes.push({
        attribute: [],
        attributeOptions: [],
      });
      setLocalPrimaries({
        primary: localPrimaries.primary,
        secondaries: newSecondaries,
        options: localPrimaries.options,
      });
      //console.log(localPrimaries);
    }
    adjustOptions();
  };

  const onAddAttribute =
    (primaryIndex: number, secondaryIndex: number) => () => {
      var newSecondaries = [...localPrimaries.secondaries];
      newSecondaries[primaryIndex].attributes[secondaryIndex].attribute.push(
        ''
      );
      setLocalPrimaries({
        primary: localPrimaries.primary,
        secondaries: newSecondaries,
        options: localPrimaries.options,
      });
    };

  //remove

  const onRemovePrimary = () => (primaryIndex: number) => {
    var newPrimary = [...localPrimaries.primary];
    var newOptions = [...localPrimaries.options];
    newPrimary.splice(primaryIndex, 1);
    newOptions.push(localPrimaries.primary[primaryIndex]);
    var newSecondaries = [...localPrimaries.secondaries];
    newSecondaries.splice(primaryIndex, 1);
    setLocalPrimaries({
      primary: newPrimary,
      secondaries: newSecondaries,
      options: newOptions,
    });
    adjustOptions();
  };

  const onRemoveSecondary =
    (primaryIndex: number) => (secondaryIndex: number) => {
      var newSecondaries = [...localPrimaries.secondaries];
      newSecondaries[primaryIndex].secondary.splice(secondaryIndex, 1);
      newSecondaries[primaryIndex].attributes.splice(secondaryIndex, 1);
      setLocalPrimaries({
        primary: localPrimaries.primary,
        secondaries: newSecondaries,
        options: localPrimaries.options,
      });
      adjustOptions();
    };

  const onRemoveAttribute =
    (primaryIndex: number, secondaryIndex: number) =>
    (attributeIndex: number) => {
      var newSecondaries = [...localPrimaries.secondaries];
      newSecondaries[primaryIndex].attributes[secondaryIndex].attribute.splice(
        attributeIndex,
        1
      );
      setLocalPrimaries({
        primary: localPrimaries.primary,
        secondaries: newSecondaries,
        options: localPrimaries.options,
      });
      adjustOptions();
    };

  //Options

  const generateOptionsMain = () => {
    return objectivesData?.mains.map(
      json =>
        ({
          value: `${json?.main}`,
          label: `${json?.main}`,
        } as FormSelectOptionModel)
    );
  };

  const generateOptionsPrimaries = (primaryIndex: number) => {
    /*
    var options: string[] = [];
    objectivesData?.mains[0]?.primaries?.map(json => {
      if (
        !localPrimaries.primary.includes(json.primary) ||
        localPrimaries.primary[primaryIndex] == json.primary
      ) {
        options.push(json.primary);
      }
    });
    */

    var primaryValue = localPrimaries.primary[primaryIndex];
    var options: string[] = [...localOptions.primary];
    options.splice(options.indexOf(primaryValue), 1);
    options.unshift(primaryValue);
    return options.map(
      json =>
        ({
          value: `${json}`,
          label: `${json}`,
        } as FormSelectOptionModel)
    );
  };

  const generateOptionsSecondaries = (
    primaryIndex: number,
    secondaryIndex: number
  ) => {
    var primaryValue = localPrimaries.primary[primaryIndex];
    console.log(
      'generateOptionsSecondaries',
      localPrimaries.secondaries[primaryIndex]
    );
    var secondaryValue =
      localPrimaries.secondaries[primaryIndex].secondary[secondaryIndex];
    var options: string[] = [];

    localOptions.secondaries.map(value => {
      if (value.primary == primaryValue) {
        options = value.secondary;
      }
    });
    console.log(
      'generateOptionsSecondaries',
      primaryValue,
      secondaryValue,
      options
    );

    options.splice(options.indexOf(secondaryValue), 1);
    options.unshift(secondaryValue);
    console.log('generateOptionsSecondaries', options);

    /*
    var options: string[] = [];
    var objectiveHierachyData =
      (objectivesData?.mains[0]?.primaries as any) ?? [];
    objectiveHierachyData[primaryIndex].secondaries.map(
      (json: { secondary: string }) => {
        if (
          !localPrimaries.secondaries[primaryIndex].secondary.includes(
            json.secondary
          ) ||
          localPrimaries.secondaries[primaryIndex].secondary[secondaryIndex] ==
            json.secondary
        ) {
          options.push(json.secondary);
        }
      }
    );
    */

    // 2: afficher

    return options?.map(
      json =>
        ({
          value: `${json}`,
          label: `${json}`,
        } as FormSelectOptionModel)
    );
  };

  const generateOptionsAttributes = (
    primaryIndex: number,
    secondaryIndex: number,
    attributeIndex: number
  ) => {
    var options: string[] = [];
    var objectiveHierachyData =
      (objectivesData?.mains[0]?.primaries as any) ?? [];
    objectiveHierachyData[primaryIndex].secondaries[
      secondaryIndex
    ].attributes.map((json: any) => {
      if (
        !localPrimaries.secondaries[primaryIndex].secondary.includes(
          json.secondary
        ) ||
        localPrimaries.secondaries[primaryIndex].secondary[secondaryIndex] ==
          json.secondary
      ) {
        options.push(json.secondary);
      }
    });

    // 2: afficher

    return options?.map(
      json =>
        ({
          value: `${json}`,
          label: `${json}`,
        } as FormSelectOptionModel)
    );
  };

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
          label: `${text} ${value} `,
        } as FormSelectOptionModel)
    );

  const onChangeSecondarySelect =
    (index: number, primaryIndex: number) => (e: any) => {
      // index: index du secondary objective qui a été modifié
      // primaryIndex: index de son primary objective associé

      //console.log('onChangeSecondarySelect', index, primaryIndex);
      //console.log(localPrimaries);

      // valeur du nouveau secondary objective
      const newSecondaryObj = e.target.value;

      // update la valeur du secondary objective dans le new array
      //console.log('debug', primaryIndex, localPrimaries.secondaries);
      let newSecondaryObjectifArray = [
        ...localPrimaries.secondaries[primaryIndex].secondary,
      ];
      newSecondaryObjectifArray[index] = newSecondaryObj;

      //update la valeur des attributes du secondary objective modifié
      let newAttributesObjectifArray = [
        ...localPrimaries.secondaries[primaryIndex].attributes,
      ];
      //console.log(localPrimaries);

      // update options for attributes
      let newAttributesOptions: string[] = ['a', 'b', 'c', 'd'];
      newAttributesObjectifArray[index] = {
        attribute: [],
        attributeOptions: newAttributesOptions,
      };
      let newSecondariesObjectifArray = [...localPrimaries.secondaries];
      newSecondariesObjectifArray[primaryIndex].secondary =
        newSecondaryObjectifArray;
      newSecondariesObjectifArray[primaryIndex].attributes =
        newAttributesObjectifArray;

      //filter options for primary
      setLocalPrimaries({
        primary: localPrimaries.primary,
        secondaries: newSecondariesObjectifArray,
        //todo
        options: [...localPrimaries.options],
      });
      adjustOptions();
    };

  const onChangePrimarySelect = (index: any) => (e: any) => {
    const newPrimaryValue = e.target.value;
    const lastPrimaryValue = localPrimaries.primary[index];

    let newPrimary = [...localPrimaries.primary];
    let newOptions = [...localPrimaries.options];

    //Update primary list and primary options
    newPrimary[index] = newPrimaryValue;
    newOptions.splice(localPrimaries.options.indexOf(newPrimaryValue));
    newOptions.push(lastPrimaryValue);

    // update options for secondary
    let newSecondaries = [...localPrimaries.secondaries];
    const newSecondariesOptions: string[] = [];
    objectivesData?.mains[0]?.primaries?.map(json => {
      if (json.primary == newPrimaryValue) {
        json.secondaries.map(json => {
          newSecondariesOptions.push(json.secondary);
        });
      }
    });
    newSecondaries[index] = {
      secondary: [],
      attributes: [],
      options: newSecondariesOptions,
    };

    //filter options for primary
    setLocalPrimaries({
      primary: newPrimary,
      secondaries: newSecondaries,
      //todo
      options: newOptions,
    });
    adjustOptions();
  };

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
    defaultAttribute,
    defaultDataset,
  }: FactoryProps): ReactElement | ReactElement[] => [
    <Select
      hideLabel
      key={key('attribute')}
      name={name('attribute')}
      defaultValue={defaultAttribute}
      label={`attribute ${orderIndex}`}
      options={generateOptions('attribute', 3)}
    />,
    <Select
      hideLabel
      key={key('dataset')}
      name={name('dataset')}
      defaultValue={defaultDataset}
      label={`dataset`}
      options={generateOptions('Dataset', 3)}
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
    primaryObjIndex,
    secondaryObjIndex,
    childrenValues: attributes,
  }: FactoryProps): ReactElement | ReactElement[] => [
    <Select
      hideLabel
      label={`secondary objective ${orderIndex}`}
      key={key('secondary')}
      name={name('secondary')}
      defaultValue={defaultValue}
      onChange={(e: any) => {
        onChangeSecondarySelect(secondaryObjIndex, primaryObjIndex)(e);
      }}
      options={generateOptionsSecondaries(primaryObjIndex, orderIndex)}
    />,
    <ExpandableList
      hideLabel
      key={key('attributes')}
      name={name('attributes')}
      factory={attributesFactory}
      label="attributes"
      controls={attributes?.attribute?.map((defaultAttribute: string) => ({
        defaultAttribute,
        attributeOptions: attributes.attributeOptions,
      }))}
      onAddControl={onAddAttribute(primaryObjIndex, secondaryObjIndex)}
      onRemoveControl={onRemoveAttribute(primaryObjIndex, secondaryObjIndex)}
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
    primaryObjIndex,
    orderIndex,
    primary,
    childrenValues: secondaries,
  }: FactoryProps): ReactElement | ReactElement[] => [
    <Select
      hideLabel
      label={`primary objective ${orderIndex}`}
      key={key('primary')}
      name={name('primary')}
      defaultValue={primary}
      onChange={(e: any) => {
        onChangePrimarySelect(orderIndex)(e);
      }}
      options={generateOptionsPrimaries(orderIndex)}
    />,
    <ExpandableList
      hideLabel
      key={key('secondaries')}
      name={name('secondaries')}
      factory={secondaryObjectivesFactory}
      label="secondary objectives"
      controls={localPrimaries.secondaries[orderIndex].secondary?.map(
        (defaultValueSecondary: string, index: number) => ({
          defaultValue: defaultValueSecondary,
          primaryObjIndex,
          secondaryObjIndex: index,
          primary,
          childrenValues:
            localPrimaries.secondaries[orderIndex].attributes[index],
        })
      )}
      onAddControl={onAddSecondary(primaryObjIndex)}
      onRemoveControl={onRemoveSecondary(primaryObjIndex)}

      //controls={secondaries?.secondary?.map(
      //  (defaultValueSecondary: string, index: number) => ({
      //    defaultValue: defaultValueSecondary,
      //    primary: defaultValue,
      //    childrenValues: secondaries?.attributes[index],
      //  })
      // )}
    />,
  ];

  const mainControls = [
    <Select
      key="main"
      name="main"
      label={'Objectives'}
      defaultValue={localMainValue}
      options={generateOptionsMain()}
    />,
    <ExpandableList
      hideLabel
      key={`primaries.0`}
      name={`primaries.0`}
      factory={primaryObjectivesFactory}
      label={'primary objectives'}
      controls={localPrimaries?.primary?.map(
        (primary: string, index: number) => ({
          primary,
          primaryObjIndex: index,
          childrenValues: localPrimaries?.secondaries[index],
        })
      )}
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
      onSubmit={(fields: any) => dispatch(updateObjectives(fields))}
    />
  );
}

export default withTranslation()(ObjectiveHierarchy);
