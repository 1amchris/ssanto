export default interface DatasetModel {
  name: string;
  id: string;
  selectedColumn: string;
  columns: string[];
  head: string[];
  isCalculated: boolean;
  calculationDistance: number;
}

export const DefaultDataset: DatasetModel = {
  name: '',
  id: '-1',
  selectedColumn: '',
  columns: [],
  head: [],
  isCalculated: false,
  calculationDistance: 0,
};
