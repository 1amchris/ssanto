import { capitalize, cloneDeep } from 'lodash';
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
import LoadingValue from 'models/LoadingValue';
import CallModel from 'models/server-coms/CallModel';
import ServerCallTargets from 'enums/ServerCallTargets';
import ObjectivesHierarchyModel from 'models/AnalysisObjectivesModel';
import Collapsible from 'components/Collapsible';

interface ScalesHierarchy {
  primaries: {
    secondaries: {
      attributes: {
        datasets: {
          properties: {
            missingDataSuitability: string;
            distribution_value: string[];
          };
        }[];
      }[];
    }[];
  };
}

const merge = (
  objectives: ObjectivesHierarchyModel,
  scales: ScalesHierarchy
): ObjectivesHierarchyModel => {
  const getDatasets = (sindex: number, aindex: number) =>
    scales.primaries.secondaries[sindex].attributes[aindex]?.datasets;

  const res = cloneDeep(objectives);
  res.primaries.secondaries.forEach(({ attributes }: any, sindex: number) => {
    attributes.forEach(({ datasets }: any, aindex: number) => {
      datasets.forEach(({ properties }: any, dindex: number) => {
        const datasets = getDatasets(sindex, aindex);
        if (datasets && datasets[dindex] && datasets[dindex].properties)
          Object.entries(datasets[dindex].properties).forEach(
            ([key, value]) => (properties[key] = value)
          );
      });
    });
  });

  return res;
};

function ValueScaling({ t, disabled }: any) {
  const property = 'objectives';
  const selector = useAppSelector(selectAnalysis);
  const objectives = selector.properties.objectives as ObjectivesHierarchyModel;
  const dispatch = useAppDispatch();

  const getErrors = selector.properties.objectivesError;
  const isLoading = selector.properties.objectivesLoading;

  const categoryRowFactory = ({ name, key, label, value }: FactoryProps) => {
    return [
      <Control
        label={label}
        key={key('properties.distribution_value')}
        name={name('properties.distribution_value')}
        defaultValue={value}
        type="number"
      />,
    ];
  };

  const categoryFactory = ({ name, key, label, dataset }: FactoryProps) => {
    return (
      <Collapsible title={label}>
        <Control
          label="missing data suitability"
          key={key('datasets') + '.properties.missingDataSuitability'}
          name={name('datasets') + '.properties.missingDataSuitability'}
          defaultValue={dataset.properties.missingDataSuitability}
          type="number"
          required
          // tooltip={t(
          //   'indicate the default suitability value that will be use if data are missing for a cell.'
          // )}
        />
        <SimpleList
          hideLabel
          key={key('datasets')}
          name={name('datasets')}
          factory={categoryRowFactory}
          controls={dataset.properties.distribution.map(
            (_: any, index: number) => ({
              label: dataset.properties.distribution[index],
              value: dataset.properties.distribution_value[index],
            })
          )}
        />
      </Collapsible>
    );
  };

  const functionFactory = ({ name, key, label, dataset }: FactoryProps) => {
    return (
      <Collapsible title={label}>
        <Control
          label="missing data suitability"
          key={key('datasets') + '.properties.missingDataSuitability'}
          name={name('datasets') + '.properties.missingDataSuitability'}
          defaultValue={dataset.properties.missingDataSuitability}
          type="number"
          required
        />
        <Spacer />
        <Control
          label="value scaling function"
          key={key('datasets') + '.properties.valueScalingFunction'}
          name={name('datasets') + '.properties.valueScalingFunction'}
          defaultValue={dataset.properties.valueScalingFunction}
          prefix={<span>f(x) =</span>}
          required
        />
      </Collapsible>
    );
  };

  const attributesFactory = (props: FactoryProps) => {
    const {
      dataset: { type, isCalculated },
    } = props;
    if (type === 'Continuous' || (type === 'Boolean' && isCalculated)) {
      return functionFactory(props);
    } else if (type === 'Categorical') {
      return categoryFactory(props);
    }
  };

  const secondariesFactory = ({
    name,
    key,
    label,
    attributes,
  }: FactoryProps) => {
    return (
      <SimpleList
        hideLabel
        hideArrow
        label={label}
        key={key('attributes')}
        name={name('attributes')}
        factory={attributesFactory}
        controls={attributes.attribute.map((_: any, index: number) => ({
          label: attributes.attribute[index],
          dataset: attributes.datasets[index],
        }))}
      />
    );
  };

  const primariesFactory = ({
    name,
    key,
    label,
    secondaries,
  }: FactoryProps) => {
    return (
      <SimpleList
        hideLabel
        hideArrow
        label={label}
        key={key('secondaries')}
        name={name('secondaries')}
        factory={secondariesFactory}
        controls={secondaries.secondary.map((_: any, index: number) => ({
          label: secondaries.secondary[index],
          attributes: secondaries.attributes[index],
        }))}
      />
    );
  };

  const controls = [
    <SimpleList
      label={objectives.main}
      name={'primaries'}
      factory={primariesFactory}
      controls={objectives.primaries.primary.map((_: any, index: number) => ({
        label: objectives.primaries.primary[index],
        secondaries: objectives.primaries.secondaries[index],
      }))}
    />,
    <Spacer />,
    <Button variant="outline-primary" loading={isLoading}>
      {capitalize(t('apply'))}
    </Button>,
  ];

  return (
    <Form
      controls={controls}
      errors={getErrors}
      disabled={isLoading || disabled}
      onSubmit={(fields: ScalesHierarchy) => {
        dispatch(
          injectSetLoadingCreator({
            value: property,
            isLoading: true,
          } as LoadingValue<string>)()
        );
        dispatch(
          call({
            target: ServerCallTargets.Update,
            args: [property, merge(objectives, fields)],
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

export default withTranslation()(ValueScaling);
