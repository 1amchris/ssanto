export default interface DatasetModel {
  name: string;
  id: string;
  column: string;
  columnType: string;
  //columns: string[];
  //head: string[];
  isCalculated: boolean;
  calculationDistance: number;
}

export const DefaultDataset: DatasetModel = {
  name: '',
  id: '-1',
  column: '',
  columnType: '',
  //columns: [],
  //head: [],
  isCalculated: false,
  calculationDistance: 0,
};
