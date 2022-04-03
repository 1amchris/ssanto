export default interface ValueScalingProperties {
  valueScalingFunction: string;
  distribution: number[] | string[];
  distribution_value: number[];
}

export default interface DatasetModel {
  name: string;
  column: string;
  type: string;
  max_value: number;
  min_value: number;
  //columns: string[];
  //head: string[];
  properties: ValueScalingProperties;
  isCalculated: boolean;
  calculationDistance: number;
}

export const DefaultValueScalingProperties = {
  valueScalingFunction: 'x',
  distribution: [] as number[],
  distribution_value: [] as number[],
};

export const DefaultDataset = {
  name: '',
  column: '',
  type: '',
  properties: DefaultValueScalingProperties,
  min_value: 0,
  max_value: 100,
  isCalculated: false,
  calculationDistance: 0,
};
