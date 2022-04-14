export default interface ValueScalingProperties {
  valueScalingFunction: string;
  distribution: number[] | string[];
  distribution_value: number[];
  missingDataSuitability: number;
}

export const DefaultValueScalingProperties = {
  valueScalingFunction: 'x',
  distribution: [] as number[],
  distribution_value: [] as number[],
  missingDataSuitability: 0 as number,
} as ValueScalingProperties;

export default interface DatasetModel {
  name: string;
  column: string;
  type: string;
  max_value: number;
  min_value: number;
  properties: ValueScalingProperties;
  isCalculated: boolean;
  granularity: number;
  centroid: boolean;
  calculationDistance: number;
}
export const DefaultDataset = {
  name: '',
  column: '',
  type: '',
  properties: DefaultValueScalingProperties,
  min_value: 0,
  max_value: 100,
  isCalculated: false,
  granularity: 5,
  centroid: true,
  calculationDistance: 0,
};
