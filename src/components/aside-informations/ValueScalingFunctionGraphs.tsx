import React from 'react';
import { useAppSelector } from 'store/hooks';
import { selectAnalysis } from 'store/reducers/analysis';
import ObjectivesHierarchyModel from 'models/AnalysisObjectivesModel';
import {
  Control,
  ScalingGraph,
  SimpleList,
  Spacer,
} from 'components/forms/components';
import { FactoryProps } from 'components/forms/components/FormSimpleList';

function ValueScalingFunctionGraphs() {
  const selector = useAppSelector(selectAnalysis);
  const objectives = selector.properties.objectives as ObjectivesHierarchyModel;

  const attributesFactory = ({
    key,
    label,
    dataset,
    xAxis,
    yAxis,
  }: FactoryProps) => {
    const showFunction =
      dataset.type === 'Continuous' ||
      (dataset.type === 'Boolean' && dataset.isCalculated === true);

    return [
      showFunction && (
        <Control
          key={key('label')}
          label={label}
          prefix={<span>f(x) =</span>}
          value={dataset.properties.valueScalingFunction}
          disabled
        />
      ),
      <ScalingGraph
        hideLabel={showFunction}
        label={label}
        xAxis={xAxis}
        yAxis={yAxis}
        key={key('graph') + JSON.stringify(dataset.properties)}
        distribution={dataset.properties.distribution}
        distribution_value={dataset.properties.distribution_value}
        isCalculated={dataset.isCalculated}
        type={dataset.type}
      />,
      <Spacer key={key('spacer')} />,
    ];
  };

  const secondariesFactory = ({
    name,
    key,
    label,
    attributes,
  }: FactoryProps) => {
    return [
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
          xAxis: attributes.datasets[index].column,
          yAxis: 'Suitability',
        }))}
      />,
    ];
  };

  const primariesFactory = ({
    name,
    key,
    label,
    secondaries,
  }: FactoryProps) => {
    return [
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
      />,
    ];
  };

  const rows = [
    <SimpleList
      hideArrow
      hideLabel
      label={objectives.main}
      name={'primaries'}
      key={JSON.stringify(objectives)}
      factory={primariesFactory}
      controls={objectives.primaries.primary.map((_: any, index: number) => ({
        label: objectives.primaries.primary[index],
        secondaries: objectives.primaries.secondaries[index],
      }))}
    />,
  ];

  return (
    <div>
      {rows.map((row: any, index: number) => (
        <div key={`${index}`} className="mb-2">
          {row}
        </div>
      ))}
    </div>
  );
}

export default ValueScalingFunctionGraphs;
