export default interface ValueScalingProperties {
  valueScalingFunction: string;
  distribution: number[] | string[];
  distribution_value: number[];
}

export default interface DatasetModel {
  name: string;
  id: string;
  column: string;
  type: string;
  //columns: string[];
  //head: string[];
  properties: ValueScalingProperties;
  isCalculated: boolean;
  calculationDistance: number;
}

export const DefaultDataset = {
  name: '',
  id: '-1',
  column: '',
  type: '',
  properties: {
    valueScalingFunction: 'x',
    distribution: [] as number[],
    distribution_value: [] as number[],
  } as ValueScalingProperties,
  isCalculated: false,
  calculationDistance: 0,
};
